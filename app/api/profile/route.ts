import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    // 🔒 Security check: Block if the token is missing
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {
      // 🔑 Verify the access token signature
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
        userId: string;
      };

      // Fetch the authenticated user's profile details from Neon
      const userProfile = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      return Response.json(userProfile);
    } catch {
      // 🔄 Trigger silent token rotation on the frontend
      return Response.json({ error: "Access token expired" }, { status: 401 });
    }
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch profile data" },
      { status: 500 },
    );
  }
}
