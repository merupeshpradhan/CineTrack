"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchBox() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    /* REMOVED: mb-6 and max-w-md here so it sizes naturally inside its dashboard row container */
    <div className="relative w-full flex items-center">
      {/* SEAMLESS SVG SEARCH INDICATOR ICON */}
      <span className="absolute left-3 opacity-30 pointer-events-none text-[#D3D3FF]">
        <svg
          xmlns="http://w3.org"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z"
          />
        </svg>
      </span>

      {/* MATCHING FORM CONTROLS */}
      <input
        type="text"
        placeholder="Filter collection entries..."
        defaultValue={searchParams.get("search")?.toString() || ""}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full bg-[#161324] border border-[#D8BFD8]/20 rounded-md pl-9 pr-3 py-2 text-sm text-[#D3D3FF] placeholder-[#D3D3FF]/20 focus:outline-none focus:border-[#ED80E9] focus:ring-1 focus:ring-[#ED80E9] transition-all"
      />
    </div>
  );
}
