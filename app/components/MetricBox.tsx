import React from "react";

type MetricBoxProps = {
  totalMovies: number;
  watchedMovies: number;
  notWatchedMovies: number;
};

function MetricBox({
  totalMovies,
  watchedMovies,
  notWatchedMovies,
}: MetricBoxProps) {
  return (
    <section className="grid grid-cols-3 gap-3 mb-8" aria-label="Statistics">
      {/* Total */}
      <div className="bg-[#D8BFD8]/5 border border-[#D8BFD8]/10 rounded-xl p-3 relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#D3D3FF]">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#D3D3FF]/40">
          Total
        </p>
        <p className="text-xl font-black text-[#D3D3FF] mt-0.5">
          {totalMovies}
        </p>
      </div>

      {/* Watched */}
      <div className="bg-[#D8BFD8]/5 border border-[#D8BFD8]/10 rounded-xl p-3 relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#ED80E9]">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#ED80E9]">
          Watched
        </p>
        <p className="text-xl font-black text-[#ED80E9] mt-0.5">
          {watchedMovies}
        </p>
      </div>

      {/* Queue */}
      <div className="bg-[#D8BFD8]/5 border border-[#D8BFD8]/10 rounded-xl p-3 relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#9400D3]">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#9400D3]">
          Queue
        </p>
        <p className="text-xl font-black text-[#D3D3FF]/80 mt-0.5">
          {notWatchedMovies}
        </p>
      </div>
    </section>
  );
}

export default MetricBox;