// app/api/auth/refresh/route.ts
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    console.log("[REFRESH ROUTE] Incoming Refresh Token Cookie Value:", refreshToken);

    if (!refreshToken) {
      return Response.json({ error: "Refresh token missing from cookies" }, { status: 401 });
    }

    // Verify validity using your environment variable secret name
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return Response.json({ error: "Token mismatch or user deleted" }, { status: 401 });
    }

    // Generate a brand new 30-second access token
    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "30s" }
    );

    return Response.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("[REFRESH ERROR]", error);
    return Response.json({ error: "Session expired, re-authenticate" }, { status: 401 });
  }
}
