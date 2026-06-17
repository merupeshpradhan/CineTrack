import { prisma } from "@/lib/prisma"; // Import Prisma client to access database
import jwt from "jsonwebtoken"; // Import JWT package for token verification and generation
import { cookies } from "next/headers"; // Import Next.js cookies utility

// Handle POST request to refresh expired access token
export async function POST() {
  try {
    // Get server-side cookie storage
    const cookieStore = await cookies();

    // Read refresh token from browser cookies
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // Log incoming refresh token for debugging
    console.log(
      "[REFRESH ROUTE] Incoming Refresh Token Cookie Value:",
      refreshToken,
    );

    // If refresh token does not exist, deny access
    if (!refreshToken) {
      return Response.json(
        { error: "Refresh token missing from cookies" },
        { status: 401 },
      );
    }

    // Verify refresh token using secret key
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as { userId: string };

    // Find user from database using decoded userId
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    // Check:
    // 1. User exists
    // 2. Stored refresh token matches current cookie token
    if (!user || user.refreshToken !== refreshToken) {
      return Response.json(
        { error: "Token mismatch or user deleted" },
        { status: 401 },
      );
    }

    // Generate a new short-lived access token
    // Access token is used for protected API access
    const newAccessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "30s",
      },
    );

    // Return new access token to frontend
    return Response.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    // Handle token verification or unexpected errors
    console.error("[REFRESH ERROR]", error);

    // Ask user to login again
    return Response.json(
      { error: "Session expired, re-authenticate" },
      { status: 401 },
    );
  }
}
