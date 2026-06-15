import VerifyAnimatedPosterGrid from "@/components/verify/VerifyAnimatedPosterGrid";
import VerifyOtpCard from "@/components/verify/VerifyOtpCard";

export default function VerifyPage() {
  return (
    <main className="flex min-h-screen flex-col md:flex-row bg-[#050508] text-white">
      {/* OTP verification panel */}
      <VerifyOtpCard />

      {/* Animated movie showcase */}
      <VerifyAnimatedPosterGrid />
    </main>
  );
}
