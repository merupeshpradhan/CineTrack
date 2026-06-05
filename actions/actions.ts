"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { transporter } from "@/lib/mail";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
} from "@/lib/jwt";

export async function sendOTP(email: string) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.user.upsert({
    where: { email },
    update: { otp, otpExpiry },
    create: { email, otp, otpExpiry },
  });

  await transporter.sendMail({
    from: `"Movie Watchlist App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `
      <h2>Your OTP is:</h2>
      <h1>${otp}</h1>
      <p>This OTP will expire in 5 minutes.</p>
    `,
  });

  console.log("Email sent to:", email);

  return {
    success: true,
    email,
  };
}

export async function verifyOTP(email: string, otp: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return { success: false };

  if (user.otp !== otp) return { success: false };

  if (!user.otpExpiry || user.otpExpiry < new Date()) {
    return { success: false };
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken,
    },
  });

  const cookieStore = await cookies();

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (refreshToken) {
    await prisma.user.updateMany({
      where: {
        refreshToken,
      },
      data: {
        refreshToken: null,
      },
    });
  }

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  redirect("/");
}

async function getCurrentUser() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return null;

  try {
    const decoded = verifyAccessToken(accessToken) as {
      userId: string;
    };

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    return user;
  } catch {
    return null;
  }
}

export async function addMovie(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const watchDate = formData.get("watchDate") as string;
    const image = formData.get("image") as File;

    // 1. Session Authenticity Check Validation
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: "User account records missing or corrupted.",
      };
    }

    // 2. Structural Image Validation Catch
    if (!image || image.size === 0) {
      return {
        success: false,
        message: "Image upload is required. Please select a valid file.",
      };
    }

    // 3. Convert Binary Streaming Array to Base64 Image Strings
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${image.type};base64,${buffer.toString("base64")}`;

    // 4. Secure Asset Transmission directly up to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64, {
      folder: "movie-watchlist",
    });

    // 5. Commit Complete Records Object Structure safely inside Prisma Databases
    await prisma.movie.create({
      data: {
        title,
        description,
        watchDate: new Date(watchDate),
        imageUrl: uploadResponse.secure_url,
        userId: user.id,
        // CRITICAL FIX: Explicitly default watched state value mapping
        watched: false,
      },
    });

    // 6. Purge active caching frames to trigger rapid Client Dashboard refreshes
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("SERVER SIDE EXCEPTION [addMovie]:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Database ingestion sequence failed.",
    };
  }
}

export async function deleteMovie(movieId: string) {
  "use server";

  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  await prisma.movie.deleteMany({
    where: {
      id: movieId,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard");

  return { success: true };
}

export async function updateMovie(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false };
  }

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const watchDate = formData.get("watchDate") as string;

  const image = formData.get("image") as File | null;

  const movie = await prisma.movie.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!movie) {
    return { success: false };
  }

  let imageUrl: string | undefined;

  // ✅ Upload new image only if provided
  if (image && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64 = `data:${image.type};base64,${buffer.toString("base64")}`;

    const uploadResponse = await cloudinary.uploader.upload(base64, {
      folder: "movie-watchlist",
    });

    imageUrl = uploadResponse.secure_url;
  }

  await prisma.movie.update({
    where: { id },
    data: {
      title,
      description,
      watchDate: new Date(watchDate),

      // ✅ only update image if new one exists
      ...(imageUrl && { imageUrl }),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/movie/${id}`);

  return { success: true };
}

export async function toggleWatched(id: string) {
  const user = await getCurrentUser();

  if (!user) {
    return;
  }

  const movie = await prisma.movie.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!movie) return;

  await prisma.movie.update({
    where: { id },
    data: {
      watched: !movie.watched,
    },
  });

  revalidatePath("/dashboard");
}
