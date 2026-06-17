import { NextResponse } from "next/server"; // Import Next.js response utility
import { prisma } from "@/lib/prisma"; // Import Prisma client for database operations
import { getCurrentUser } from "@/lib/auth"; // Import helper to get logged-in user
import { revalidatePath } from "next/cache"; // Import cache revalidation helper

// Handle POST request to delete a movie
export async function POST(request: Request) {
  try {
    // Get currently authenticated user
    const user = await getCurrentUser();

    // Block access if user is not logged in
    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized access. Please log in.",
        },
        {
          status: 401,
        },
      );
    }

    // Read request body
    const { movieId } = await request.json();

    // Validate movie id
    if (!movieId) {
      return NextResponse.json(
        {
          error: "Movie identifier parameter (movieId) is required.",
        },
        {
          status: 400,
        },
      );
    }

    // Delete movie only if:
    // 1. Movie ID exists
    // 2. Movie belongs to logged-in user
    const deleteResult = await prisma.movie.deleteMany({
      where: {
        id: movieId,

        // Security check → users cannot delete others' movies
        userId: user.id,
      },
    });

    // Handle case:
    // Movie not found OR not owned by current user
    if (deleteResult.count === 0) {
      return NextResponse.json(
        {
          error: "Movie record not found or permission denied.",
        },
        {
          status: 404,
        },
      );
    }

    // Clear dashboard cache
    // Forces fresh data to appear immediately
    revalidatePath("/dashboard");

    // Return success response
    return NextResponse.json(
      {
        success: true,

        message: "Movie entry scrubbed from catalog successfully.",
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    // Log unexpected server errors
    console.error("CRITICAL EXCEPTION [API_DELETE_MOVIE]:", error);

    // Return server failure response
    return NextResponse.json(
      {
        error: "Internal server error occurred during deletion sequence.",

        details: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
