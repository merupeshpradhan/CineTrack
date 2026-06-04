import React from "react";
import WatchedCheckbox from "./WatchedCheckbox";
import { deleteMovie } from "@/actions/actions";

type Movie = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  watchDate: Date;
  watched: boolean;
};

type MoviesDataStreamProps = {
  movies: Movie[];
};

function MoviesDataStream({ movies }: MoviesDataStreamProps) {
  return (
    <div>
      {movies.length === 0 ? (
        <div className="text-center py-12 bg-[#D8BFD8]/5 border border-[#D8BFD8]/10 rounded-xl">
          <p className="text-[#D3D3FF]/40 text-xs uppercase tracking-wider">
            No catalog records match query.
          </p>
        </div>
      ) : (
        <main className="space-y-2">
          {movies.map((movie) => (
            <article
              key={movie.id}
              className="group flex items-center bg-[#D8BFD8]/5 border border-[#D8BFD8]/10 hover:bg-[#D8BFD8]/10 hover:border-[#D8BFD8]/20 rounded-xl p-2.5 transition-all duration-150 gap-4"
            >
              <img
                src={movie.imageUrl || "https://unsplash.com"}
                alt={movie.title}
                loading="lazy"
                className="w-[5vw] object-cover transition-transform duration-200 group-hover:scale-105"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between flex-1 min-w-0 gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-[#D3D3FF] truncate group-hover:text-[#ED80E9] transition-colors">
                      {movie.title}
                    </h3>

                    <span className="text-[10px] font-mono text-[#D3D3FF]/30 hidden md:inline">
                      //
                      {new Date(movie.watchDate).toLocaleDateString(undefined, {
                        dateStyle: "short",
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-[#D3D3FF]/50 truncate mt-0.5 max-w-xl">
                    {movie.description || "No metadata summary available."}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <WatchedCheckbox id={movie.id} watched={movie.watched} />

                  <a
                    href={`/dashboard/movie/${movie.id}`}
                    className="inline-flex items-center justify-center h-7 px-3 text-[10px] font-black uppercase tracking-wider bg-[#D8BFD8]/10 hover:bg-[#9400D3] border border-[#D8BFD8]/20 hover:border-[#9400D3] text-[#D3D3FF] hover:text-white rounded-md"
                  >
                    Open
                  </a>

                  <form action={deleteMovie.bind(null, movie.id)}>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center h-7 px-3 text-[10px] font-black uppercase tracking-wider bg-red-500/5 hover:bg-red-950/60 border border-red-500/10 hover:border-red-500/40 text-red-400/70 hover:text-red-400 rounded-md"
                    >
                      Drop
                    </button>
                  </form>
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