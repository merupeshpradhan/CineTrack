"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { transporter } from "@/lib/mail";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

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

  const cookieStore = await cookies();

  cookieStore.set("session", user.id, {
    httpOnly: true,
    secure: false,
    path: "/",
  });

  return { success: true };
}

export async function logout() {
  "use server";

  const cookieStore = await cookies();

  cookieStore.delete("session");

  redirect("/");
}

export async function addMovie(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const watchDate = formData.get("watchDate") as string;
  const image = formData.get("image") as File;

  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session,
    },
  });

  if (!user) {
    redirect("/");
  }

  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const base64 = `data:${image.type};base64,${buffer.toString("base64")}`;

  const uploadResponse = await cloudinary.uploader.upload(base64, {
    folder: "movie-watchlist",
  });

  await prisma.movie.create({
  data: {
    title,
    description,
    watchDate: new Date(watchDate),
    imageUrl: uploadResponse.secure_url,
    userId: user.id,
  },
});

revalidatePath("/dashboard");

return { success: true };
}

export async function deleteMovie(movieId: string) {
  "use server";

  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    redirect("/");
  }

  await prisma.movie.delete({
    where: { id: movieId },
  });

  revalidatePath("/dashboard");

  return { success: true };
}

export async function updateMovie(movieId: string, formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const watchDate = formData.get("watchDate") as string;

await prisma.movie.update({
  where: { id: movieId },
  data: {
    title,
    description,
    watchDate: new Date(watchDate),
  },
});

revalidatePath("/dashboard");

return { success: true };
}

export async function toggleWatched(id: string) {
  const movie = await prisma.movie.findUnique({
    where: { id },
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
