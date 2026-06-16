"use client";

import React, { useTransition, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddMovieForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // States to track duration values for the helper text
  const [hours, setHours] = useState<string>("");
  const [minutes, setMinutes] = useState<string>("");

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

    // We construct a new FormData to build the final formatted text payload correctly
    const originalFormData = new FormData(form);
    const formData = new FormData();

    const title = originalFormData.get("title")?.toString().trim();
    const genre = originalFormData.get("genre")?.toString().trim();
    const watchDate = originalFormData.get("watchDate")?.toString();
    const image = originalFormData.get("image") as File;

    // Format duration into the standard single string format: "X hr Y min"
    const h = originalFormData.get("durationHours")?.toString().trim() || "0";
    const m = originalFormData.get("durationMinutes")?.toString().trim() || "0";
    const duration = `${h} hr ${m} min`;

    if (!title || !genre || !h || !m || !watchDate || !image?.name) {
      toast.error("Please fill all fields before saving ❌");
      return;
    }

    // Append standard formatting structure fields for backend api compatibility
    formData.append("title", title);
    formData.append("genre", genre);
    formData.append("duration", duration);
    formData.append("watchDate", watchDate);
    formData.append("image", image);

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
        setHours("");
        setMinutes("");
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
      <div className="w-full max-w-2xl">
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

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
              {/* LEFT SIDE: POSTER COLUMN */}
              <div className="md:col-span-2 flex flex-col items-center">
                <div className="w-full">
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
                    className="
                      aspect-[2/3]
                      w-full
                      bg-[#161324]
                      rounded-xl
                      border
                      border-dashed
                      border-gray-600
                      cursor-pointer
                      overflow-hidden
                      flex
                      flex-col
                      justify-center
                      items-center
                      p-2
                      hover:border-[#ED80E9]/50
                      transition-colors
                    "
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center px-2">
                        <span className="block text-2xl mb-1">📁</span>
                        <p className="text-xs text-gray-400">
                          Click to Upload Poster
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Dynamic hint message updates text based on download preview status */}
                  {imagePreview && (
                    <p className="text-center text-xs text-[#ED80E9] mt-2 animate-pulse">
                      Click the image to change poster
                    </p>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE: TEXT FIELDS COLUMN */}
              <div className="md:col-span-3 space-y-4">
                {/* TITLE */}
                <div>
                  <label className="block mb-2">Movie Title</label>
                  <input
                    type="text"
                    name="title"
                    disabled={isPending}
                    className="w-full rounded-md p-3 bg-[#161324] text-white focus:outline-none focus:ring-1 focus:ring-[#ED80E9]/30"
                  />
                </div>

                {/* GENRE SELECT DROPDOWN MENU */}
                <div>
                  <label className="block mb-2">Genre</label>
                  <select
                    name="genre"
                    disabled={isPending}
                    className="w-full rounded-md p-3 bg-[#161324] text-white focus:outline-none focus:ring-1 focus:ring-[#ED80E9]/30 cursor-pointer"
                  >
                    <option value="" className="text-gray-500">
                      -- Select Genre --
                    </option>
                    <option value="Action">Action</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Animation">Animation</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Drama">Drama</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Horror">Horror</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Romance">Romance</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Thriller">Thriller</option>
                  </select>
                </div>

                {/* DURATION INPUTS WITH WORDS */}
                <div>
                  <label className="block mb-2">Duration</label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-[#161324] rounded-md px-3 w-1/2">
                      <input
                        type="number"
                        name="durationHours"
                        min="0"
                        placeholder="2"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        disabled={isPending}
                        className="w-full py-3 bg-transparent text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-xs text-gray-400 ml-1">hr</span>
                    </div>

                    <div className="flex items-center bg-[#161324] rounded-md px-3 w-1/2">
                      <input
                        type="number"
                        name="durationMinutes"
                        min="0"
                        max="59"
                        placeholder="30"
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        disabled={isPending}
                        className="w-full py-3 bg-transparent text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-xs text-gray-400 ml-1">min</span>
                    </div>
                  </div>

                  {/* Dynamic Format Counter Visual Example Preview below text */}
                  <p className="text-xs text-gray-500 mt-1.5 pl-1">
                    Format example:{" "}
                    <span className="text-gray-300 font-mono">
                      {hours || "2"} hr {minutes || "30"} min
                    </span>
                  </p>
                </div>

                {/* WATCH DATE */}
                <div>
                  <label className="block mb-2">Watch Date</label>
                  <input
                    type="date"
                    name="watchDate"
                    disabled={isPending}
                    className="w-full rounded-md p-3 bg-[#161324] text-white focus:outline-none focus:ring-1 focus:ring-[#ED80E9]/30"
                  />
                </div>
              </div>
            </div>

            {/* FULL WIDTH FORM BUTTON AT THE BOTTOM */}
            <button
              type="submit"
              disabled={isPending}
              className="
                w-full
                h-11
                rounded-md
                bg-[#9400D3]
                text-white
                font-bold
                mt-6
                hover:bg-[#8000c2]
                transition-colors
                disabled:opacity-50
              "
            >
              {isPending ? "Saving..." : "Save Movie"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
