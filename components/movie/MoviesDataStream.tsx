"use client";

// Client component because:
// useRouter()
// useTransition()
// toast()
// button click handlers

import React, { useTransition } from "react";

import WatchedCheckbox from "./actions/WatchedCheckbox";
import DeleteButton from "./actions/DeleteButton";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

// Movie object shape
type Movie = {
  id: string;
  title: string;

  genre?: string | null;
  duration?: string | null;

  imageUrl?: string | null;

  watchDate: Date | string | null;

  watched: boolean;

  location?: string | null;

  createdAt: Date | string;

  userId: string;
};

// Component props
type Props = {
  movies: Movie[];
};

// Main movie list component
function MoviesDataStream({ movies }: Props) {
  // Next.js navigation hook
  const router = useRouter();

  // Handles UI transition state
  const [isOpenPending, startOpenTransition] = useTransition();

  // Open movie details page
  const handleOpenDetails = (id: string, title: string) => {
    // Show loading toast
    const toastId = toast.loading(`Opening details for "${title}"...`);

    startOpenTransition(async () => {
      try {
        // Navigate
        await router.push(`/dashboard/movie/${id}`);

        // Success toast
        toast.success("Loaded successfully ✅", {
          id: toastId,
        });
      } catch (error) {
        console.error("Navigation failed", error);

        // Error toast
        toast.error("Failed to load details ❌", {
          id: toastId,
        });
      }
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* EMPTY STATE */}
      {movies.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 px-4">
          <p className="text-[#D3D3FF]/30 text-xs sm:text-sm tracking-wide">
            Your movie collection is currently empty.
          </p>
        </div>
      ) : (
        // Movie grid list layout
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {movies.map((movie) => (
            <article
              key={movie.id}
              className="group flex flex-col md:flex-row overflow-hidden rounded-2xl bg-[#0f111a] border border-slate-800/80 hover:border-slate-700 transition-all duration-300 shadow-xl"
            >
              {/* MOVIE POSTER CONTAINER (Fixed mobile crop issues) */}
              <div className="relative w-full md:w-44 bg-slate-950 flex-shrink-0 flex items-center justify-center">
                <img
                  src={movie.imageUrl || "/placeholder.jpg"}
                  alt={movie.title}
                  loading="lazy"
                  className="w-full h-auto object-contain max-h-[240px] md:max-h-full md:h-full md:object-cover transition-transform duration-300 group-hover:scale-105 transform-gpu backface-hidden will-change-transform"
                />

                {movie.watched && (
                  <div className="absolute top-3 left-3 bg-emerald-500/90 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur-sm shadow z-10">
                    Watched
                  </div>
                )}
              </div>

              {/* DETAILS CONTENT AREA */}
              <div className="flex flex-col flex-1 p-5 justify-between">
                <div>
                  {/* GENRE TAG */}
                  {movie.genre && (
                    <span className="inline-block text-[11px] font-semibold text-purple-400 tracking-wider uppercase mb-1">
                      {movie.genre}
                    </span>
                  )}

                  {/* TITLE */}
                  <h3 className="text-lg font-bold text-white tracking-tight leading-snug group-hover:text-purple-300 transition-colors">
                    {movie.title}
                  </h3>

                  {/* METADATA INFO ITEMS */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs font-medium text-slate-400">
                    {movie.duration && (
                      <span className="flex items-center gap-1">
                        <span className="text-slate-500 text-sm">⏱️</span>{" "}
                        {movie.duration}
                      </span>
                    )}

                    {movie.location && (
                      <span className="flex items-center gap-1">
                        <span className="text-slate-500 text-sm">📍</span>{" "}
                        {movie.location}
                      </span>
                    )}

                    <span className="flex items-center gap-1">
                      <span className="text-slate-500 text-sm">📅</span>
                      {movie.watchDate
                        ? new Date(movie.watchDate).toLocaleDateString(
                            "en-US",
                            {
                              dateStyle: "medium",
                            },
                          )
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {/* CONTROLS & ACTIONS CONTAINER */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/60 pt-4 mt-5">
                  {/* Left Action Box: Watched toggle status */}
                  <div className="flex items-center gap-2 transform active:scale-98 transition-transform">
                    <WatchedCheckbox id={movie.id} watched={movie.watched} />
                  </div>

                  {/* Right Action Box: Buttons separated cleanly with gap-3 */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleOpenDetails(movie.id, movie.title)}
                      disabled={isOpenPending}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800/80 hover:bg-purple-600 text-slate-200 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700/50 hover:border-purple-400 shadow-sm cursor-pointer"
                    >
                      {isOpenPending ? "Loading..." : "Open Details"}
                    </button>

                    <div className="transform active:scale-98 transition-transform">
                      <DeleteButton id={movie.id} />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </main>
      )}
    </div>
  );
}

export default MoviesDataStream;
