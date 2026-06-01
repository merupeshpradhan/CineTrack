"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { transporter } from "@/lib/mail";

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

  redirect(`/verify?email=${email}`);
}

export async function verifyOTP(email: string, otp: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return false;

  if (user.otp !== otp) return false;

  if (!user.otpExpiry || user.otpExpiry < new Date()) {
    return false;
  }

  const cookieStore = await cookies();

  cookieStore.set("session", user.id, {
    httpOnly: true,
    secure: false,
    path: "/",
  });

  redirect("/dashboard");
}

export async function logout() {
  "use server";

  const cookieStore = await cookies();

  cookieStore.delete("session");

  redirect("/");
}
