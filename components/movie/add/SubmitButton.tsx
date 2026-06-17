import React from "react";

// Define props received from parent component
interface SubmitButtonProps {
  // Indicates whether form submission is in progress
  isPending: boolean;
}

// Reusable submit button component
export default function SubmitButton({ isPending }: SubmitButtonProps) {
  return (
    <button
      type="submit" // Makes button submit the form
      // Disable button while request is processing
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
        disabled:cursor-not-allowed
        cursor-pointer
      "
    >
      {/* Dynamic button text */}
      {isPending ? "Saving..." : "Save Movie"}
    </button>
  );
}
