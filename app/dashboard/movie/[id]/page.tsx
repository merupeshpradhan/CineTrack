import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch all necessary properties from the database via Prisma
  const movie = await prisma.movie.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      genre: true,
      duration: true,
      imageUrl: true,
      watchDate: true,
      watched: true,
      location: true,
      createdAt: true,
    }
  });

  if (!movie) {
    notFound();
  }

  const moviePoster = movie.imageUrl || "/placeholder.jpg";

  // Clean date-parsing function that avoids typescript string crash errors safely
  const formatDisplayDate = (dateVal: any) => {
    if (!dateVal) return "N/A";
    const parsedDate = new Date(dateVal);
    return isNaN(parsedDate.getTime())
      ? String(dateVal)
      : parsedDate.toLocaleDateString("en-US", { dateStyle: "medium" });
  };

  return (
    <div className="relative min-h-screen bg-[#0d0a14] text-[#D3D3FF] antialiased selection:bg-[#9400D3] selection:text-white overflow-hidden">
      
      {/* 1. IMMERSIVE BLURRED HERO BACKGROUND EFFECT */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-20">
        <img
          src={moviePoster}
          alt=""
          className="w-full h-full object-cover scale-110 filter blur-[100px] saturate-150"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0a14]/20 via-[#0d0a14]/60 to-[#0d0a14]" />
      </div>

      {/* 2. MAIN LAYOUT CONTENT CONTAINER */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-16 space-y-6">
        {/* BACK TO LIBRARY BUTTON */}
        <div>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#D3D3FF]/40 hover:text-[#ED80E9] transition-colors group"
          >
            <span className="transform group-hover:-translate-x-0.5 transition-transform">
              &larr;
            </span>{" "}
            Return to Library
          </a>
        </div>

        {/* MAIN SPLIT-COLUMN CARD CONTAINER */}
        <div className="bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDE COLUMN: TALL UN-CROPPED POSTER DISPLAY */}
            <div className="md:col-span-4 w-full max-w-[280px\] mx-auto md:mx-0">
              <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden bg-[#161324] border border-white/10 shadow-2xl relative group">
                <img
                  src={moviePoster}
                  alt={movie.title}
                  className="w-full h-full object-contain bg-black/40"
                />

                {/* Floating Status Badge overlay inside the poster panel */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center h-5 px-2.5 text-[9px] font-black uppercase tracking-wider rounded-md border backdrop-blur-md shadow-md ${
                      movie.watched
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                        : "bg-purple-500/20 border-purple-500/40 text-purple-300"
                    }`}
                  >
                    {movie.watched ? "● Completed" : "○ In Queue"}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE COLUMN: TITLE, INFO BADGES, AND SPECIFICATIONS */}
            <div className="md:col-span-8 flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                {/* MOVIE TITLE HEADLINE */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wide text-white leading-tight drop-shadow-md">
                  {movie.title}
                </h1>

                {/* HORIZONTAL QUICK BADGES INFO BAR */}
                <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                  {movie.genre && (
                    <span className="bg-[#9400D3]/20 border border-[#9400D3]/40 text-[#D3D3FF] px-3 py-1 rounded-full font-medium shadow-sm">
                      🎬 {movie.genre}
                    </span>
                  )}
                  {movie.duration && (
                    <span className="bg-white/5 border border-white/10 text-[#D3D3FF]/80 px-3 py-1 rounded-full font-mono shadow-sm">
                      ⏱️ {movie.duration}
                    </span>
                  )}
                  {movie.location && (
                    <span className="bg-[#ED80E9]/10 border border-[#ED80E9]/30 text-[#ED80E9] px-3 py-1 rounded-full font-medium shadow-sm">
                      📍 {movie.location}
                    </span>
                  )}
                </div>

                {/* DYNAMIC SPECIFICATIONS PANEL OVERVIEW */}
                <div className="pt-6 space-y-3 border-t border-white/5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#ED80E9] mb-2">
                    Movie Specifications
                  </h3>
                  <div className="space-y-2.5 pt-1 text-sm text-[#D3D3FF]/80">
                    <p className="flex items-center">
                      <span className="text-[#D3D3FF]/40 font-mono text-xs uppercase tracking-wider w-24 inline-block">Genre:</span> 
                      <span className="text-white font-medium">{movie.genre || "Not Specified"}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="text-[#D3D3FF]/40 font-mono text-xs uppercase tracking-wider w-24 inline-block">Duration:</span> 
                      <span className="text-white font-mono">{movie.duration || "Not Specified"}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="text-[#D3D3FF]/40 font-mono text-xs uppercase tracking-wider w-24 inline-block">Location:</span> 
                      <span className="text-[#ED80E9] font-medium">{movie.location || "Not Specified"}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* TIMELINE METRICS BOX AND CONTROL BUTTON FOOTER GROUP */}
              <div className="pt-6 space-y-6 border-t border-white/5">
                {/* DATE LABELS GRID DATABOX */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/[0.01] border border-white/5 rounded-2xl p-4 font-mono text-[11px]">
                  <div>
                    <span className="block text-[#D3D3FF]/40 uppercase tracking-wider mb-1">
                      Watch Timeline Date
                    </span>
                    <span className="text-white font-bold text-sm">
                      {formatDisplayDate(movie.watchDate)}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[#D3D3FF]/40 uppercase tracking-wider mb-1">
                      Ingested Timestamp
                    </span>
                    <span className="text-[#D3D3FF]/80 text-sm">
                      {formatDisplayDate(movie.createdAt)}
                    </span>
                  </div>
                </div>

                {/* ACTION INTERACTION BUTTON GROUP */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <a
                    href="/dashboard"
                    className="inline-flex items-center justify-center h-10 px-5 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-[#D3D3FF]/80 hover:text-white rounded-xl transition-all"
                  >
                    Back to Dashboard
                  </a>

                  <a
                    href={`/dashboard/movie/${movie.id}/edit`}
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
    </div>
  );
}
