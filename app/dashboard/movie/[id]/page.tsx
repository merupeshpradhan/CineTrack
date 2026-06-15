import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const movie = await prisma.movie.findUnique({
    where: {
      id,
    },
  });

  if (!movie) {
    notFound();
  }

  const moviePoster = movie.imageUrl || "https://unsplash.com";

  return (
    <div className="relative min-h-screen bg-[#0d0a14] text-[#D3D3FF] antialiased selection:bg-[#9400D3] selection:text-white overflow-hidden">
      
      {/* 1. IMMERSIVE BLURRED BACKGROUND HERO BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-25">
        <img
          src={moviePoster}
          alt=""
          className="w-full h-full object-cover scale-110 filter blur-[80px] saturate-150"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0a14]/40 via-[#0d0a14]/80 to-[#0d0a14]" />
      </div>

      {/* 2. LAYOUT MAIN CONTENT CONTAINER */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-6">
        
        {/* BACK BUTTON */}
        <div>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#D3D3FF]/40 hover:text-[#ED80E9] transition-colors group"
          >
            <span className="transform group-hover:-translate-x-0.5 transition-transform">&larr;</span> Return to Library
          </a>
        </div>

        {/* MAIN FULL CARD INTERFACE */}
        <div className="bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* FULL SCREEN DYNAMIC IMAGE BANNER BLOCK */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 bg-[#161324] border-b border-white/5 overflow-hidden">
            <img
              src={moviePoster}
              alt={movie.title}
              className="w-full h-full object-cover md:object-[center_25%]"
            />
            {/* GRADIENT OVERLAYS FOR SIGHT READABILITY */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#110e1a] via-[#110e1a]/40 to-black/20" />
            
            {/* FLOATING HEADER INFO INSIDE LOWER SECTION OF HERO IMAGE */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center h-5 px-2.5 text-[9px] font-black uppercase tracking-wider rounded-md border ${
                      movie.watched
                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300 backdrop-blur-sm"
                        : "bg-[#ED80E9]/20 border-[#ED80E9]/30 text-[#ED80E9] backdrop-blur-sm"
                    }`}
                  >
                    {movie.watched ? "● Completed" : "○ In Queue"}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wide text-white drop-shadow-md">
                  {movie.title}
                </h1>
              </div>
            </div>
          </div>

          {/* LOWER SECTION DESCRIPTION METADATA */}
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-5 gap-8 bg-[#110e1a]/60">
            
            {/* ABSTRACT CORE BIO AND SYNOPSIS */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#ED80E9]">
                Synopsis Summary
              </h3>
              <p className="text-sm md:text-base text-[#D3D3FF]/80 font-medium leading-relaxed">
                {movie.description ||
                  "No catalog synopsis abstract logs registered for this entry item."}
              </p>
            </div>

            {/* STRUCTURAL TECHNICAL TRACKING DATA METRICS */}
            <div className="lg:col-span-2 flex flex-col justify-between gap-6">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3 font-mono text-[11px]">
                <div className="flex justify-between border-b border-white/5 pb-2.5">
                  <span className="text-[#D3D3FF]/40 uppercase tracking-wider">
                    Watch Timeline Date
                  </span>
                  <span className="text-[#D3D3FF] font-semibold">
                    {new Date(movie.watchDate).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#D3D3FF]/40 uppercase tracking-wider">
                    Ingested Timestamp
                  </span>
                  <span className="text-[#D3D3FF]/80">
                    {new Date(movie.createdAt).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}
                  </span>
                </div>
              </div>

              {/* BOTTOM FOOTER BUTTON GROUP */}
              <div className="flex items-center justify-end gap-3 border-t border-white/5 pt-4 lg:border-none lg:pt-0">
                <a
                  href="/dashboard"
                  className="inline-flex items-center justify-center h-10 px-5 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-[#D3D3FF]/80 hover:text-white rounded-xl transition"
                >
                  Back to Dashboard
                </a>

                <a
                  href={`/dashboard/movie/edit/${movie.id}`}
                  className="inline-flex items-center justify-center h-10 px-6 text-xs font-black uppercase tracking-wider bg-[#9400D3] hover:bg-[#ED80E9] text-white rounded-xl transition-all shadow-lg shadow-[#9400D3]/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Edit Entry
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
