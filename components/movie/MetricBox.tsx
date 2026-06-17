"use client";
// Required in Next.js App Router when this component
// needs browser-side rendering or future client features

// Define props received from parent component
type Props = {
  // Total number of movies
  totalMovies: number;

  // Number of watched movies
  watchedMovies: number;

  // Number of movies not watched yet
  notWatchedMovies: number;
};

// Metric cards component
export default function MetricBox({
  totalMovies,
  watchedMovies,
  notWatchedMovies,
}: Props) {
  return (
    // Grid layout → 3 columns with spacing
    <section className="grid grid-cols-3 gap-3 select-none">
      {/* TOTAL MOVIES CARD */}
      <div className="bg-[#D8BFD8]/5 border border-[#D8BFD8]/10 rounded-xl p-4 shadow-sm">
        {/* Card title */}
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#D3D3FF]/40">
          Total
        </p>

        {/* Dynamic total movie count */}
        <p className="text-2xl font-black text-white mt-1">{totalMovies}</p>
      </div>

      {/* WATCHED MOVIES CARD */}
      <div className="bg-[#D8BFD8]/5 border border-[#D8BFD8]/10 rounded-xl p-4 shadow-sm">
        {/* Card title */}
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#ED80E9]">
          Watched
        </p>

        {/* Dynamic watched count */}
        <p className="text-2xl font-black text-[#ED80E9] mt-1">
          {watchedMovies}
        </p>
      </div>

      {/* REMAINING MOVIES CARD */}
      <div className="bg-[#D8BFD8]/5 border border-[#D8BFD8]/10 rounded-xl p-4 shadow-sm">
        {/* Card title */}
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#9400D3]">
          Queue
        </p>

        {/* Dynamic queue count */}
        <p className="text-2xl font-black text-[#D3D3FF] mt-1">
          {notWatchedMovies}
        </p>
      </div>
    </section>
  );
}
