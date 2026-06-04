import { prisma } from "@/lib/prisma";
import EditMovieForm from "./EditMovieForm";

export default async function EditMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch movie by ID
  const movie = await prisma.movie.findUnique({
    where: {
      id,
    },
  });

  // Show fallback UI if movie does not exist
  if (!movie) {
    return (
      <div className="min-h-screen bg-[#110e1a] text-[#D3D3FF] flex items-center justify-center p-6">
        <div className="bg-[#D8BFD8]/5 border border-[#D8BFD8]/10 rounded-xl p-8 max-w-sm text-center shadow-xl">
          <span className="text-3xl">🍿</span>
          <h1 className="text-xl font-black uppercase tracking-wider mt-3 text-[#ED80E9]">
            Movie Not Found
          </h1>
          <p className="text-xs text-[#D3D3FF]/50 mt-2">
            The database record you are trying to modify does not exist or has
            been dropped.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center bg-[#9400D3] hover:bg-[#ED80E9] text-white font-bold text-xs px-4 py-2.5 rounded-md transition-all mt-5 w-full"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Serialize date values before passing them to the client component
  const serializedMovie = {
    ...movie,
    watchDate: movie.watchDate.toISOString().split("T")[0],
  };

  return <EditMovieForm movie={serializedMovie} />;
}
