import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

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

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const genre = formData.get("genre") as string;
    const duration = formData.get("duration") as string;
    const watchDate = formData.get("watchDate") as string;
    const watched = formData.get("watched") === "true";
    const image = formData.get("image") as File | null;

    if (!id || !title || !genre || !duration || !watchDate) {
      return NextResponse.json(
        {
          error: "All fields are required",
        },
        {
          status: 400,
        },
      );
    }

    const movie = await prisma.movie.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!movie) {
      return NextResponse.json(
        {
          error: "Movie not found",
        },
        {
          status: 404,
        },
      );
    }

    let imageUrl: string | undefined;

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${image.type};base64,${buffer.toString("base64")}`;

      const upload = await cloudinary.uploader.upload(base64, {
        folder: "movie-watchlist",
      });

      imageUrl = upload.secure_url;
    }

    const updatedMovie = await prisma.movie.update({
      where: {
        id,
      },

      data: {
        title,
        genre,
        duration,
        watchDate: new Date(watchDate),
        watched,

        ...(imageUrl && {
          imageUrl,
        }),
      },
    });

    revalidatePath("/dashboard");

    revalidatePath(`/dashboard/movie/${id}`);

    return NextResponse.json(
      {
        success: true,

        movie: updatedMovie,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
