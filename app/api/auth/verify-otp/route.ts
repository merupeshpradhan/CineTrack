import { prisma } from "@/lib/prisma"; // Import Prisma client for database operations
import jwt from "jsonwebtoken"; // Import JWT package for token generation
import { cookies } from "next/headers"; // Import Next.js cookie utility

// Handle POST request for OTP verification and login
export async function POST(req: Request) {
  try {
    // Extract email and OTP from request body
    const { email, otp } = await req.json();

    // Validate required inputs
    if (!email || !otp) {
      return Response.json(
        { error: "Email and OTP are required" },
        { status: 400 },
      );
    }

    // Find user record using email
    const userRecord = await prisma.user.findUnique({
      where: { email },
    });

    // Check:
    // 1. User exists
    // 2. Entered OTP matches database OTP
    if (!userRecord || userRecord.otp !== otp) {
      return Response.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Check whether OTP has expired
    if (!userRecord.otpExpiry || userRecord.otpExpiry < new Date()) {
      return Response.json({ error: "OTP expired" }, { status: 400 });
    }

    // Clear OTP immediately after successful verification
    // Prevents OTP reuse
    let user = await prisma.user.update({
      where: { email },
      data: {
        otp: null,
        otpExpiry: null,
      },
    });

    // Generate short-lived access token
    // Used for accessing protected APIs
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "30s",
      },
    );

    // Generate refresh token
    // Used to create new access tokens later
    const refreshToken = jwt.sign(
      {
        userId: user.id,
      },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "7d",
      },
    );

    // Store refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
      },
    });

    // Store refresh token inside secure HttpOnly cookie
    const cookieStore = await cookies();

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === "production", // HTTPS in production
      sameSite: "lax", // Basic CSRF protection
      maxAge: 7 * 24 * 60 * 60, // Cookie valid for 7 days
      path: "/", // Available across app
    });

    // Return access token and user data
    return Response.json({
      accessToken,

      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    // Log unexpected server errors
    console.error("VERIFY OTP CRITICAL ERROR:", error);

    // Return failure response
    return Response.json(
      {
        error: "Verification process failed",
      },
      {
        status: 500,
      },
    );
  }
}
