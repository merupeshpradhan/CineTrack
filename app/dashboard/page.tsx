import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { addMovie, logout } from "@/actions/actions";

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const session = cookieStore.get("session")?.value;

  if (!session) {
    redirect("/");
  }

  const movies = await prisma.movie.findMany({
    where: {
      userId: session,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Dashboard 🎬
        </h1>

        <form action={logout}>
          <button className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </form>
      </div>

      <form
        action={addMovie}
        className="flex flex-col gap-3 max-w-md mb-10"
      >
        <input
          name="title"
          placeholder="Movie Title"
          className="border p-2 rounded"
          required
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          className="border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          className="border p-2 rounded"
          required
        />

        <input
          name="watchDate"
          type="date"
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Movie
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-5">
        My Movies 🎥
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="border rounded p-4 shadow"
          >
            <img
              src={movie.imageUrl}
              alt={movie.title}
              className="w-full h-60 object-cover rounded"
            />

            <h3 className="text-xl font-bold mt-3">
              {movie.title}
            </h3>

            <p className="mt-2">
              {movie.description}
            </p>

            <p className="mt-2 text-sm">
              Watched On:{" "}
              {new Date(
                movie.watchDate
              ).toLocaleDateString()}
            </p>

            <p className="mt-2">
              Status:{" "}
              {movie.watched
                ? "✅ Watched"
                : "⏳ Not Watched"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}