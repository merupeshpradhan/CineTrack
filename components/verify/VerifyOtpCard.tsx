"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function VerifyOtpCard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));

  function handleInputChange(value: string, index: number) {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otpValues];

    updated[index] = value;

    setOtpValues(updated);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const combinedOtp = otpValues.join("");

    if (combinedOtp.length < 6) {
      toast.error("Please enter complete OTP");

      return;
    }

    const toastId = toast.loading("Verifying...");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          otp: combinedOtp,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      localStorage.setItem("accessToken", result.accessToken);

      toast.success("Login Successful", {
        id: toastId,
      });

      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Verification Failed",
        {
          id: toastId,
        },
      );
    }
  }

  return (
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

        <p className="mt-3 text-zinc-400">Verification code sent to:</p>

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
          <button
            onClick={() => router.push("/")}
            className="text-sm text-zinc-500 transition hover:text-zinc-300"
          >
            ← Use a different email address
          </button>
        </div>
      </div>

      <div className="mt-10 text-xs text-zinc-600">
        🔒 End-to-end encrypted watch archiving interface structure.
      </div>
    </div>
  );
}
