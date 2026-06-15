"use client";

import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const POSTERS_ROW_1 = [
  "/Movies/PK__PEEKAY__2014.jpg",
  "/Movies/Animal.jpg",
  "/Movies/CM_Vijay.jpg",
  "/Movies/Tangled.jpg",
  "/Movies/Karuppu_Grand.jpg",
];

const POSTERS_ROW_2 = [
  "/Movies/Moana.jpg",
  "/Movies/Raavan.jpg",
  "/Movies/3_Idiots_2009.jpg",
  "/Movies/Cars.jpg",
  "/Movies/RRR.jpg",
];

// Seamless marquee wrapping helper
const wrapX = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export default function VerifyAnimatedPosterGrid() {
  const trackRef1 = useRef<HTMLDivElement>(null);
  const x1 = useMotionValue(0);

  const trackRef2 = useRef<HTMLDivElement>(null);
  const x2 = useMotionValue(0);

  const [isReady, setIsReady] = useState(false);

  // Initialize marquee animation after DOM measurements are ready
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const endlessRow1 = [...POSTERS_ROW_1, ...POSTERS_ROW_1, ...POSTERS_ROW_1];
  const endlessRow2 = [...POSTERS_ROW_2, ...POSTERS_ROW_2, ...POSTERS_ROW_2];

  const SPEED_COEFF = 0.06;

  // Continuous background poster animation
  useAnimationFrame((time, delta) => {
    if (!isReady) return;

    // Row 1: Continuous Left Flow (- delta)
    if (trackRef1.current) {
      const totalWidth = trackRef1.current.scrollWidth;
      if (totalWidth > 0) {
        const baseWidth = totalWidth / 3;
        let currentX = x1.get() - delta * SPEED_COEFF;
        x1.set(wrapX(-baseWidth, 0, currentX));
      }
    }

    // Row 2: Continuous Right Flow (+ delta)
    if (trackRef2.current) {
      const totalWidth = trackRef2.current.scrollWidth;
      if (totalWidth > 0) {
        const baseWidth = totalWidth / 3;
        let currentX = x2.get() + delta * SPEED_COEFF;
        x2.set(wrapX(0, baseWidth, currentX));
      }
    }
  });

  return (
    <div className="relative hidden md:flex flex-1 items-center justify-center overflow-hidden border-l border-white/5 bg-[#07070c]">
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#050508] via-transparent to-[#050508]/30 pointer-events-none" />

      <div className="absolute left-1/4 top-1/4 h-[300px] w-[300px] lg:h-[450px] lg:w-[450px] rounded-full bg-violet-600/15 blur-[120px]" />

      <div className="absolute bottom-1/4 right-1/4 h-[280px] w-[280px] lg:h-[400px] lg:w-[400px] rounded-full bg-pink-500/15 blur-[120px]" />

      <div className="absolute rotate-12 scale-110 flex flex-col gap-4 lg:gap-6 opacity-25 mix-blend-screen select-none pointer-events-none">
        {/* Poster marquee row 1 */}
        <motion.div
          ref={trackRef1}
          style={{ x: x1 }}
          className="flex gap-4 lg:gap-6 shrink-0 will-change-transform"
        >
          {endlessRow1.map((src, index) => (
            <div
              key={`p1-${index}`}
              className="
                h-48 w-32
                md:h-56 md:w-40
                lg:h-72 lg:w-52
                shrink-0
                rounded-2xl
                border border-white/10
                bg-zinc-900
                shadow-2xl
              "
              style={{
                backgroundImage: `url(${src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}
        </motion.div>

        {/* Poster marquee row 2 */}
        <motion.div
          style={{ x: useMotionValue(0) }}
          className="flex shrink-0 will-change-transform"
        >
          <motion.div
            ref={trackRef2}
            style={{ x: x2 }}
            className="flex gap-4 lg:gap-6 shrink-0"
            initial={{ x: -2000 }}
          >
            {endlessRow2.map((src, index) => (
              <div
                key={`p2-${index}`}
                className="
                  h-48 w-32
                  md:h-56 md:w-40
                  lg:h-72 lg:w-52
                  shrink-0
                  rounded-2xl
                  border border-white/10
                  bg-zinc-900
                  shadow-2xl
                "
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
