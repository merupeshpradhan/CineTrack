"use client";

import React, { useTransition, useState, useRef } from "react";
import { addMovie } from "@/actions/actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddMovieForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  // Local state for image preview visualization
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handles displaying a quick preview when a user picks an image file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localPreviewUrl = URL.createObjectURL(file);
      setImagePreview(localPreviewUrl);
    }
  };

  // Explicit target handler to trigger file window cleanly from container clicks
  const handleZoneClick = () => {
    if (!isPending && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const watchDate = formData.get("watchDate")?.toString();
    const image = formData.get("image") as File;

    // ✅ CLIENT VALIDATION (instead of required)
    if (!title || !description || !watchDate || !image?.name) {
      toast.error("Please fill all fields before saving ❌");
      return;
    }

    const toastId = toast.loading("Saving movie... 🎬");

    startTransition(async () => {
      try {
        const res = await addMovie(formData);

        if (res?.success) {
          toast.success("Movie added successfully ✅", { id: toastId });
          router.push("/dashboard");
          router.refresh();
        } else {
          toast.error(res?.message || "Failed to add movie ❌", {
            id: toastId,
          });
        }
      } catch (err) {
        toast.error("Server error occurred ❌", { id: toastId });
      }
    });
  };

  const handleBack = () => {
  const toastId = toast.loading("Leaving editor...");

  setTimeout(() => {
    toast.success("Back to dashboard", { id: toastId });
    router.push("/dashboard");
  }, 500);
};

  return (
    <div className="min-h-screen bg-[#110e1a] text-[#D3D3FF] antialiased flex flex-col justify-center items-center px-4 sm:px-6 py-12 selection:bg-[#9400D3] selection:text-white">
      <div className="w-full max-w-md">
        {/* BACK NAVIGATION */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={isPending}
            className="text-[10px] font-black uppercase tracking-widest text-[#D3D3FF]/40 hover:text-[#ED80E9] transition-colors disabled:opacity-30 cursor-pointer"
          >
            &larr; Back to Catalog
          </button>
        </div>

        {/* FORM CONTAINER CARD */}
        <div className="bg-[#D8BFD8]/5 border border-[#D8BFD8]/10 rounded-xl p-6 md:p-8 shadow-xl relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r from-[#D3D3FF] via-[#ED80E9] to-[#9400D3]">
          <header className="mb-8 text-center space-y-2 border-b border-[#D8BFD8]/5 pb-5">
            <div className="inline-flex items-center gap-2 bg-[#9400D3]/10 text-[#ED80E9] px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border border-[#9400D3]/20">
              ● New Entry
            </div>
            <h1 className="text-2xl font-black uppercase tracking-wider text-white">
              Log Screening //
            </h1>
            <p className="text-[#D3D3FF]/50 text-xs max-w-xs mx-auto">
              Record your latest movie viewings, plot summaries, and final
              status flags.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* MOVIE TITLE */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#D3D3FF]/50 mb-1.5">
                Movie Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Dune: Part Two"
                disabled={isPending}
                className="w-full bg-[#161324] border border-[#D8BFD8]/20 rounded-md px-3 py-2 text-sm text-[#D3D3FF] placeholder-[#D3D3FF]/20 focus:outline-none focus:border-[#ED80E9] focus:ring-1 focus:ring-[#ED80E9] transition-all disabled:opacity-50"
              />
            </div>

            {/* UPGRADED CINEMATIC DROPZONE FILE SELECTOR */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#D3D3FF]/50 mb-1.5">
                Media Artwork / Poster Image
              </label>

              {/* HIDDEN INJECTED FILE FIELD */}
              <input
                type="file"
                name="image"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                disabled={isPending}
                className="hidden"
              />

              {/* TAPPABLE WORKSPACE BOUNDS */}
              <div
                onClick={handleZoneClick}
                className={`relative group aspect-[16/9] w-full bg-[#161324] border border-dashed border-[#D8BFD8]/20 hover:border-[#ED80E9]/40 rounded-xl overflow-hidden cursor-pointer flex flex-col items-center justify-center text-center p-4 transition-all ${
                  isPending ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Upload preview"
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-[1.02] group-hover:opacity-40 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative z-10 space-y-1 transform group-hover:scale-105 transition-transform">
                      <span className="text-xl">📸</span>
                      <p className="text-xs font-bold text-white uppercase tracking-wider drop-shadow-md">
                        Change Selected Poster
                      </p>
                      <p className="text-[10px] text-[#D3D3FF]/60 drop-shadow-md">
                        Click zone to browse system items
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2 py-4">
                    <div className="w-10 h-10 rounded-xl bg-[#D8BFD8]/10 flex items-center justify-center mx-auto text-lg border border-[#D8BFD8]/10 group-hover:bg-[#9400D3]/20 transition">
                      🎞️
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#D3D3FF] uppercase tracking-wider">
                        Upload Image File
                      </p>
                      <p className="text-[10px] text-[#D3D3FF]/40 mt-0.5">
                        Click workspace box to browse local storage
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#D3D3FF]/50 mb-1.5">
                Plot Summary / Review Abstract
              </label>
              <textarea
                name="description"
                placeholder="Log a concise description summary or personal synopsis details..."
                disabled={isPending}
                rows={3}
                className="w-full bg-[#161324] border border-[#D8BFD8]/20 rounded-md px-3 py-2 text-sm text-[#D3D3FF] placeholder-[#D3D3FF]/20 focus:outline-none focus:border-[#ED80E9] focus:ring-1 focus:ring-[#ED80E9] transition-all resize-none leading-relaxed disabled:opacity-50"
              />
            </div>

            {/* LOGGED WATCH DATE */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#D3D3FF]/50 mb-1.5">
                Logged Watch Timestamp
              </label>
              <input
                type="date"
                name="watchDate"
                disabled={isPending}
                className="w-full bg-[#161324] border border-[#D8BFD8]/20 rounded-md px-3 py-2 text-sm text-[#D3D3FF] focus:outline-none focus:border-[#ED80E9] focus:ring-1 focus:ring-[#ED80E9] transition-all scheme-dark disabled:opacity-50"
              />
            </div>

            {/* SUBMIT FORM BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full inline-flex items-center justify-center bg-[#9400D3] hover:bg-[#ED80E9] text-white font-black text-xs uppercase tracking-wider h-10 rounded-md transition-all shadow-md shadow-[#9400D3]/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Ingesting Metadata..." : "Save Entry Data"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
