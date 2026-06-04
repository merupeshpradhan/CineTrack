"use client";

// React hooks and animation utilities
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import toast from "react-hot-toast";
import { sendOTP } from "@/actions/actions";

// Movie poster assets for animated background rows
const POSTERS_ROW_1 = [
  "/Movies/PK__PEEKAY__2014.jpg",
  "/Movies/Animal.jpg",
  "/Movies/CM_Vijay.jpg",
  "/Movies/Tangled.jpg",
  "/Movies/Karuppu_Grand.jpg",
];

const POSTERS_ROW_2 = [
  "/Movies/RRR.jpg",
  "/Movies/Cars.jpg",
  "/Movies/3_Idiots_2009.jpg",
  "/Movies/Raavan.jpg",
  "/Movies/Moana.jpg",
];

// Utility function for infinite marquee looping
const wrapX = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export default function Home() {
  const router = useRouter();

  // References and animation state for first marquee row
  const trackRef1 = useRef<HTMLDivElement>(null);
  const x1 = useMotionValue(0);
  const [isHovered1, setIsHovered1] = useState(false);

  // References and animation state for second marquee row
  const trackRef2 = useRef<HTMLDivElement>(null);
  const x2 = useMotionValue(0);
  const [isHovered2, setIsHovered2] = useState(false);

  // Prevent animation calculations before DOM measurements are ready
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for DOM rendering before starting marquee animation
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Duplicate posters to create a seamless infinite scrolling effect
  const endlessRow1 = [...POSTERS_ROW_1, ...POSTERS_ROW_1, ...POSTERS_ROW_1];
  const endlessRow2 = [...POSTERS_ROW_2, ...POSTERS_ROW_2, ...POSTERS_ROW_2];

  // Animation speed configuration
  const SPEED_COEFF = 0.06;

  // Smooth marquee animation using frame delta timing
  useAnimationFrame((time, delta) => {
    if (!isReady) return;

    // Move first row from right to left
    if (!isHovered1 && trackRef1.current) {
      const totalWidth = trackRef1.current.scrollWidth;

      if (totalWidth > 0) {
        const baseWidth = totalWidth / 3;
        let currentX = x1.get() - delta * SPEED_COEFF;
        x1.set(wrapX(-baseWidth, 0, currentX));
      }
    }

    // Move second row from left to right
    if (!isHovered2 && trackRef2.current) {
      const totalWidth = trackRef2.current.scrollWidth;

      if (totalWidth > 0) {
        const baseWidth = totalWidth / 3;
        let currentX = x2.get() + delta * SPEED_COEFF;
        x2.set(wrapX(-baseWidth * 2, -baseWidth, currentX));
      }
    }
  });

  // Handle OTP login request
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const toastId = toast.loading("Sending OTP...");

    try {
      // Send OTP and redirect user to verification page
      await sendOTP(email);

      toast.success("OTP Sent Successfully!", {
        id: toastId,
      });

      router.push(`/verify?email=${email}`);
    } catch {
      toast.error("Failed to send OTP", {
        id: toastId,
      });
    }
  }
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070c] text-white">
      {/* Animated background glow effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[150px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-fuchsia-500/20 blur-[120px]" />
        <div className="absolute top-1/2 left-0 h-[350px] w-[350px] rounded-full bg-indigo-500/20 blur-[120px]" />
      </div>

      {/* Infinite scrolling movie poster marquee */}
      <div className="absolute top-0 left-0 right-0 z-0 flex flex-col gap-4 pt-28 pb-6 select-none opacity-15 mix-blend-luminosity lg:inset-0 lg:justify-center lg:gap-6 lg:py-0">
        {/* Row 1 Wrapper */}
        <div className="overflow-hidden flex w-full">
          <motion.div
            ref={trackRef1}
            style={{ x: x1 }}
            onMouseEnter={() => setIsHovered1(true)}
            onMouseLeave={() => setIsHovered1(false)}
            onTouchStart={() => setIsHovered1(true)}
            onTouchEnd={() => setIsHovered1(false)}
            className="flex gap-6 shrink-0 pointer-events-auto will-change-transform"
          >
            {endlessRow1.map((src, index) => (
              <div
                key={`r1-${index}`}
                className="relative h-44 w-32 md:h-64 md:w-44 shrink-0 rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden shadow-2xl"
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Row 2 Wrapper */}
        <div className="overflow-hidden flex w-full">
          <motion.div
            ref={trackRef2}
            style={{ x: x2 }}
            onMouseEnter={() => setIsHovered2(true)}
            onMouseLeave={() => setIsHovered2(false)}
            onTouchStart={() => setIsHovered2(true)}
            onTouchEnd={() => setIsHovered2(false)}
            className="flex gap-6 shrink-0 pointer-events-auto will-change-transform"
          >
            {endlessRow2.map((src, index) => (
              <div
                key={`r2-${index}`}
                className="relative h-44 w-32 md:h-64 md:w-44 shrink-0 rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden shadow-2xl"
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main hero section */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-24 md:pt-0">
        <div className="grid w-full max-w-7xl gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left Hero Side */}
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
              <span>🎬</span>
              <span className="text-sm text-zinc-300">
                Movie Watchlist Platform
              </span>
            </div>
            <h1 className="max-w-2xl text-5xl font-black leading-tight md:text-7xl">
              Track Every
              <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                Movie You Watch
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
              Build your personal movie archive, organize your watch history,
              discover favorites, and never forget what you've watched again.
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

          {/* Right OTP login card */}
          <div className="flex items-center justify-center mb-20 md:mb-0">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 opacity-30 blur-xl" />
              <div className="relative rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-3xl shadow-2xl">
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-3xl shadow-lg shadow-violet-500/30">
                    🎬
                  </div>
                  <h2 className="text-3xl font-bold">Welcome Back</h2>
                  <p className="mt-2 text-zinc-400">
                    Continue with your email to access your movie collection.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="you@example.com"
                      className="h-14 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-white placeholder:text-zinc-500 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                    />
                  </div>
                  <button
                    type="submit"
                    className="group h-14 w-full rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/30 cursor-pointer"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Continue with Email
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </button>
                </form>
                <div className="mt-8 border-t border-white/10 pt-6">
                  <div className="flex items-center justify-center gap-6 text-xs text-zinc-500">
                    <span>🔒 Secure</span>
                    <span>⚡ Fast</span>
                    <span>📧 OTP Login</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
