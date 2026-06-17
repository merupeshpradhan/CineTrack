// Define props accepted by LocationInput component
interface LocationInputProps {
  // Disable input during form submission
  isPending: boolean;
}

// Reusable Location Input Component
export default function LocationInput({ isPending }: LocationInputProps) {
  return (
    <div>
      {/* Input label */}
      <label
        className="
          block
          mb-2
          text-sm
          font-medium
          text-gray-300
        "
      >
        Watch Location
      </label>

      {/* Input wrapper */}
      <div
        className="
          flex
          items-center
          bg-[#161324]
          rounded-md
          px-3
          w-full
          border
          border-white/5
          focus-within:border-[#ED80E9]/30
          transition-colors
        "
      >
        <input
          // Text input
          type="text"
          // Form field name
          name="location"
          // Disable while submitting
          disabled={isPending}
          // Input styling
          className="
            w-full
            py-3
            bg-transparent
            outline-none
            text-white
            text-sm
            disabled:opacity-50
          "
          // Example helper text
          placeholder="
            e.g. AMC Theater,
            New York,
            Home...
          "
        />
      </div>
    </div>
  );
}
