import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    // 1. Verify the server-side user session via cookies
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized access. Please log in." },
        { status: 401 },
      );
    }

    // 2. Extract the target movieId from the request body
    const { movieId } = await request.json();
    if (!movieId) {
      return NextResponse.json(
        { error: "Movie identifier parameter (movieId) is required." },
        { status: 400 },
      );
    }

    // 3. Delete the movie record safely using deleteMany to double-check account ownership
    const deleteResult = await prisma.movie.deleteMany({
      where: {
        id: movieId,
        userId: user.id, // 🔒 Security layer: Ensures a user can only delete their own entries
      },
    });

    // Handle edge case where the record doesn't exist or doesn't belong to this account
    if (deleteResult.count === 0) {
      return NextResponse.json(
        { error: "Movie record not found or permission denied." },
        { status: 404 },
      );
    }

    // 4. Force Next.js to purge layout caches so the dashboard view updates instantly
    revalidatePath("/dashboard");

    return NextResponse.json(
      {
        success: true,
        message: "Movie entry scrubbed from catalog successfully.",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("CRITICAL EXCEPTION [API_DELETE_MOVIE]:", error);
    return NextResponse.json(
      {
        error: "Internal server error occurred during deletion sequence.",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
