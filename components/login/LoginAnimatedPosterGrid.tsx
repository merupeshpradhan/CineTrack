"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";

// Images
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

const wrapX = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

export default function AnimatedPosterGrid() {
  const trackRef1 = useRef<HTMLDivElement>(null);
  const x1 = useMotionValue(0);

  const trackRef2 = useRef<HTMLDivElement>(null);
  const x2 = useMotionValue(0);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsReady(true), 100);
  }, []);

  const endlessRow1 = [...POSTERS_ROW_1, ...POSTERS_ROW_1, ...POSTERS_ROW_1];
  const endlessRow2 = [...POSTERS_ROW_2, ...POSTERS_ROW_2, ...POSTERS_ROW_2];

  useAnimationFrame((time, delta) => {
    if (!isReady) return;

    if (trackRef1.current) {
      const total = trackRef1.current.scrollWidth;
      const base = total / 3;

      x1.set(wrapX(-base, 0, x1.get() - delta * 0.06));
    }

    if (trackRef2.current) {
      const total = trackRef2.current.scrollWidth;
      const base = total / 3;

      x2.set(wrapX(-base * 0, -base, x2.get() + delta * 0.06));
    }
  });

  return (
    <div className="absolute top-0 left-0 right-0 z-0 flex flex-col gap-4 pt-28 pb-6 select-none opacity-15 lg:inset-0 lg:justify-center lg:gap-6 lg:py-0">
        {/* Row 1 Wrapper */}
        <div className="overflow-hidden flex w-full">
        <motion.div ref={trackRef1} style={{ x: x1 }} className="flex gap-6">
          {endlessRow1.map((img, i) => (
            <div
              key={i}
              className="h-44 w-32 md:h-64 md:w-44 rounded-2xl shrink-0"
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Row 2 */}
      <div className="overflow-hidden">
        <motion.div ref={trackRef2} style={{ x: x2 }} className="flex gap-6">
          {endlessRow2.map((img, i) => (
            <div
              key={i}
              className="h-44 w-32 md:h-64 md:w-44 rounded-2xl shrink-0"
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
