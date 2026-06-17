import React from "react"; // Import React

// Define props type for BackButton component
interface BackButtonProps {
  // Function to execute when button is clicked
  onClick: () => void;

  // Disable button during loading state
  disabled: boolean;
}

// Reusable Back Button Component
export default function BackButton({ onClick, disabled }: BackButtonProps) {
  return (
    <button
      // Prevent form submission
      type="button"
      // Execute back navigation action
      onClick={onClick}
      // Disable interaction if loading
      disabled={disabled}
      // Styling
      className="
        inline-flex
        items-center
        gap-2
        mb-4
        text-[10px]
        font-black
        uppercase
        tracking-widest
        text-[#D3D3FF]/40
        hover:text-[#ED80E9]
        transition-colors
        group
        cursor-pointer
        disabled:opacity-50
      "
    >
      {/* Animated left arrow */}
      <span
        className="
          transform
          group-hover:-translate-x-0.5
          transition-transform
        "
      >
        &larr;
      </span>
      {/* Button text */}
      Back to Dashboard
    </button>
  );
}
