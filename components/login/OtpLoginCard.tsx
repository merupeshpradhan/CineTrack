"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function OtpLoginCard() {
  const router = useRouter();

  // Handle OTP login request
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    if (!email) {
      toast.error("Email is required");
      return;
    }

    const toastId = toast.loading("Sending OTP...");

    try {
      // Call my API route
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      toast.success("OTP Sent Successfully!", {
        id: toastId,
      });

      if (!response.ok) {
        throw new Error(data.error);
      }

      toast.success("OTP Sent Successfully!", {
        id: toastId,
      });

      router.push(`/verify?email=${email}`);
    } catch (error) {
      toast.error(
        "Failed to send OTP",
        (error instanceof Error ? error.message : "Faild to Send OTP",
        {
          id: toastId,
        }),
      );
    }
  }

  return (
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
  );
}
