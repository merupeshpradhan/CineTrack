import { prisma } from "@/lib/prisma"; // Import Prisma client for database operations
import jwt from "jsonwebtoken"; // Import JWT package for access token verification

// Handle GET request to fetch users list
export async function GET(request: Request) {
  try {
    // Read Authorization header
    const authHeader = request.headers.get("authorization");

    // Validate authorization format
    // Expected → Bearer <access_token>
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json(
        {
          error: "Unauthorized access",
        },
        {
          status: 401,
        },
      );
    }

    // Extract access token
    const token = authHeader.split(" ")[1];

    try {
      // Verify token signature using secret key
      // Blocks expired or modified tokens
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    } catch {
      // Token expired or invalid
      // Frontend can trigger refresh token flow
      return Response.json(
        {
          error: "Access token expired",
        },
        {
          status: 401,
        },
      );
    }

    // Fetch all users
    // Only expose safe public fields
    const users = await prisma.user.findMany({
      select: {
        id: true, // User ID

        email: true, // User email

        createdAt: true, // Account creation date

        // Sensitive fields intentionally excluded:
        // otp
        // otpExpiry
        // refreshToken
      },
    });

    // Return users list
    return Response.json(users, {
      status: 200,
    });
  } catch (error: any) {
    // Log server errors
    console.error("GET USERS ERROR:", error);

    // Return failure response
    return Response.json(
      {
        error: "Failed to fetch users registry metadata",
      },
      {
        status: 500,
      },
    );
  }
}
