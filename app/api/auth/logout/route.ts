import { prisma } from "@/lib/prisma"; // Import Prisma client for database operations
import jwt from "jsonwebtoken"; // Import JWT package to verify refresh tokens
import { cookies } from "next/headers"; // Import Next.js cookies utility for server-side cookie access

// Handle POST request for user logout
export async function POST() {
  try {
    // Get cookie storage from request
    const cookieStore = await cookies();

    // Read refresh token from browser cookies
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // Check if refresh token exists
    if (refreshToken) {
      try {
        // Verify refresh token using secret key
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET!,
        ) as { userId: string };

        // Remove stored refresh token from database
        // This prevents reuse of old refresh tokens after logout
        await prisma.user.update({
          where: { id: decoded.userId },
          data: {
            refreshToken: null,
          },
        });
      } catch (tokenError) {
        // If token is expired or invalid,
        // continue logout process without breaking
        console.log("Token invalid or already expired during signout parsing");
      }
    }

    // Delete refresh token cookie immediately from browser
    cookieStore.set("refreshToken", "", {
      httpOnly: true, // Prevent client-side JavaScript access
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "lax", // Protect against some CSRF attacks
      expires: new Date(0), // Expire instantly
      path: "/", // Apply deletion across entire app
    });

    // Return success response
    return Response.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    // Handle unexpected logout errors
    console.error("LOGOUT SYSTEM ERROR:", error);

    // Return failure response
    return Response.json({ error: "Logout failed" }, { status: 500 });
  }
}
