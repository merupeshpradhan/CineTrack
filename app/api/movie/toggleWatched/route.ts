import { NextResponse } from "next/server"; // Import Next.js response helper
import { prisma } from "@/lib/prisma"; // Import Prisma client for database access
import { getCurrentUser } from "@/lib/auth"; // Import helper to get authenticated user
import { revalidatePath } from "next/cache"; // Import cache refresh utility

// Handle POST request to toggle watched/unwatched status
export async function POST(request: Request) {
  try {
    // Get current authenticated user
    const user = await getCurrentUser();

    // Prevent unauthorized access
    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized access. Please sign in again.",
        },
        {
          status: 401,
        },
      );
    }

    // Read movie id from request body
    const { id } = await request.json();

    // Validate movie id
    if (!id) {
      return NextResponse.json(
        {
          error: "Movie identification token (id) is required.",
        },
        {
          status: 400,
        },
      );
    }

    // Find movie and confirm ownership
    // Ensures users can modify only their own movies
    const movie = await prisma.movie.findFirst({
      where: {
        id,

        // Security ownership check
        userId: user.id,
      },
    });

    // Handle:
    // Movie not found OR belongs to another user
    if (!movie) {
      return NextResponse.json(
        {
          error: "Movie record not found or access denied.",
        },
        {
          status: 444,
        },
      );
    }

    // Toggle watched status
    // true → false
    // false → true
    const updatedMovie = await prisma.movie.update({
      where: {
        id,
      },

      data: {
        watched: !movie.watched,
      },
    });

    // Refresh dashboard cache
    // So UI updates instantly
    revalidatePath("/dashboard");

    // Return updated movie data
    return NextResponse.json(
      {
        message: `Movie status marked as ${
          updatedMovie.watched ? "watched" : "unwatched"
        }!`,

        movie: updatedMovie,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    // Log unexpected errors
    console.error("CRITICAL EXCEPTION [API_TOGGLE_WATCHED]:", error);

    // Return failure response
    return NextResponse.json(
      {
        error: "Failed to toggle item completion flag state",

        details: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
