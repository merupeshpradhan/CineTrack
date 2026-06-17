// Stores access token only in memory
// (disappears after page refresh)
let memoryAccessToken: string | null = null;

// Prevent multiple refresh requests at same time
let activeRefreshPromise: Promise<boolean> | null = null;

// Save access token into memory
export const setAccessToken = (token: string | null) => {
  memoryAccessToken = token;
};

// Get current access token
export const getAccessToken = () => memoryAccessToken;

// Authenticated fetch wrapper
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // STEP 1
  // No access token?
  // Try silent refresh BEFORE API call

  if (!memoryAccessToken) {
    if (!activeRefreshPromise) {
      activeRefreshPromise = refreshAccessTokenSilently();
    }

    await activeRefreshPromise;

    activeRefreshPromise = null;
  }

  // Add request headers
  options.headers = {
    ...options.headers,

    "Content-Type": "application/json",

    // Add Authorization only if token exists
    ...(memoryAccessToken
      ? {
          Authorization: `Bearer ${memoryAccessToken}`,
        }
      : {}),
  };

  // Execute target request
  let response = await fetch(url, options);

  // STEP 2
  // Token expired?
  // Refresh and retry

  if (response.status === 401) {
    if (!activeRefreshPromise) {
      activeRefreshPromise = refreshAccessTokenSilently();
    }

    const refreshSuccess = await activeRefreshPromise;

    activeRefreshPromise = null;

    // Retry original request
    if (refreshSuccess && memoryAccessToken) {
      options.headers = {
        ...options.headers,

        Authorization: `Bearer ${memoryAccessToken}`,
      };

      response = await fetch(url, options);
    } else {
      // Session expired
      // Clear token and redirect

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        setAccessToken(null);

        window.location.href = "/login";
      }
    }
  }

  return response;
}

// Refresh access token
async function refreshAccessTokenSilently(): Promise<boolean> {
  try {
    const res = await fetch(
      "/api/auth/refresh",

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) return false;

    const data = await res.json();

    if (data.accessToken) {
      setAccessToken(data.accessToken);

      return true;
    }

    return false;
  } catch (error) {
    console.error("Token recovery background network call crashed:", error);

    return false;
  }
}
