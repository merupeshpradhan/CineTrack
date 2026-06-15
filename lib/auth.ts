// lib/auth.ts
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import jwt from "jsonwebtoken"; // ✅ FIXED: Replaced missing ./jwt file with official package

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  // 1. First Pass: Fast authorization attempt using the Access Token string
  try {
    if (accessToken) {
      // ✅ FIXED: Using direct jwt verification with your explicit .env secret key
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!,
      ) as { userId: string };

      return await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
    }
  } catch (accessTokenError) {
    console.log("[AUTH SYSTEM] ACCESS TOKEN EXPIRED OR INVALID");
  }

  // 2. Second Pass: Fallback validation lookup via the secure Refresh Token Cookie
  const refreshToken = cookieStore.get("refreshToken")?.value;
  console.log("[AUTH SYSTEM] HAS REFRESH TOKEN COOKIE:", !!refreshToken);

  if (!refreshToken) {
    return null;
  }

  try {
    // ✅ FIXED: Using direct jwt verification with your explicit .env secret key
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as { userId: string };

    // Fetch the user matching the decoded payload key
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return null;
    }

    // Security Check: Block session if the token does not match the active DB string
    if (user.refreshToken !== refreshToken) {
      console.log(
        "[AUTH SYSTEM] WARNING: Stale or rolled refresh token detected.",
      );
      return null;
    }

    // ❌ AS REQUESTED: DON'T CREATE ACCESS TOKEN HERE
    // ❌ AS REQUESTED: DON'T SET COOKIE HERE
    return user;
  } catch (error) {
    console.log(
      "[AUTH SYSTEM] REFRESH TOKEN VALIDATION CRITICAL ERROR:",
      error,
    );
    return null;
  }
}
