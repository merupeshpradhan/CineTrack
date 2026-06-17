"use client";

// Read current route path
import { usePathname } from "next/navigation";

export default function Footer() {
  // Get current year automatically
  const currentYear = new Date().getFullYear();

  // Get current page path
  const pathname = usePathname();

  // Hide footer on auth pages
  if (pathname === "/" || pathname === "/login" || pathname === "/verify") {
    return null;
  }

  return (
    // Footer container
    <footer className="w-full bg-[#09070f] border-t border-[#252038] py-6 mt-auto">
      {/* Main content wrapper */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs select-none">
        {/* ===================== */}
        {/* LEFT SECTION */}
        {/* Logo + Copyright */}
        {/* ===================== */}
        <div className="w-full sm:w-1/3 text-center sm:text-left font-bold text-white tracking-wider uppercase">
          {/* Brand name */}
          Cine
          <span className="text-[#ED80E9]">Track</span>
          {/* Current year */}
          <span className="text-[#D3D3FF]/40 font-normal normal-case tracking-normal ml-2">
            © {currentYear} All rights reserved.
          </span>
        </div>

        {/* ===================== */}
        {/* CENTER SECTION */}
        {/* Navigation Links */}
        {/* ===================== */}
        <div className="w-full sm:w-1/3 flex justify-center items-center gap-6 font-medium text-[#D3D3FF]/60">
          {/* Dashboard page */}
          <a
            href="/dashboard"
            className="hover:text-[#ED80E9] transition-colors"
          >
            Library
          </a>

          {/* Add movie page */}
          <a
            href="/dashboard/add-movie"
            className="hover:text-[#ED80E9] transition-colors"
          >
            Add Movie
          </a>
        </div>

        {/* ===================== */}
        {/* RIGHT SECTION */}
        {/* Creator Credits */}
        {/* ===================== */}
        <div className="w-full sm:w-1/3 flex flex-wrap items-center justify-center sm:justify-end gap-x-3 gap-y-1 text-[#D3D3FF]/40 font-medium">
          {/* Developer credit */}
          <p>
            Developed by{" "}
            <span className="text-white font-semibold hover:text-[#ED80E9] transition-colors">
              Rupesh Pradhan
            </span>
            {/* Decorative movie icon */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
              🎬
            </span>
          </p>

          {/* Divider */}
          <span className="text-white/10 hidden sm:inline">|</span>

          {/* Project credit */}
          <p>
            Built for{" "}
            <span className="text-white font-semibold">
              Chai Aur Code Assignment
            </span>
            {/* Decorative movie icon */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
              🎬
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
