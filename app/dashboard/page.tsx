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
    /* WISTERIA APP WRAPPER: Deep charcoal-midnight base layer mixed with premium ice lavender #D3D3FF text typography */
    <div className="min-h-screen bg-[#110e1a] text-[#D3D3FF] antialiased selection:bg-[#9400D3] selection:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER BRAND BAR */}
        <Header />

        {/* METRIC BOX OVERVIEW */}
        <MetricBox totalMovies={totalMovies} watchedMovies={watchedMovies} notWatchedMovies={notWatchedMovies} />

        {/* CONTROLS HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#D3D3FF]/40">
            {search ? `Query / "${search}"` : "Index / Collection"}
          </h2>
          <div className="w-full sm:w-64">
            <SearchBox />
          </div>
        </div>

        {/* MOVIES DATA STREAM */}
        <MoviesDataStream movies={movies}/>
      </div>
    </div>
  );
}
