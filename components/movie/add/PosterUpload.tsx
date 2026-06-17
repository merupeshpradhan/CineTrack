import React from "react";

// Define props (data + functions) received from parent component
interface PosterUploadProps {
  // Reference to hidden file input
  fileInputRef: React.RefObject<HTMLInputElement | null>;

  // Stores preview image URL (or null if no image selected)
  imagePreview: string | null;

  // Function triggered when user selects a file
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Function triggered when upload area is clicked
  onZoneClick: () => void;
}

// Reusable component for uploading and previewing movie poster
export default function PosterUpload({
  fileInputRef,
  imagePreview,
  onFileChange,
  onZoneClick,
}: PosterUploadProps) {
  return (
    <div className="w-full">
      {/* Label shown above upload section */}
      <label className="block mb-2">Poster</label>

      {/* Hidden file input (opened manually using click) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*" // Only allow image files
        name="image"
        onChange={onFileChange} // Runs when image selected
        className="hidden" // Hide default browser upload UI
      />

      {/* Custom upload area */}
      <div
        onClick={onZoneClick} // Open file selector
        className="aspect-[2/3] w-full bg-[#161324] rounded-xl border border-dashed border-gray-600 cursor-pointer overflow-hidden flex flex-col justify-center items-center p-2 hover:border-[#ED80E9]/50 transition-colors"
      >
        {/* If image exists → show preview */}
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="preview"
            className="w-full h-full object-contain"
          />
        ) : (
          // Otherwise show upload placeholder
          <div className="text-center px-2">
            <span className="block text-2xl mb-1">📁</span>
            <p className="text-xs text-gray-400">Click to Upload Poster</p>
          </div>
        )}
      </div>

      {/* Show helper message after image selected */}
      {imagePreview && (
        <p className="text-center text-xs text-[#ED80E9] mt-2 animate-pulse">
          Click the image to change poster
        </p>
      )}
    </div>
  );
}
