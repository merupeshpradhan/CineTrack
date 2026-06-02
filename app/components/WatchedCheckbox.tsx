"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={watched}
        disabled={pending}
        onChange={() => {
          const loadingToast = toast.loading("Saving changes...");

          startTransition(async () => {
            await toggleWatched(id);

            toast.dismiss(loadingToast);

            toast.success("Movie status updated ✅");

            router.refresh();
          });
        }}
      />
      <span>{isWatched ? "✅ Watched" : "⏳ Not Watched"}</span>
    </div>
  );
}
