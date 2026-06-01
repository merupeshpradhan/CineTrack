import { prisma } from "@/lib/prisma";

export default async function TestPage() {
  const users = await prisma.user.findMany();

  return (
    <div>
      <h1>Database Connected ✅</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}