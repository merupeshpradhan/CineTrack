import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json(
        { error: "Email address is required" },
        { status: 400 },
      );
    }

    // 1. Generate a secure 6-digit OTP string
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Set an expiration timestamp (5 minutes from now)
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000);

    // 3. Save directly to the User model using an upsert action
    await prisma.user.upsert({
      where: { email },
      update: {
        otp: otp,
        otpExpiry: expiryTime,
      },
      create: {
        email,
        otp: otp,
        otpExpiry: expiryTime,
      },
    });

    // 4. Configure your Nodemailer transport setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 5. Send out the generated verification code via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Login OTP",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    return Response.json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);

    return Response.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
