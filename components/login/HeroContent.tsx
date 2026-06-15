"use client"

import { motion } from "framer-motion";

export default function HeroContent() {
  return (
    <div className="flex flex-col justify-center">
      <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
        <span>🎬</span>
        <span className="text-sm text-zinc-300">Movie Watchlist Platform</span>
      </div>
      <h1 className="max-w-2xl text-5xl font-black leading-tight md:text-7xl">
        Track Every
        <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
          Movie You Watch
        </span>
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
        Build your personal movie archive, organize your watch history, discover
        favorites, and never forget what you've watched again.
      </p>

      {/* Product features */}
      <div className="mt-10 overflow-hidden md:overflow-visible">
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -200 }} // Prevents dragging too far away
          whileTap={{ cursor: "grabbing" }}
          className="flex flex-nowrap md:flex-wrap gap-4 pb-2 md:pb-0 cursor-grab no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl shrink-0">
            <p className="text-sm text-zinc-300 select-none">
              ✓ Passwordless Login
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl shrink-0">
            <p className="text-sm text-zinc-300 select-none">
              ✓ Secure OTP Access
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl shrink-0">
            <p className="text-sm text-zinc-300 select-none">
              ✓ Personal Watchlist
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
