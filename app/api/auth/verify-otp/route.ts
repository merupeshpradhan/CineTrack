import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return Response.json(
        { error: "Email and OTP are required" },
        { status: 400 },
      );
    }

    // 1. Find the user by email to inspect their stored OTP data
    const userRecord = await prisma.user.findUnique({
      where: { email },
    });

    // 2. Validate user existence and check if the OTP matches
    if (!userRecord || userRecord.otp !== otp) {
      return Response.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // 3. Verify if the OTP has expired
    if (!userRecord.otpExpiry || userRecord.otpExpiry < new Date()) {
      return Response.json({ error: "OTP expired" }, { status: 400 });
    }

    // 4. Clear the OTP fields immediately so this code cannot be reused
    let user = await prisma.user.update({
      where: { email },
      data: {
        otp: null,
        otpExpiry: null,
      },
    });

    // 5. Generate short-lived access token for quick testing
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "30s" },
    );

    // 6. Generate long-lived refresh token
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" },
    );

    // 7. Save the refresh token to your Neon database row
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // 8. Inject the HttpOnly cookie securely so your application proxy can read it
    const cookieStore = await cookies();
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    // 9. Return both the short-lived access token and user metadata to your frontend
    return Response.json({
      accessToken,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("VERIFY OTP CRITICAL ERROR:", error);
    return Response.json(
      { error: "Verification process failed" },
      { status: 500 },
    );
  }
}
