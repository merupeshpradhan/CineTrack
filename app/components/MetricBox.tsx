type Props = {
  totalMovies: number;
  watchedMovies: number;
  notWatchedMovies: number;
};

function MetricBox({ totalMovies, watchedMovies, notWatchedMovies }: Props) {
  return (
    // Dashboard statistics overview
    <section className="grid grid-cols-3 gap-3">
      <div className="bg-[#D8BFD8]/5 border border-[#D8BFD8]/10 rounded-xl p-4">
        <p className="text-[10px] uppercase text-[#D3D3FF]/40">Total</p>
        <p className="text-2xl font-black">{totalMovies}</p>
      </div>

      <div className="bg-[#D8BFD8]/5 border border-[#D8BFD8]/10 rounded-xl p-4">
        <p className="text-[10px] uppercase text-[#ED80E9]">Watched</p>
        <p className="text-2xl font-black text-[#ED80E9]">{watchedMovies}</p>
      </div>

      <div className="bg-[#D8BFD8]/5 border border-[#D8BFD8]/10 rounded-xl p-4">
        <p className="text-[10px] uppercase text-[#9400D3]">Queue</p>
        <p className="text-2xl font-black">{notWatchedMovies}</p>
      </div>
    </section>
  );
}

export default MetricBox;
