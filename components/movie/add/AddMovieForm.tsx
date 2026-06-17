"use client";

// Import React hooks
// useTransition → handle async UI state
// useState → manage local component state
// useRef → access DOM elements directly
import React, { useTransition, useState, useRef } from "react";

// Import router for navigation
import { useRouter } from "next/navigation";

// Import toast notifications
import toast from "react-hot-toast";

// Import reusable UI components
import BackButton from "@/components/movie/add/BackButton";
import PosterUpload from "@/components/movie/add/PosterUpload";
import MovieDetails from "@/components/movie/add/MovieDetails";
import DurationInput from "@/components/movie/add/DurationInput";
import WatchDatePicker from "@/components/movie/add/WatchDatePicker";
import LocationInput from "@/components/movie/add/LocationInput";
import SubmitButton from "@/components/movie/add/SubmitButton";

// Main Add Movie Page Component
export default function AddMoviePage() {
  // Router instance for navigation
  const router = useRouter();

  // Reference for hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manage loading state during submit
  const [isPending, startTransition] = useTransition();

  // Store selected image preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Store selected watch date
  const [watchDate, setWatchDate] = useState<string>("");

  // Store movie duration hours
  const [hours, setHours] = useState<string>("");

  // Store movie duration minutes
  const [minutes, setMinutes] = useState<string>("");

  // Handle image selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get selected file
    const file = e.target.files?.[0];

    // Generate preview URL
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Open file picker manually
  const handleZoneClick = () => {
    // Prevent upload during loading
    if (!isPending) {
      fileInputRef.current?.click();
    }
  };

  // Navigate back to dashboard
  const handleBack = () => {
    // Show loading toast
    const toastId = toast.loading("Leaving editor...");

    setTimeout(() => {
      // Success notification
      toast.success("Back to dashboard", {
        id: toastId,
      });

      // Redirect
      router.push("/dashboard");
    }, 500);
  };

  // Handle movie form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent page refresh
    e.preventDefault();

    const form = e.currentTarget;

    // Get form values
    const originalFormData = new FormData(form);

    // Create payload
    const formData = new FormData();

    // Extract form fields
    const title = originalFormData.get("title")?.toString().trim();

    const genre = originalFormData.get("genre")?.toString().trim();

    const watchDateVal = originalFormData.get("watchDate")?.toString();

    const location = originalFormData.get("location")?.toString().trim() || "";

    const image = originalFormData.get("image") as File;

    // Build duration format
    const h = originalFormData.get("durationHours")?.toString().trim() || "0";

    const m = originalFormData.get("durationMinutes")?.toString().trim() || "0";

    const duration = `${h} hr ${m} min`;

    // Validate fields
    if (!title || !genre || !h || !m || !watchDateVal || !image?.name) {
      toast.error("Please fill all fields before saving ❌");

      return;
    }

    // Add values to FormData
    formData.append("title", title);

    formData.append("genre", genre);

    formData.append("duration", duration);

    formData.append("watchDate", watchDateVal);

    formData.append("location", location);

    formData.append("image", image);

    // Show loading toast
    const toastId = toast.loading("Saving movie... 🎬");

    // Execute async submit
    startTransition(async () => {
      try {
        // Send request to API
        const response = await fetch("/api/movie/addMovie", {
          method: "POST",

          body: formData,
        });

        const data = await response.json();

        // Handle server errors
        if (!response.ok) {
          throw new Error(data.error || "Failed to add movie");
        }

        // Show success
        toast.success(data.message || "Movie added successfully ✅", {
          id: toastId,
        });

        // Reset form
        form.reset();

        setImagePreview(null);

        setHours("");

        setMinutes("");

        setWatchDate("");

        // Redirect
        router.push("/dashboard");

        router.refresh();
      } catch (error: any) {
        // Show error
        toast.error(error.message || "Server error occurred ❌", {
          id: toastId,
        });
      }
    });
  };

  // UI
  return (
    <div className="min-h-screen bg-[#110e1a] text-[#D3D3FF] flex justify-center items-center px-4 py-12">
      <div className="w-full max-w-4xl">
        {/* Back button */}
        <BackButton onClick={handleBack} disabled={isPending} />

        {/* Main card */}
        <div className="bg-[#D8BFD8]/5 rounded-xl p-6 border border-[#D8BFD8]/10">
          {/* Page heading */}
          <h1 className="text-center text-2xl font-black text-white mb-6">
            Add Movie
          </h1>

          {/* Movie form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
              {/* Poster upload */}
              <div className="md:col-span-2 flex flex-col items-center">
                <PosterUpload
                  fileInputRef={fileInputRef}
                  imagePreview={imagePreview}
                  onFileChange={handleFileChange}
                  onZoneClick={handleZoneClick}
                />
              </div>

              {/* Input section */}
              <div className="md:col-span-3 space-y-4">
                <MovieDetails isPending={isPending} />

                <DurationInput
                  hours={hours}
                  minutes={minutes}
                  setHours={setHours}
                  setMinutes={setMinutes}
                  isPending={isPending}
                />

                <WatchDatePicker
                  watchDate={watchDate}
                  setWatchDate={setWatchDate}
                  isPending={isPending}
                />

                <LocationInput isPending={isPending} />
              </div>
            </div>

            {/* Submit */}
            <SubmitButton isPending={isPending} />
          </form>
        </div>
      </div>
    </div>
  );
}
