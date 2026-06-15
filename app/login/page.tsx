import AnimatedPosterGrid from "@/components/login/LoginAnimatedPosterGrid";
import HeroContent from "@/components/login/HeroContent";
import OtpLoginCard from "@/components/login/OtpLoginCard";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070c] text-white">
      {/* Background glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 h-[250px] w-[250px] md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[100px] md:blur-[150px]" />

        <div className="absolute bottom-0 right-0 h-[250px] w-[250px] md:h-[350px] md:w-[350px] lg:h-[400px] lg:w-[400px] rounded-full bg-fuchsia-500/20 blur-[80px] md:blur-[120px]" />

        <div className="absolute top-1/2 left-0 h-[200px] w-[200px] md:h-[300px] md:w-[300px] lg:h-[350px] lg:w-[350px] rounded-full bg-indigo-500/20 blur-[80px] md:blur-[120px]" />
      </div>

      {/* Poster Background */}
      <div className="absolute inset-0 z-[1] opacity-80">
        <AnimatedPosterGrid />
      </div>

      {/* Main Section */}
      <section
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-screen
          w-full
          max-w-7xl
          flex-col
          items-center
          justify-center
          gap-12
          px-5
          py-24

          md:px-10
          lg:flex-row
          lg:gap-16
          lg:px-16
        "
      >
        {/* Hero */}
        <div className="w-full lg:w-1/2">
          <HeroContent />
        </div>

        {/* Login */}
        <div
          className="
            w-full
            max-w-md
            sm:max-w-lg
            lg:w-[430px]
            shrink-0
          "
        >
          <OtpLoginCard />
        </div>
      </section>
    </main>
  );
}
