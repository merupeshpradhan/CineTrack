"use client";

import { useRef, useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import toast from "react-hot-toast";
import { verifyOTP } from "@/actions/actions";

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

export default function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(searchParams);
  const email = resolvedParams.email || "";

  // OTP input state management
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);

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

  // Handle OTP digit input and auto-focus next field
  const handleInputChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newValues = [...otpValues];
    newValues[index] = value;
    setOtpValues(newValues);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Navigate to previous field on backspace
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP and authenticate user
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const combinedOtp = otpValues.join("");
    if (combinedOtp.length < 6) {
      toast.error("Please enter a complete 6-digit code");
      return;
    }

    const toastId = toast.loading("Authorising login...");
    try {
      const result = await verifyOTP(email, combinedOtp);

      if (!result.success) {
        toast.error("Invalid OTP", { id: toastId });
        return;
      }

      toast.success("Welcome! Loading library...", {
        id: toastId,
      });

      router.refresh();
      router.push("/dashboard");
    } catch {
      toast.error("Invalid verification code", { id: toastId });
    }
  }

  return (
    <main className="flex min-h-screen flex-col md:flex-row bg-[#050508] text-white">
     {/* OTP verification panel */}
      <div className="flex w-full flex-col justify-between px-5 py-8 sm:px-8 md:px-10 lg:w-[45%] lg:px-16 xl:px-24">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xl shadow-md shadow-violet-500/20">
            🎬
          </div>
          <span className="text-sm font-semibold tracking-wide text-zinc-300">
            WATCHLIST
          </span>
        </div>

        <div className="mx-auto my-auto w-full max-w-md lg:mx-0">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
            Security Check
          </h1>

          <p className="mt-3 text-sm text-zinc-400 sm:text-base">
            We sent a one-time authorization code to your mailbox address:
          </p>

          <div className="mt-3 inline-block max-w-full break-all rounded-lg border border-white/5 bg-zinc-900 px-3 py-2 text-xs font-mono text-violet-400 sm:text-sm">
            {email}
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6 sm:mt-10">
            <div>
              <label className="mb-4 block text-xs font-bold uppercase tracking-widest text-zinc-500">
                Verification Pin
              </label>

              <div className="flex justify-center gap-2 sm:gap-3">
                {otpValues.map((val, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el!;
                    }}
                    type="text"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleInputChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className="
                    h-12 w-10
                    sm:h-14 sm:w-12
                    md:h-16 md:w-14
                    rounded-xl
                    border border-white/10
                    bg-zinc-900/50
                    text-center
                    text-lg sm:text-xl
                    font-bold
                    text-white
                    outline-none
                    transition-all
                    focus:border-violet-500
                    focus:ring-4
                    focus:ring-violet-500/10
                  "
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="
              group
              h-12 sm:h-14
              w-full
              rounded-xl
              bg-gradient-to-r
              from-violet-600
              via-fuchsia-500
              to-pink-500
              font-semibold
              shadow-lg
              shadow-violet-600/20
              transition-all
              duration-300
              hover:opacity-95
              hover:shadow-violet-600/30
              cursor-pointer
            "
            >
              Verify Identity
            </button>
          </form>

          <div className="mt-8 text-center sm:text-left">
            <a
              href="/"
              className="text-sm text-zinc-500 transition hover:text-zinc-300"
            >
              ← Use a different email address
            </a>
          </div>
        </div>

        <div className="mt-10 text-xs text-zinc-600">
          🔒 End-to-end encrypted watch archiving interface structure.
        </div>
      </div>

      {/* Animated movie showcase */}
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
    </main>
  );
}
