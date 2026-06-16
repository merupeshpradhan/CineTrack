import { Suspense } from "react";
import VerifyAnimatedPosterGrid from "@/components/verify/VerifyAnimatedPosterGrid";
import VerifyOtpCard from "@/components/verify/VerifyOtpCard";

export default function VerifyPage() {
  return (
    <main className="flex min-h-screen flex-col md:flex-row bg-[#050508] text-white">
      {/* FIXED: Wrapping with Suspense stops the Next.js compiler build worker from crashing */}
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center bg-[#050508] text-[#ED80E9] text-xs">
            Loading verification layout...
          </div>
        }
      >
        <VerifyOtpCard />
      </Suspense>

      {/* Animated movie showcase */}
      <VerifyAnimatedPosterGrid />
    </main>
  );
}
