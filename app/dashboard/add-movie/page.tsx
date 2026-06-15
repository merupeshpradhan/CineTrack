"use client";

import React, { useTransition, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddMovieForm() {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleZoneClick = () => {
    if (!isPending) {
      fileInputRef.current?.click();
    }
  };

  const handleBack = () => {
    const toastId = toast.loading("Leaving editor...");

    setTimeout(() => {
      toast.success("Back to dashboard", {
        id: toastId,
      });

      router.push("/dashboard");
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    const formData = new FormData(form);

    const title = formData.get("title")?.toString().trim();

    const description = formData.get("description")?.toString().trim();

    const watchDate = formData.get("watchDate")?.toString();

    const image = formData.get("image") as File;

    if (!title || !description || !watchDate || !image?.name) {
      toast.error("Please fill all fields before saving ❌");

      return;
    }

    const toastId = toast.loading("Saving movie... 🎬");

    startTransition(async () => {
      try {
        const response = await fetch("/api/movie/addMovie", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to add movie");
        }

        toast.success(data.message || "Movie added successfully ✅", {
          id: toastId,
        });

        form.reset();

        setImagePreview(null);

        router.push("/dashboard");

        router.refresh();
      } catch (error: any) {
        toast.error(error.message || "Server error occurred ❌", {
          id: toastId,
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#110e1a] text-[#D3D3FF] flex justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={handleBack}
          disabled={isPending}
          className="mb-4 text-xs text-[#ED80E9]"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-[#D8BFD8]/5 rounded-xl p-6 border border-[#D8BFD8]/10">
          <h1 className="text-center text-2xl font-black text-white mb-6">
            Add Movie
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Movie Title</label>

              <input
                type="text"
                name="title"
                disabled={isPending}
                className="w-full rounded-md p-3 bg-[#161324]"
              />
            </div>

            <div>
              <label className="block mb-2">Poster</label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                name="image"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={handleZoneClick}
                className="aspect-video bg-[#161324] rounded-xl border border-dashed cursor-pointer flex justify-center items-center overflow-hidden"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p>Click to Upload</p>
                )}
              </div>
            </div>

            <div>
              <label className="block mb-2">Description</label>

              <textarea
                name="description"
                rows={4}
                disabled={isPending}
                className="w-full rounded-md p-3 bg-[#161324]"
              />
            </div>

            <div>
              <label className="block mb-2">Watch Date</label>

              <input
                type="date"
                name="watchDate"
                disabled={isPending}
                className="w-full rounded-md p-3 bg-[#161324]"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-11 rounded-md bg-[#9400D3] text-white font-bold"
            >
              {isPending ? "Saving..." : "Save Movie"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
