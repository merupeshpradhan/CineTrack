"use client"; // ✅ FIXED: Added client directive to protect server/client runtime boundary splitting

type Props = {
  totalMovies: number;
  watchedMovies: number;
  notWatchedMovies: number;
};

export default function MetricBox({ totalMovies, watchedMovies, notWatchedMovies }: Props) {
  return (
    // Dashboard statistics metrics overview grid layout
    <section className="grid grid-cols-3 gap-3 select-none">
      
      {/* Total Movies */}
      <div className="bg-[#D8BFD8]/5 border border-[#D8BFD8]/10 rounded-xl p-4 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#D3D3FF]/40">Total</p>
        <p className="text-2xl font-black text-white mt-1">{totalMovies}</p>
      </div>

      {/* Watched Movies */}
      <div className="bg-[#D8BFD8]/5 border border-[#D8BFD8]/10 rounded-xl p-4 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#ED80E9]">Watched</p>
        <p className="text-2xl font-black text-[#ED80E9] mt-1">{watchedMovies}</p>
      </div>

      {/* Remaining Movie Queue */}
      <div className="bg-[#D8BFD8]/5 border border-[#D8BFD8]/10 rounded-xl p-4 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#9400D3]">Queue</p>
        <p className="text-2xl font-black text-[#D3D3FF] mt-1">{notWatchedMovies}</p>
      </div>
      
    </section>
  );
}
