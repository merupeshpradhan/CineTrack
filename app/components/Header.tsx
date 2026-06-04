"use client";

import { logout } from "@/actions/actions";

function Header() {
  return (
    <div>
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#D8BFD8]/15 pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-wider uppercase bg-gradient-to-r from-[#D3D3FF] via-[#ED80E9] to-[#9400D3] bg-clip-text text-transparent">
            CineTrack //
          </h1>
          <p className="text-[#D3D3FF]/40 text-[11px] uppercase tracking-widest mt-0.5">
            Personal Motion Picture Database
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/dashboard/add-movie"
            className="inline-flex items-center justify-center bg-[#9400D3] hover:bg-[#ED80E9] text-white font-bold text-xs px-4 py-2 rounded-md transition-all shadow-md shadow-[#9400D3]/20 active:scale-[0.98]"
          >
            + ADD TITLE
          </a>

          <form action={logout}>
            <button className="inline-flex items-center justify-center bg-[#D8BFD8]/10 hover:bg-[#D8BFD8]/20 border border-[#D8BFD8]/30 text-[#D3D3FF]/70 font-bold text-xs px-4 py-2 rounded-md transition-all">
              LOGOUT
            </button>
          </form>
        </div>
      </header>
    </div>
  );
}

export default Header;
