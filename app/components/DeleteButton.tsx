"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { deleteMovie } from "@/actions/actions";

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    // 1. Create an instance of the loading toast and save its ID
    const toastId = toast.loading("Dropping record from catalog...");

    startTransition(async () => {
      try {
        const res = await deleteMovie(id);

        if (res?.success) {
          // 2. Overwrite the loading toast with a success state
          toast.success("Movie deleted successfully ✅", { id: toastId });
        } else {
          // 3. Overwrite the loading toast with an error state if res.success is false
          toast.error("Delete failed ❌", { id: toastId });
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
      className="h-9 px-4 text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
