"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function WatchedCheckbox({
  id,
  watched,
}: {
  id: string;
  watched: boolean;
}) {
  const [isWatched, setIsWatched] = useState(watched);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  // Keep local state synchronized with incoming props
  useEffect(() => {
    setIsWatched(watched);
  }, [watched]);

  const handleChange = () => {
    const nextState = !isWatched;

    // Optimistically update UI instantly for zero-lag feeling
    setIsWatched(nextState);

    const loading = toast.loading("Updating watch status...");

    startTransition(async () => {
      try {
        // ✅ FIXED: Swapped server action out for direct client-side fetch pipeline
        const response = await fetch("/api/movie/toggleWatched", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Update operation failed");
        }

        toast.dismiss(loading);
        toast.success(nextState ? "Marked as Watched ✅" : "Moved to Queue ⏳");
        router.refresh(); // ✅ Refresh dashboard stats in real-time
      } catch (err) {
        // Revert UI state back to what it was if network/database fails
        setIsWatched(!nextState);

        toast.dismiss(loading);
        toast.error("Update failed ❌");
      }
    });
  };

  return (
    <div className="flex items-center gap-2 select-none">
      <input
        type="checkbox"
        checked={isWatched}
        disabled={pending}
        onChange={handleChange}
        className="w-4 h-4 cursor-pointer accent-[#9400D3]"
      />

      <span className="text-xs font-mono uppercase text-[#D3D3FF]/70">
        {isWatched ? "Watched" : "Not Watched"}
      </span>
    </div>
  );
}
