"use client";

import { useState, useTransition, useEffect } from "react";
import { toggleWatched } from "@/actions/actions";
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

  // Keep local state synchronized with incoming props
  useEffect(() => {
    setIsWatched(watched);
  }, [watched]);

  const handleChange = () => {
    const nextState = !isWatched;

    // Optimistically update UI before server confirmation
    setIsWatched(nextState);

    const loading = toast.loading("Updating...");

    startTransition(async () => {
      try {
        await toggleWatched(id);

        toast.dismiss(loading);
        toast.success(nextState ? "Marked as Watched ✅" : "Moved to Queue ⏳");
      } catch (err) {
        // Revert UI state if update fails
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
