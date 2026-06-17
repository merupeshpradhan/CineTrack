"use client";
// Client component because navigation hooks
// only work in browser

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchBox() {
  // Read current URL query parameters
  const searchParams = useSearchParams();

  // Get current route
  const pathname = usePathname();

  // Get router navigation methods
  const { replace } = useRouter();

  // Handles updating search query
  const handleSearch = (term: string) => {
    // Create editable copy of current params
    const params = new URLSearchParams(searchParams);

    if (term) {
      // Add/update search parameter
      params.set("search", term);
    } else {
      // Remove parameter if empty
      params.delete("search");
    }

    // Replace URL without full refresh
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    // Search wrapper
    <div className="relative w-full flex items-center">
      {/* SEARCH ICON */}
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
            // Magnifying glass icon
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z"
          />
        </svg>
      </span>

      {/* SEARCH INPUT */}
      <input
        type="text"
        placeholder="Filter collection entries..."
        // Load existing search from URL
        defaultValue={searchParams.get("search")?.toString() || ""}
        // Trigger search update
        onChange={(e) => handleSearch(e.target.value)}
        className="
          w-full
          bg-[#161324]
          border
          border-[#D8BFD8]/20
          rounded-md
          pl-9
          pr-3
          py-2
          text-sm
          text-[#D3D3FF]
          placeholder-[#D3D3FF]/20
          focus:outline-none
          focus:border-[#ED80E9]
          focus:ring-1
          focus:ring-[#ED80E9]
          transition-all
        "
      />
    </div>
  );
}
