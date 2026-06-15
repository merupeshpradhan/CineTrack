"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    // 1. Create an instance of the loading toast and save its ID
    const toastId = toast.loading("Dropping record from catalog...");

    startTransition(async () => {
      try {
        // ✅ FIXED: Replaced Server Action with a clean API post network thread request
        const res = await fetch("/api/movie/deleteMovie", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movieId: id }), // Sending parameters via body match configurations
        });

        const data = await res.json();

        if (res.ok && data.success) {
          // 2. Overwrite the loading toast with a success state
          toast.success("Movie deleted successfully ✅", { id: toastId });
          router.refresh(); // Refresh current active listing elements
        } else {
          // 3. Overwrite the loading toast with an error state if the response fails
          toast.error(data.error || "Delete failed ❌", { id: toastId });
        }
      } catch (error) {
        // 4. Catch unexpected network/server crash errors
        toast.error("An unexpected error occurred ❌", { id: toastId });
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="h-9 px-4 text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
