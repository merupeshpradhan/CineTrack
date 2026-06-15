// lib/api-client.ts

let memoryAccessToken: string | null = null;
let activeRefreshPromise: Promise<boolean> | null = null;

export const setAccessToken = (token: string | null) => {
  memoryAccessToken = token;
};

export const getAccessToken = () => memoryAccessToken;

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // 1. If we don't have a token in RAM, try to get one silently BEFORE making the target call
  if (!memoryAccessToken) {
    if (!activeRefreshPromise) {
      activeRefreshPromise = refreshAccessTokenSilently();
    }
    await activeRefreshPromise;
    activeRefreshPromise = null;
  }

  options.headers = {
    ...options.headers,
    "Content-Type": "application/json",
    ...(memoryAccessToken ? { Authorization: `Bearer ${memoryAccessToken}` } : {}),
  };

  let response = await fetch(url, options);

  // 2. If it STILL returns 401, the token just expired midway. Refresh it right here.
  if (response.status === 401) {
    if (!activeRefreshPromise) {
      activeRefreshPromise = refreshAccessTokenSilently();
    }
    const refreshSuccess = await activeRefreshPromise;
    activeRefreshPromise = null;

    if (refreshSuccess && memoryAccessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${memoryAccessToken}`,
      };
      response = await fetch(url, options);
    } else {
      // Session completely dead -> clear and kick to login screen
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        setAccessToken(null);
        window.location.href = "/login";
      }
    }
  }

  return response;
}

async function refreshAccessTokenSilently(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/refresh", { 
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    
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
