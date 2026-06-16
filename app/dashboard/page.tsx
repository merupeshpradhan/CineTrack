import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

// Fully Fixed Absolute Alias Mapping Paths matching your project folder tree layout
import Header from "@/components/header/Header";
import MetricBox from "@/components/movie/MetricBox";
import SearchBox from "@/components/movie/SearchBox";
import MoviesDataStream from "@/components/movie/MoviesDataStream";

// Define strict types for the component props matching Next.js App Router specs
interface PageProps {
  searchParams: Promise<{ search?: string | string[] | undefined }>;
}

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: PageProps) {
  // 1. Recover and authenticate the user profile directly on the Server Side via Cookies
  let user = null;
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (refreshToken) {
      // Decode user reference identifier matching your custom REFRESH_TOKEN_SECRET signature
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
      ) as { userId: string };

      // Query database row via our native Prisma pipeline instance
      user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
    }
  } catch (authError) {
    console.error(
      "Dashboard Server side cookie token challenge failed:",
      authError,
    );
  }

  // 2. Redirect unauthenticated users safely back to the home/login page
  if (!user) {
    redirect("/");
  }

  // 3. Resolve search query safely using await according to Next.js App Router rules
  const resolvedParams = await searchParams;
  const search = typeof resolvedParams?.search === "string" ? resolvedParams.search : "";

  // 4. Fetch the full movie records to match the expected subcomponent types perfectly
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

  // 5. Calculate dashboard statistics counters dynamically
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

        {/* Informational Directory Subheading */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#161324]/40 p-4 rounded-xl border border-[#D8BFD8]/10">
          {/* Left Side: Text Details */}
          <div className="flex flex-col gap-0.5">
            <h2 className="text-base font-semibold text-[#ED80E9]">
              Collection Directory
            </h2>
            <p className="text-xs text-[#D3D3FF]/60">
              Showing {totalMovies} {totalMovies === 1 ? "entry" : "entries"}{" "}
              saved to your profile
            </p>
          </div>

          {/* Right Side: Search Input View */}
          <div className="w-full md:w-80">
            <SearchBox />
          </div>
        </div>

        {/* Movies list container */}
        <div className="rounded-2xl border border-[#D8BFD8]/10 bg-[#D8BFD8]/5 p-3 sm:p-4">
          <MoviesDataStream movies={movies} />
        </div>
      </div>
    </div>
  );
}
