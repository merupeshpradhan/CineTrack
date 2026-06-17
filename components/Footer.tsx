"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/login" || pathname === "/verify") {
    return null;
  }

  return (
    <footer className="w-full bg-[#09070f] border-t border-[#252038] py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs select-none">
        
        {/* 1. LEFT COLUMN (Logo & Copyright) */}
        <div className="w-full sm:w-1/3 text-center sm:text-left font-bold text-white tracking-wider uppercase">
          Cine<span className="text-[#ED80E9]">Track</span>
          <span className="text-[#D3D3FF]/40 font-normal normal-case tracking-normal ml-2">
            © {currentYear} All rights reserved.
          </span>
        </div>

        {/* 2. MIDDLE COLUMN (Navigation Links - Perfectly Centered) */}
        <div className="w-full sm:w-1/3 flex justify-center items-center gap-6 font-medium text-[#D3D3FF]/60">
          <a
            href="/dashboard"
            className="hover:text-[#ED80E9] transition-colors"
          >
            Library
          </a>
          <a
            href="/dashboard/add-movie"
            className="hover:text-[#ED80E9] transition-colors"
          >
            Add Movie
          </a>
        </div>

        {/* 3. RIGHT COLUMN (Your Creator Credits - Pushed to the Right Wall) */}
        <div className="w-full sm:w-1/3 flex flex-wrap items-center justify-center sm:justify-end gap-x-3 gap-y-1 text-[#D3D3FF]/40 font-medium">
          <p>
            Developed by{" "}
            <span className="text-white font-semibold hover:text-[#ED80E9] transition-colors">
              Rupesh Pradhan
            </span>{" "}
            🎬
          </p>
          <span className="text-white/10 hidden sm:inline">|</span>
          <p>
            Built for{" "}
            <span className="text-white font-semibold">
              Chai Aur Code Assignment
            </span>{" "}
            🎬
          </p>
        </div>

      </div>
    </footer>
  );
}
