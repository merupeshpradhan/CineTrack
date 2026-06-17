import { prisma } from "@/lib/prisma"; // Import Prisma client for database queries
import jwt from "jsonwebtoken"; // Import JWT package for token verification

// Handle GET request to fetch authenticated user profile
export async function GET(request: Request) {
  try {
    // Read Authorization header
    const authHeader = request.headers.get("authorization");

    // Validate authorization format
    // Expected format → Bearer <access_token>
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    // Extract access token from header
    const token = authHeader.split(" ")[1];

    try {
      // Verify access token using secret key
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
        userId: string;
      };

      // Fetch logged-in user's profile
      // Only selected fields are returned
      const userProfile = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },

        select: {
          id: true, // User ID

          email: true, // User email

          createdAt: true, // Account creation date
        },
      });

      // Return profile data
      return Response.json(userProfile);
    } catch {
      // Access token invalid or expired
      // Frontend can use refresh token flow
      return Response.json(
        {
          error: "Access token expired",
        },
        {
          status: 401,
        },
      );
    }
  } catch (error) {
    // Handle unexpected server errors
    return Response.json(
      {
        error: "Failed to fetch profile data",
      },
      {
        status: 500,
      },
    );
  }
}
