"use client";

import React, { useTransition } from "react";
import WatchedCheckbox from "./WatchedCheckbox";
import DeleteButton from "./DeleteButton";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type Movie = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  watchDate: Date;
  watched: boolean;
};

type Props = {
  movies: Movie[];
};

function MoviesDataStream({ movies }: Props) {
  const router = useRouter();
  const [isOpenPending, startOpenTransition] = useTransition();

  const handleOpenDetails = (id: string, title: string) => {
    const toastId = toast.loading(`Opening details for "${title}"...`);

    startOpenTransition(async () => {
      try {
        await router.push(`/dashboard/movie/${id}`);
        toast.success("Loaded successfully ✅", { id: toastId });
      } catch (error) {
        console.error("Navigation failed", error);
        toast.error("Failed to load details ❌", { id: toastId });
      }
    });
  };

  return (
    <div className="w-full">
      {movies.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 px-4">
          <p className="text-[#D3D3FF]/30 text-xs sm:text-sm tracking-wide">
            Your movie collection is currently empty.
          </p>
        </div>
      ) : (
        <main className="space-y-3 sm:space-y-4">
          {movies.map((movie) => (
            <article
              key={movie.id}
              className="group flex flex-col sm:flex-row items-stretch bg-gradient-to-b sm:bg-gradient-to-r from-[#D8BFD8]/5 to-transparent backdrop-blur-md border border-white/5 hover:border-[#ED80E9]/20 rounded-2xl overflow-hidden transition-all duration-300"
            >
              {/* IMAGE CONTAINER - Mobile: landscape cover height | Tablet/Desktop: fixed height auto width */}
              <div className="relative h-40 sm:h-30 md:h-52 w-full sm:w-auto shrink-0 bg-zinc-900/60 flex justify-center items-center overflow-hidden">
                <img
                  src={movie.imageUrl || "https://unsplash.com"}
                  alt={movie.title}
                  loading="lazy"
                  className="w-full h-full object-cover sm:w-auto sm:h-full sm:object-contain"
                />
                {/* Responsive Gradient overlay direction matches container breakdown flow */}
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#0d0a14]/80 via-transparent to-transparent sm:from-transparent sm:to-transparent" />
              </div>

              {/* DETAILED CONTENT CONTAINER */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 min-w-0 gap-4">
                <div className="min-w-0">
                  {/* HEADER FRAME */}
                  <div className="flex flex-row xs:items-center justify-between gap-1.5 sm:gap-4">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-tight truncate group-hover:text-[#ED80E9] transition">
                      {movie.title}
                    </h3>
                    <span className="text-[10px] sm:text-xs font-medium text-[#D3D3FF]/40 shrink-0">
                      {new Date(movie.watchDate).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })}
                    </span>
                  </div>
                </div>

                {/* CONTROL ACTION CODES BLOCK */}
                <div className="flex flex-col xs:flex-row xs:items-center justify-between border-t border-white/5 pt-3 mt-auto gap-3">
                  
                  {/* CHECKBOX SELECTION TARGET */}
                  <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-white/5 w-fit select-none">
                    <WatchedCheckbox id={movie.id} watched={movie.watched} />
                    <span className="text-[11px] sm:text-xs font-medium text-[#D3D3FF]/70 whitespace-nowrap">
                      Mark watched
                    </span>
                  </div>

                  {/* NAVIGATION LINK TRIGGERS */}
                  <div className="flex items-center gap-2 justify-end w-full xs:w-auto">
                    <button
                      onClick={() => handleOpenDetails(movie.id, movie.title)}
                      disabled={isOpenPending}
                      className="h-8 sm:h-9 px-3 sm:px-4 flex items-center justify-center text-[11px] sm:text-xs font-semibold text-white bg-white/10 hover:bg-[#9400D3] rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex-1 xs:flex-initial text-center whitespace-nowrap"
                    >
                      Open Details
                    </button>

                    <DeleteButton id={movie.id} />
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
