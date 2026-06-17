import { NextResponse } from "next/server"; // Import Next.js response helper
import { prisma } from "@/lib/prisma"; // Import Prisma client for database operations
import { getCurrentUser } from "@/lib/auth"; // Import helper to get logged-in user
import cloudinary from "@/lib/cloudinary"; // Import Cloudinary for image uploads

// Handle POST request to add a new movie
export async function POST(request: Request) {
  try {
    // Get currently authenticated user
    const user = await getCurrentUser();

    // Prevent unauthenticated users from creating movies
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

    // Extract form fields
    const title = formData.get("title") as string;
    const genre = formData.get("genre") as string;
    const duration = formData.get("duration") as string;
    const watchDate = formData.get("watchDate") as string;

    // Optional location field
    const location = formData.get("location")?.toString().trim();

    // Optional uploaded image
    const image = formData.get("image") as File | null;

    // Validate required fields
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

    // Variable to store final image URL
    let uploadedImageUrl = "";

    // Upload image only if file exists
    if (image && image.size > 0) {
      // Convert uploaded file into ArrayBuffer
      const arrayBuffer = await image.arrayBuffer();

      // Convert ArrayBuffer into Node.js Buffer
      const buffer = Buffer.from(arrayBuffer);

      // Convert buffer into Base64 format
      const base64 = `data:${image.type};base64,${buffer.toString("base64")}`;

      // Upload image to Cloudinary
      const upload = await cloudinary.uploader.upload(base64, {
        folder: "movie-watchlist",
      });

      // Store uploaded image URL
      uploadedImageUrl = upload.secure_url;
    } else {
      // Use fallback image URL if no image uploaded
      uploadedImageUrl = "https://unsplash.com";
    }

    // Save movie data into database
    const newMovie = await prisma.movie.create({
      data: {
        title, // Movie title

        genre, // Movie genre

        duration, // Movie duration

        watchDate: new Date(watchDate), // Convert string to Date

        location, // Optional watch location

        imageUrl: uploadedImageUrl, // Uploaded image URL

        watched: false, // Default watch status

        userId: user.id, // Connect movie to logged-in user
      },
    });

    // Return success response
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
    // Log server errors
    console.error(error);

    // Return failure response
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
