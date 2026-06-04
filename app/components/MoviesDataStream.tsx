import React from "react";
import WatchedCheckbox from "./WatchedCheckbox";
import { deleteMovie } from "@/actions/actions";
import DeleteButton from "./DeleteButton";

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
  return (
    <div>
      {movies.length === 0 ? (
        <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
          <p className="text-[#D3D3FF]/30 text-sm tracking-wide">
            Your movie collection is currently empty.
          </p>
        </div>
      ) : (
        <main className="space-y-4">
          {movies.map((movie) => (
            <article
              key={movie.id}
              className="group flex flex-col sm:flex-row items-stretch bg-gradient-to-r from-[#D8BFD8]/5 to-transparent backdrop-blur-md border border-white/5 hover:border-[#ED80E9]/20 rounded-2xl overflow-hidden transition-all duration-300"
            >
              {/* FIXED HEIGHT, NATURAL WIDTH IMAGE CONTAINER */}
              <div className="relative h-48 sm:h-52 shrink-0 bg-zinc-900">
                <img
                  src={movie.imageUrl || "https://unsplash.com"}
                  alt={movie.title}
                  loading="lazy"
                  className="w-auto h-full object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-transparent to-black/50 sm:to-transparent" />
              </div>

              {/* DETAILED SUMMARY CONTENT */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 min-w-0 gap-4">
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-base font-bold text-white tracking-tight truncate group-hover:text-[#ED80E9] transition">
                      {movie.title}
                    </h3>
                    <span className="text-xs text-[#D3D3FF]/40 shrink-0">
                      {new Date(movie.watchDate).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })}
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-[#D3D3FF]/60 line-clamp-3 mt-2 leading-relaxed">
                    {movie.description ||
                      "No description provided for this catalog entry."}
                  </p>
                </div>

                {/* CONTROL PANEL */}
                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-auto">
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                    <WatchedCheckbox id={movie.id} watched={movie.watched} />
                    <span className="text-xs font-medium text-[#D3D3FF]/70">
                      Mark watched
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/dashboard/movie/${movie.id}`}
                      className="h-9 px-4 flex items-center text-xs font-semibold text-white bg-white/10 hover:bg-[#9400D3] rounded-xl transition"
                    >
                      Open Details
                    </a>

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
