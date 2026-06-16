import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized access",
        },
        {
          status: 401,
        },
      );
    }

    const formData = await request.formData();

    const title = formData.get("title") as string;
    const genre = formData.get("genre") as string;
    const duration = formData.get("duration") as string;
    const watchDate = formData.get("watchDate") as string;
    const image = formData.get("image") as File | null;

    if (!title || !genre || !duration || !watchDate) {
      return NextResponse.json(
        {
          error: "Fill all required fields",
        },
        {
          status: 400,
        },
      );
    }

    let uploadedImageUrl = "";

    if (image && image.size > 0) {
      const arrayBuffer = await image.arrayBuffer();

      const buffer = Buffer.from(arrayBuffer);
      const base64 = `data:${image.type};base64,${buffer.toString("base64")}`;

      const upload = await cloudinary.uploader.upload(base64, {
        folder: "movie-watchlist",
      });

      uploadedImageUrl = upload.secure_url;
    } else {
      uploadedImageUrl = "https://unsplash.com";
    }

    const newMovie = await prisma.movie.create({
      data: {
        title,
        genre,
        duration,
        watchDate: new Date(watchDate),
        imageUrl: uploadedImageUrl,

        watched: false,

        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Movie saved successfully",
        movie: newMovie,
      },
      {
        status: 201,
      },
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error: error.message || "Failed to save movie",
      },
      {
        status: 500,
      },
    );
  }
}
