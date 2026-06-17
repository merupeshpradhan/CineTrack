// Read cookies from server request
import { cookies } from "next/headers";

// Database connection
import { prisma } from "./prisma";

// JWT verification library
import jwt from "jsonwebtoken";

export async function getCurrentUser() {
  // Read cookie storage
  const cookieStore = await cookies();

  // Get access token
  const accessToken = cookieStore.get("accessToken")?.value;

  // ==========================
  // STEP 1
  // FAST AUTH USING ACCESS TOKEN
  // ==========================

  try {
    if (accessToken) {
      // Decode and verify token
      const decoded = jwt.verify(
        accessToken,

        process.env.ACCESS_TOKEN_SECRET!,
      ) as {
        userId: string;
      };

      // Fetch user
      return await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },
      });
    }
  } catch (accessTokenError) {
    // Access token invalid
    console.log("[AUTH SYSTEM] ACCESS TOKEN EXPIRED OR INVALID");
  }

  // ==========================
  // STEP 2
  // FALLBACK TO REFRESH TOKEN
  // ==========================

  const refreshToken = cookieStore.get("refreshToken")?.value;

  console.log("[AUTH SYSTEM] HAS REFRESH TOKEN COOKIE:", !!refreshToken);

  // No refresh token
  if (!refreshToken) {
    return null;
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,

      process.env.REFRESH_TOKEN_SECRET!,
    ) as {
      userId: string;
    };

    // Load user
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    // User missing
    if (!user) {
      return null;
    }

    // Security validation
    // Token must match DB

    if (user.refreshToken !== refreshToken) {
      console.log(
        "[AUTH SYSTEM] WARNING: Stale or rolled refresh token detected.",
      );

      return null;
    }

    // Valid refresh session
    // Return authenticated user

    return user;
  } catch (error) {
    console.log(
      "[AUTH SYSTEM] REFRESH TOKEN VALIDATION CRITICAL ERROR:",
      error,
    );

    return null;
  }
}
