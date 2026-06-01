import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logout } from "@/actions/actions";

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const session = cookieStore.get("session")?.value;

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">Dashboard 🎬</h1>

      <form action={logout}>
        <button className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </form>
    </div>
  );
}
