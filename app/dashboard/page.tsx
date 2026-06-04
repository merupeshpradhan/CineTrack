import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SearchBox from "@/app/components/SearchBox";
import Header from "../components/Header";
import MetricBox from "../components/MetricBox";
import MoviesDataStream from "../components/MoviesDataStream";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string }>;
}) {
  // Get authenticated user
  const user = await getCurrentUser();

  // Redirect unauthenticated users to login page
  if (!user) {
    redirect("/");
  }

  // Resolve search query from URL parameters
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search || "";

  // Fetch user's movies with optional search filtering
  const movies = await prisma.movie.findMany({
    where: {
      userId: user.id,
      title: {
        contains: search,
        mode: "insensitive",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate dashboard statistics
  const totalMovies = movies.length;
  const watchedMovies = movies.filter((m) => m.watched).length;
  const notWatchedMovies = totalMovies - watchedMovies;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0b18] via-[#110e1a] to-[#0b0812] text-[#D3D3FF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
        {/* Dashboard header */}
        <Header />

        {/* Movie statistics overview */}
        <MetricBox
          totalMovies={totalMovies}
          watchedMovies={watchedMovies}
          notWatchedMovies={notWatchedMovies}
        />

        {/* Search and collection controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          ...
        </div>

        {/* Movies list container */}
        <div className="rounded-2xl border border-[#D8BFD8]/10 bg-[#D8BFD8]/5 p-3 sm:p-4">
          <MoviesDataStream movies={movies} />
        </div>
      </div>
    </div>
  );
}
