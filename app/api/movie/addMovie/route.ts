// app/api/movie/addMovie/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    // 1. Authenticate the server-side user session using your working cookie firewall helper
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized access. Please log in again." },
        { status: 401 },
      );
    }

    // 2. Parse the incoming request multipart form payload fields
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const watchDate = formData.get("watchDate") as string;
    const image = formData.get("image") as File | null;

    // Validation Check: Title and Watch Date parameters are mandatory fields
    if (!title || !watchDate) {
      return NextResponse.json(
        {
          error:
            "Movie title and scheduled watch date parameters are required.",
        },
        { status: 400 },
      );
    }

    let uploadedImageUrl = null;

    // 3. Process the file payload buffer and pipe it directly to Cloudinary if an image is provided
    if (image && image.size > 0) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Data = `data:${image.type};base64,${buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(base64Data, {
        folder: "movie-watchlist",
      });
      uploadedImageUrl = uploadResponse.secure_url;
    } else {
      // Fallback baseline image vector placeholder asset if none is attached by the user
      uploadedImageUrl = "https://unsplash.com";
    }

    // 4. Commit and inject the completely unified Movie model record row inside Neon PostgreSQL
    const newMovie = await prisma.movie.create({
      data: {
        title,
        description: description || "",
        watchDate: new Date(watchDate),
        imageUrl: uploadedImageUrl,
        userId: user.id,
        watched: false, // Default initial status set directly to uncompleted queue state
      },
    });

    return NextResponse.json(
      {
        message: "Movie entry added to your collection successfully!",
        movie: newMovie,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("CRITICAL EXCEPTION [API_ADD_MOVIE]:", error);
    return NextResponse.json(
      { error: "Failed to store collection item row", details: error.message },
      { status: 500 },
    );
  }
}
