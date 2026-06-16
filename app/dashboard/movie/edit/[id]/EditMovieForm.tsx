"use client";

import React, { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type SerializedMovie = {
  id: string;
  title: string;
  genre?: string | null;
  duration?: string | null;
  imageUrl?: string | null;
  watchDate: string;
  watched: boolean;
};

export default function EditMovieForm({ movie }: { movie: SerializedMovie }) {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(movie.title);
  const [genre, setGenre] = useState(movie.genre || "");
  const [watchDate, setWatchDate] = useState(movie.watchDate);
  const [watched, setWatched] = useState(movie.watched);

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(movie.imageUrl || "");

  const parts = movie.duration?.match(/(\d+)\s*hr\s*(\d+)\s*min/) || [];

  const [hours, setHours] = useState(parts[1] || "");
  const [minutes, setMinutes] = useState(parts[2] || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);

    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const toastId = toast.loading("Updating movie...");

    startTransition(async () => {
      try {
        const formData = new FormData();

        formData.append("id", movie.id);
        formData.append("title", title);
        formData.append("genre", genre);
        formData.append("duration", `${hours || 0} hr ${minutes || 0} min`);
        formData.append("watchDate", watchDate);
        formData.append("watched", String(watched));

        if (image) {
          formData.append("image", image);
        }

        const response = await fetch("/api/movie/updateMovie", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        toast.success("Movie updated ✅", {
          id: toastId,
        });

        router.push(`/dashboard/movie/${movie.id}`);

        router.refresh();
      } catch (error: any) {
        toast.error(error.message || "Update failed", {
          id: toastId,
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#110e1a] text-[#D3D3FF] flex justify-center items-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <button
          onClick={() => router.back()}
          disabled={isPending}
          className="mb-4 text-xs text-[#ED80E9] cursor-pointer"
        >
          ← Back
        </button>

        <div className="bg-[#D8BFD8]/5 rounded-xl p-6 border border-[#D8BFD8]/10">
          <h1 className="text-center text-2xl font-black text-white mb-6">
            Edit Movie
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
              {/* LEFT */}

              <div className="md:col-span-2">
                <label className="block mb-2">Poster</label>

                <input
                  ref={fileInputRef}
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[2/3] w-full rounded-xl bg-[#161324] border border-dashed border-gray-600 overflow-hidden flex items-center justify-center cursor-pointer"
                >
                  <img
                    src={imagePreview || "/placeholder.jpg"}
                    alt={title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <p className="text-center text-xs mt-2 text-[#ED80E9]">
                  Click image to change
                </p>
              </div>

              {/* RIGHT */}

              <div className="md:col-span-3 space-y-4">
                {/* TITLE */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Title
                  </label>
                  <div className="flex items-center bg-[#161324] rounded-md px-3 w-full border border-white/5 focus-within:border-[#ED80E9]/30 transition-colors">
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full py-3 bg-transparent outline-none text-white"
                      placeholder="Enter movie title..."
                    />
                  </div>
                </div>

                {/* GENRE */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Genre
                  </label>
                  <div className="flex items-center bg-[#161324] rounded-md px-3 w-full border border-white/5 focus-within:border-[#ED80E9]/30 transition-colors">
                    <select
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full py-3 bg-transparent outline-none text-white cursor-pointer"
                    >
                      <option value="" className="bg-[#161324]">
                        Select Genre
                      </option>
                      <option className="bg-[#161324]">Action</option>
                      <option className="bg-[#161324]">Adventure</option>
                      <option className="bg-[#161324]">Comedy</option>
                      <option className="bg-[#161324]">Drama</option>
                      <option className="bg-[#161324]">Horror</option>
                      <option className="bg-[#161324]">Romance</option>
                      <option className="bg-[#161324]">Sci-Fi</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Duration</label>
                  <div className="flex gap-3">
                    {/* HOURS INPUT CONTAINER */}
                    <div className="flex items-center bg-[#161324] rounded-md pl-3 pr-1 w-1/2 justify-between border border-white/5 focus-within:border-[#ED80E9]/30">
                      <div className="flex items-center flex-1">
                        <input
                          type="number"
                          value={hours}
                          onChange={(e) => setHours(e.target.value)}
                          className="w-full py-3 bg-transparent outline-none text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="0"
                        />
                        <span className="text-sm text-gray-400 select-none ml-1">
                          hr
                        </span>
                      </div>
                      {/* Custom styled control buttons */}
                      <div className="flex flex-col ml-2">
                        <button
                          type="button"
                          onClick={() =>
                            setHours(
                              String(Math.max(0, Number(hours || 0) + 1)),
                            )
                          }
                          className="text-[#ED80E9] hover:text-white text-[10px] p-0.5 leading-none transition-colors"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setHours(
                              String(Math.max(0, Number(hours || 0) - 1)),
                            )
                          }
                          className="text-[#ED80E9] hover:text-white text-[10px] p-0.5 leading-none transition-colors"
                        >
                          ▼
                        </button>
                      </div>
                    </div>

                    {/* MINUTES INPUT CONTAINER */}
                    <div className="flex items-center bg-[#161324] rounded-md pl-3 pr-1 w-1/2 justify-between border border-white/5 focus-within:border-[#ED80E9]/30">
                      <div className="flex items-center flex-1">
                        <input
                          type="number"
                          value={minutes}
                          onChange={(e) => setMinutes(e.target.value)}
                          className="w-full py-3 bg-transparent outline-none text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="0"
                        />
                        <span className="text-sm text-gray-400 select-none ml-1">
                          min
                        </span>
                      </div>
                      {/* Custom styled control buttons */}
                      <div className="flex flex-col ml-2">
                        <button
                          type="button"
                          onClick={() =>
                            setMinutes(
                              String(Math.min(59, Number(minutes || 0) + 1)),
                            )
                          }
                          className="text-[#ED80E9] hover:text-white text-[10px] p-0.5 leading-none transition-colors"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setMinutes(
                              String(Math.max(0, Number(minutes || 0) - 1)),
                            )
                          }
                          className="text-[#ED80E9] hover:text-white text-[10px] p-0.5 leading-none transition-colors"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-[#ED80E9]/80">
                    Watch Date
                  </label>

                  <div className="relative group cursor-pointer">
                    {/* HIDDEN INPUT: Expanded to fill the container so clicking anywhere opens the calendar */}
                    <input
                      type="date"
                      value={watchDate}
                      onChange={(e) => setWatchDate(e.target.value)}
                      className="
                                absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer
                                [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0
                                [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full
                                [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />

                    {/* VISUAL DESIGN LAYER */}
                    <div
                      className="
                      flex items-center justify-between 
                      w-full rounded-xl p-3.5 
                      bg-gradient-to-r from-[#161324] to-[#1c182e]
                      border border-[#D8BFD8]/10 
                    group-hover:border-[#ED80E9]/40 
                      group-hover:shadow-[0_0_15px_rgba(237,128,233,0.1)]
                      transition-all duration-300"
                    >
                      {/* Date Pill Badges Container */}
                      <div className="flex items-center gap-2 select-none">
                        {watchDate ? (
                          <>
                            {/* Day Pill */}
                            <span className="bg-[#ED80E9]/10 text-[#ED80E9] px-2.5 py-1 rounded-md text-sm font-mono font-bold border border-[#ED80E9]/20">
                              {watchDate.split("-")[2]}
                            </span>
                            {/* Month Pill */}
                            <span className="bg-white/5 text-white/90 px-2.5 py-1 rounded-md text-sm font-medium">
                              {new Date(watchDate).toLocaleString("en-US", {
                                month: "short",
                              })}
                            </span>
                            {/* Year Pill */}
                            <span className="bg-white/5 text-gray-400 px-2.5 py-1 rounded-md text-sm font-mono">
                              {watchDate.split("-")[0]}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-500 text-sm pl-1">
                            Set a release or watch date...
                          </span>
                        )}
                      </div>

                      {/* Futuristic Circular Icon */}
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1a162b] border border-white/5 text-[#ED80E9] group-hover:bg-[#ED80E9] group-hover:text-whitetransition-all duration-300">
                        <svg
                          xmlns="http://w3.org"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <label className="flex gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={watched}
                    onChange={(e) => setWatched(e.target.checked)}
                    className="cursor-pointer"
                  />
                  Mark as watched
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-11 rounded-md bg-[#9400D3] mt-6 text-white font-bold cursor-pointer"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
