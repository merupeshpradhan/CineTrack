import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (refreshToken) {
      try {
        // 1. Verify the signature using the correct environment variable secret name
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET!,
        ) as { userId: string };

        // 2. Clear out the active database token reference so it can never be reused
        await prisma.user.update({
          where: { id: decoded.userId },
          data: {
            refreshToken: null,
          },
        });
      } catch (tokenError) {
        // If token verification fails (e.g., already expired), log it and continue with cookie clearing
        console.log("Token invalid or already expired during signout parsing");
      }
    }

    // 3. Completely delete the client cookie container by expiring it immediately
    cookieStore.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0), // Sets expiration timestamp to 1970 to force browser clearance
      path: "/",
    });

    return Response.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("LOGOUT SYSTEM ERROR:", error);
    return Response.json({ error: "Logout failed" }, { status: 500 });
  }
}
