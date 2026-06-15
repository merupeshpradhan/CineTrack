"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { setAccessToken } from "@/lib/api-client";
import toast from "react-hot-toast";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ✅ FIXED: Replaced Server Action with a clean API post call matching your backend
  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingOut) return;

    const toastId = toast.loading("Logging out of session...");
    try {
      setIsLoggingOut(true);

      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout execution failed on server");

      // Wipe out RAM access token tracking states safely so nobody can steal the session
      setAccessToken(null);

      toast.success("Logged out safely!", { id: toastId });
      router.push("/"); // Kick back to root home login page
    } catch (err) {
      console.error("Logout system workflow crashed:", err);
      toast.error("Failed to terminate session", { id: toastId });
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="flex flex-row items-center justify-between gap-4 pb-6 border-b border-[#D8BFD8]/10">
      {/* Application branding */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black uppercase bg-gradient-to-r from-[#D3D3FF] via-[#ED80E9] to-[#9400D3] text-transparent bg-clip-text select-none">
          CineTrack
        </h1>
        <p className="text-[10px] text-[#D3D3FF]/40 uppercase tracking-widest font-semibold mt-0.5">
          Movie Dashboard
        </p>
      </div>

      {/* Dashboard actions navigation group */}
      <div className="flex items-center gap-3">
        {/* ✅ FIXED: Swapped traditional link out for optimized Next.js Link */}
        <Link
          href="/dashboard/add-movie"
          className="bg-[#9400D3] hover:bg-[#800080] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition active:scale-[0.98] shadow-md shadow-[#9400D3]/10 text-center"
        >
          + Add Movie
        </Link>

        {/* ✅ FIXED: Form triggers the handleLogout function directly over the network */}
        <form onSubmit={handleLogout}>
          <button
            type="submit"
            disabled={isLoggingOut}
            className="bg-white/5 hover:bg-white/10 text-[#D3D3FF] border border-white/5 hover:border-white/10 text-xs font-medium px-4 py-2.5 rounded-lg cursor-pointer transition active:scale-[0.98] disabled:opacity-40"
          >
            {isLoggingOut ? "Leaving..." : "Logout"}
          </button>
        </form>
      </div>
    </header>
  );
}
  