import { NextResponse } from "next/server"; // Import Next.js response helper
import { prisma } from "@/lib/prisma"; // Import Prisma client for database operations
import { getCurrentUser } from "@/lib/auth"; // Import helper to get authenticated user
import cloudinary from "@/lib/cloudinary"; // Import Cloudinary for image uploads
import { revalidatePath } from "next/cache"; // Import cache revalidation utility

// Handle POST request to update an existing movie
export async function POST(request: Request) {
  try {
    // Get current logged-in user
    const user = await getCurrentUser();

    // Prevent unauthorized users
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

    // Read multipart form data
    const formData = await request.formData();

    // Extract movie data from form
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const genre = formData.get("genre") as string;
    const duration = formData.get("duration") as string;
    const watchDate = formData.get("watchDate") as string;

    // Convert watched value into boolean
    const watched = formData.get("watched") === "true";

    // Optional location
    const location = formData.get("location") as string | null;

    // Optional uploaded image
    const image = formData.get("image") as File | null;

    // Validate required fields
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

    // Find movie and confirm ownership
    const movie = await prisma.movie.findFirst({
      where: {
        id,

        // Security check → only owner can edit
        userId: user.id,
      },
    });

    // Handle missing movie
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

    // Store uploaded image URL if new image exists
    let imageUrl: string | undefined;

    // Upload image only when user provides one
    if (image && image.size > 0) {
      // Convert image into ArrayBuffer
      const bytes = await image.arrayBuffer();

      // Convert ArrayBuffer into Buffer
      const buffer = Buffer.from(bytes);

      // Convert buffer into Base64 string
      const base64 = `data:${image.type};base64,${buffer.toString("base64")}`;

      // Upload image to Cloudinary
      const upload = await cloudinary.uploader.upload(base64, {
        folder: "movie-watchlist",
      });

      // Save uploaded image URL
      imageUrl = upload.secure_url;
    }

    // Update movie record
    const updatedMovie = await prisma.movie.update({
      where: {
        id,
      },

      data: {
        title, // Updated title

        genre, // Updated genre

        duration, // Updated duration

        watchDate: new Date(watchDate), // Convert date string

        watched, // Updated watched state

        // Clean location before saving
        location: location ? location.trim() : null,

        // Update image only if new image exists
        ...(imageUrl && {
          imageUrl,
        }),
      },
    });

    // Refresh dashboard page cache
    revalidatePath("/dashboard");

    // Refresh individual movie page cache
    revalidatePath(`/dashboard/movie/${id}`);

    // Return updated movie
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
    // Log server errors
    console.error(error);

    // Return failure response
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
