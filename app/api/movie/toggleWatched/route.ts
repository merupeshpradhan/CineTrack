import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    // 1. Authenticate the server-side user session
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized access. Please sign in again." },
        { status: 401 },
      );
    }

    // 2. Parse the target movie ID from the request JSON body
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: "Movie identification token (id) is required." },
        { status: 400 },
      );
    }

    // 3. Find the movie and confirm it belongs to the authenticated user
    const movie = await prisma.movie.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!movie) {
      return NextResponse.json(
        { error: "Movie record not found or access denied." },
        { status: 444 },
      );
    }

    // 4. Update the database row by reversing the current watched boolean status flag
    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: {
        watched: !movie.watched,
      },
    });

    // 5. Purge Next.js layout caches to push structural UI updates immediately
    revalidatePath("/dashboard");

    return NextResponse.json(
      {
        message: `Movie status marked as ${updatedMovie.watched ? "watched" : "unwatched"}!`,
        movie: updatedMovie,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("CRITICAL EXCEPTION [API_TOGGLE_WATCHED]:", error);
    return NextResponse.json(
      {
        error: "Failed to toggle item completion flag state",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
