import AnimatedPosterGrid from "@/components/login/LoginAnimatedPosterGrid";
import HeroContent from "@/components/login/HeroContent";
import OtpLoginCard from "@/components/login/OtpLoginCard";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070c] text-white">

      {/* Animated background glow effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[150px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-fuchsia-500/20 blur-[120px]" />
        <div className="absolute top-1/2 left-0 h-[350px] w-[350px] rounded-full bg-indigo-500/20 blur-[120px]" />
      </div>
      {/* Infinite scrolling movie poster marquee */}
      <AnimatedPosterGrid />

      {/* Main hero section */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-24 md:pt-0">
        {/* Left Hero Side */}
        <HeroContent />

        {/* Right OTP login card */}
        <OtpLoginCard />
      </div>
    </main>
  );
}
