"use client";

import React, { useTransition, useState } from "react";
import { updateMovie } from "@/actions/actions";
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

        // ✅ only send image if user selects new file
        if (image) {
          formData.append("image", image);
        }

        const res = await updateMovie(formData);

        if (res?.success) {
          toast.success("Movie updated successfully ✅", { id: toastId });
          router.push(`/dashboard/movie/${movie.id}`);
          router.refresh();
        } else {
          toast.error("Failed to update ❌", { id: toastId });
        }
      } catch (err) {
        console.error(err);
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
          className="mb-6 text-xs uppercase text-white/50 hover:text-pink-400"
        >
          ← Back
        </button>

        <form
          onSubmit={handleSubmit}
          className="bg-[#161324] p-6 rounded-2xl space-y-5"
        >
          <h2 className="text-xl font-bold">Edit Movie</h2>

          {/* TITLE */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded bg-black/40"
            placeholder="Title"
            required
          />

          {/* IMAGE UPLOAD */}
          <div>
            <label className="text-xs text-white/50">
              Update Poster Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full p-2 mt-1 bg-black/40 rounded"
            />
          </div>

          {/* DATE */}
          <input
            type="date"
            value={watchDate}
            onChange={(e) => setWatchDate(e.target.value)}
            className="w-full p-3 rounded bg-black/40"
            required
          />

          {/* DESCRIPTION */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded bg-black/40"
            rows={4}
          />

          {/* WATCHED */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={watched}
              onChange={(e) => setWatched(e.target.checked)}
            />
            Mark as watched
          </label>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isPending}
              className="px-4 py-2 bg-white/10 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 bg-pink-600 rounded font-bold"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
