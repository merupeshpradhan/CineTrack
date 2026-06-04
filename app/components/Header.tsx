"use client";

import { logout } from "@/actions/actions";

export default function Header() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#D8BFD8]/10">
      <div>
        <h1 className="text-xl sm:text-2xl font-black uppercase bg-gradient-to-r from-[#D3D3FF] via-[#ED80E9] to-[#9400D3] text-transparent bg-clip-text">
          CineTrack
        </h1>
        <p className="text-xs text-[#D3D3FF]/40 uppercase tracking-widest">
          Movie Dashboard
        </p>
      </div>

      <div className="flex gap-2">
        <a
          href="/dashboard/add-movie"
          className="bg-[#9400D3] text-white text-xs px-4 py-2 rounded-md"
        >
          + Add
        </a>

        <form action={logout}>
          <button className="bg-white/10 text-xs px-4 py-2 rounded-md cursor-pointer">
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}
