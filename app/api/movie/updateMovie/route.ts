// app/api/movie/updateMovie/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
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

    // 2. Parse the incoming multipart form data fields
    const formData = await request.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const watchDate = formData.get("watchDate") as string;
    const image = formData.get("image") as File | null;

    if (!id || !title || !watchDate) {
      return NextResponse.json(
        { error: "Movie ID, title, and watch date are required fields." },
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
        { status: 404 },
      );
    }

    let updatedImageUrl: string | undefined;

    // 4. Upload new image stream to Cloudinary only if a new file is provided
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Data = `data:${image.type};base64,${buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(base64Data, {
        folder: "movie-watchlist",
      });
      updatedImageUrl = uploadResponse.secure_url;
    }

    // 5. Update the collection row inside your database
    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: {
        title,
        description: description || "",
        watchDate: new Date(watchDate),
        // Spread syntax ensures we only overwrite imageUrl if a new one was uploaded
        ...(updatedImageUrl && { imageUrl: updatedImageUrl }),
      },
    });

    // 6. Purge Next.js layout caches to push structural UI updates immediately
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/movie/${id}`);

    return NextResponse.json(
      {
        success: true,
        message: "Movie entry updated successfully.",
        movie: updatedMovie,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("CRITICAL EXCEPTION [API_UPDATE_MOVIE]:", error);
    return NextResponse.json(
      {
        error: "Internal server error occurred during update sequence.",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
