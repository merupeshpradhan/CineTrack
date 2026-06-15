"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { useRouter } from "next/navigation";
import { setAccessToken } from "@/lib/api-client";
import toast from "react-hot-toast";

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

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const trackRef1 = useRef<HTMLDivElement>(null);
  const trackRef2 = useRef<HTMLDivElement>(null);

  const x1 = useMotionValue(0);
  const x2 = useMotionValue(0);

  const [hover1, setHover1] = useState(false);
  const [hover2, setHover2] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 100);

    return () => clearTimeout(timer);
  }, []);

  const endlessRow1 = [...POSTERS_ROW_1, ...POSTERS_ROW_1, ...POSTERS_ROW_1];
  const endlessRow2 = [...POSTERS_ROW_2, ...POSTERS_ROW_2, ...POSTERS_ROW_2];

  useAnimationFrame((_, delta) => {
    if (!ready) return;

    if (!hover1 && trackRef1.current) {
      const width = trackRef1.current.scrollWidth;

      const base = width / 3;

      x1.set(wrapX(-base, 0, x1.get() - delta * 0.06));
    }

    if (!hover2 && trackRef2.current) {
      const width = trackRef2.current.scrollWidth;

      const base = width / 3;

      x2.set(wrapX(-base * 2, -base, x2.get() + delta * 0.06));
    }
  });

  async function sendOtp() {
    try {
      setLoading(true);

      const res = await fetch("/api/auth/send-otp", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setOtpSent(true);

      setStatus("success");

      setMessage("OTP sent successfully");
    } catch (error: any) {
      setStatus("error");

      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    try {
      setLoading(true);

      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setAccessToken(data.accessToken);

      router.push("/dashboard");
    } catch (error: any) {
      setStatus("error");

      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070c] text-white">
      {/* Glow */}

      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[150px]" />

        <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-fuchsia-500/20 blur-[120px]" />
      </div>

      {/* Posters */}

      <div className="absolute inset-0 flex flex-col justify-center gap-6 opacity-15">
        {[endlessRow1, endlessRow2].map((row, index) => (
          <div key={index} className="overflow-hidden">
            <motion.div
              ref={index === 0 ? trackRef1 : trackRef2}
              style={{
                x: index === 0 ? x1 : x2,
              }}
              onMouseEnter={() =>
                index === 0 ? setHover1(true) : setHover2(true)
              }
              onMouseLeave={() =>
                index === 0 ? setHover1(false) : setHover2(false)
              }
              className="flex gap-6"
            >
              {row.map((img, i) => (
                <div
                  key={i}
                  className="h-44 w-32 md:h-64 md:w-44 shrink-0 rounded-3xl"
                  style={{
                    backgroundImage: `url(${img})`,
                    backgroundSize: "cover",
                  }}
                />
              ))}
            </motion.div>
          </div>
        ))}
      </div>

      <div className="relative z-20 flex min-h-screen items-center px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-20 lg:grid-cols-2">
          {/* LEFT */}

          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
              🎬 Movie Watchlist
            </div>

            <h1 className="text-6xl font-black leading-tight">
              Track Every
              <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                Movie You Watch
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-zinc-400 text-lg">
              Organize your watch history, discover favorites and continue where
              you left off.
            </p>

            <div className="mt-10 flex gap-4 flex-wrap">
              {["Passwordless", "OTP Secure", "Watchlist"].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
                >
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT LOGIN */}

          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* Glow Border */}

              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 opacity-30 blur-xl" />

              <div className="relative rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-3xl shadow-2xl">
                {/* Header */}

                <div className="mb-8 text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-3xl shadow-lg shadow-violet-500/30">
                    🎬
                  </div>

                  <h2 className="text-3xl font-bold">
                    {otpSent ? "Verify OTP" : "Welcome Back"}
                  </h2>

                  <p className="mt-2 text-zinc-400">
                    {otpSent
                      ? "Enter your verification code"
                      : "Continue with email to access your collection"}
                  </p>
                </div>

                {/* Message */}

                {message && (
                  <div
                    className={`mb-5 rounded-2xl border p-4 text-sm ${
                      status === "error"
                        ? "border-red-500/20 bg-red-500/10 text-red-300"
                        : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <div className="space-y-6">
                  {/* EMAIL */}

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium text-zinc-300">
                        Email Address
                      </label>

                      {otpSent && (
                        <button
                          type="button"
                          onClick={() => {
                            setOtpSent(false);
                            setOtp("");
                            setMessage("");
                            setStatus("idle");
                          }}
                          className="text-xs text-violet-400 hover:text-violet-300"
                        >
                          Change
                        </button>
                      )}
                    </div>

                    <input
                      type="email"
                      value={email}
                      disabled={otpSent || loading}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-14 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-white placeholder:text-zinc-500 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60"
                    />
                  </div>

                  {/* OTP */}

                  {otpSent && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-300">
                        Verification Code
                      </label>

                      <input
                        value={otp}
                        maxLength={6}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="000000"
                        className="h-14 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-center text-lg tracking-[8px] outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>
                  )}

                  {/* BUTTON */}

                  {!otpSent ? (
                    <button
                      onClick={sendOtp}
                      disabled={loading || !email}
                      className="group h-14 w-full rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/20 disabled:opacity-40"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {loading ? "Sending..." : "Continue with Email"}

                        <span className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={verifyOtp}
                      disabled={loading || otp.length < 6}
                      className="group h-14 w-full rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/20 disabled:opacity-40"
                    >
                      {loading ? "Verifying..." : "Verify OTP →"}
                    </button>
                  )}
                </div>

                {/* Footer */}

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
