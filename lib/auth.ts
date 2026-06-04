import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/jwt";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return null;

  try {
    const decoded = verifyAccessToken(accessToken) as {
      userId: string;
    };

    return await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });
  } catch {
    return null;
  }
}
