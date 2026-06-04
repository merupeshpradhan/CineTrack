import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SearchBox from "@/app/components/SearchBox";
import Header from "../components/Header";
import MetricBox from "../components/MetricBox";
import MoviesDataStream from "../components/MoviesDataStream";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string }>;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    redirect("/");
  }

  const resolvedParams = await searchParams;
  const search = resolvedParams?.search || "";

  const movies = await prisma.movie.findMany({
    where: {
      userId: session,
      title: {
        contains: search,
        mode: "insensitive",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalMovies = movies.length;
  const watchedMovies = movies.filter((m) => m.watched).length;
  const notWatchedMovies = totalMovies - watchedMovies;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0b18] via-[#110e1a] to-[#0b0812] text-[#D3D3FF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
        {/* HEADER */}
        <Header />

        {/* METRICS */}
        <MetricBox
          totalMovies={totalMovies}
          watchedMovies={watchedMovies}
          notWatchedMovies={notWatchedMovies}
        />

        {/* SEARCH BAR */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#D3D3FF]/40">
              {search ? "Search results" : "Your collection"}
            </h2>
            <p className="text-sm sm:text-base font-semibold text-[#D3D3FF] mt-1">
              {search ? `"${search}"` : "All Movies Dashboard"}
            </p>
          </div>

          <div className="w-full md:w-72">
            <SearchBox />
          </div>
        </div>

        {/* MOVIES */}
        <div className="rounded-2xl border border-[#D8BFD8]/10 bg-[#D8BFD8]/5 p-3 sm:p-4">
          <MoviesDataStream movies={movies} />
        </div>
      </div>
    </div>
  );
}
