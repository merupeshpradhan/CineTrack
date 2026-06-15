import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {
      // 1. Verify token signature against your active secret key payload
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    } catch {
      // Return 401 if token is expired or tampered with so the frontend can intercept and hit /api/auth/refresh
      return Response.json({ error: "Access token expired" }, { status: 401 });
    }

    // 2. Fetch users while specifically filtering out sensitive tokens and hashes
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        // Explicitly omitting otp, otpExpiry, and refreshToken for security
      },
    });

    return Response.json(users, { status: 200 });
  } catch (error: any) {
    console.error("GET USERS ERROR:", error);
    return Response.json(
      { error: "Failed to fetch users registry metadata" },
      { status: 500 },
    );
  }
}
