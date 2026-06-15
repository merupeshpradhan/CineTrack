"use client";

import React, { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type SerializedMovie = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  watchDate: string;
  watched: boolean;
};

export default function EditMovieForm({ movie }: { movie: SerializedMovie }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(movie.title);
  const [description, setDescription] = useState(movie.description || "");
  const [watchDate, setWatchDate] = useState(movie.watchDate);
  const [watched, setWatched] = useState(movie.watched);
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const toastId = toast.loading(`Updating "${title}"...`);

    startTransition(async () => {
      try {
        const formData = new FormData();

        formData.append("id", movie.id);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("watchDate", watchDate);
        formData.append("watched", String(watched));

        // Only attach image payload if a brand new file is provided by the client
        if (image) {
          formData.append("image", image);
        }

        // ✅ FIXED: Replaced old server action import with direct native fetch API endpoint execution
        const response = await fetch("/api/movie/updateMovie", {
          method: "POST",
          body: formData, // Automatically sets multi-part headers securely
        });

        const data = await response.json();

        if (response.ok && data.success) {
          toast.success("Movie updated successfully ✅", { id: toastId });
          router.push(`/dashboard/movie/${movie.id}`);
          router.refresh(); // Clear static server cache elements
        } else {
          toast.error(data.error || "Failed to update ❌", { id: toastId });
        }
      } catch (err) {
        console.error("Movie update system loop crashed:", err);
        toast.error("Something went wrong ❌", { id: toastId });
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#110e1a] text-[#D3D3FF]">
      <div className="max-w-xl mx-auto px-4 py-12">
        <button
          onClick={() => router.back()}
          disabled={isPending}
          className="mb-6 text-xs uppercase text-white/50 hover:text-pink-400 bg-transparent border-none cursor-pointer"
        >
          ← Back
        </button>

        <form
          onSubmit={handleSubmit}
          className="bg-[#161324] p-6 rounded-2xl space-y-5 border border-white/5 shadow-xl"
        >
          <h2 className="text-xl font-bold text-white">Edit Movie</h2>

          {/* TITLE */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Movie Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/5 text-sm text-white focus:outline-none focus:border-pink-500 transition"
              placeholder="Title"
              required
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Update Poster Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full p-2.5 bg-black/40 rounded-xl border border-white/5 text-xs text-zinc-400"
            />
          </div>

          {/* DATE */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Watch Date
            </label>
            <input
              type="date"
              value={watchDate}
              onChange={(e) => setWatchDate(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/5 text-sm text-white focus:outline-none focus:border-pink-500 transition"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Plot Summary / Synopsis
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/5 text-sm text-white focus:outline-none focus:border-pink-500 transition resize-none"
              rows={4}
              placeholder="Write a summary..."
            />
          </div>

          {/* WATCHED */}
          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-300 w-fit cursor-pointer select-none">
            <input
              type="checkbox"
              checked={watched}
              onChange={(e) => setWatched(e.target.checked)}
              className="w-4 h-4 accent-pink-500 rounded cursor-pointer"
            />
            Mark as watched
          </label>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isPending}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-medium rounded-xl border border-white/5 cursor-pointer transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-pink-600/10 cursor-pointer transition active:scale-[0.98]"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
