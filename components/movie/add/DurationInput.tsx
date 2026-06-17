// Define props accepted by DurationInput component
interface DurationInputProps {
  // Current hours value
  hours: string;

  // Current minutes value
  minutes: string;

  // Update hours state
  setHours: (val: string) => void;

  // Update minutes state
  setMinutes: (val: string) => void;

  // Disable inputs while submitting
  isPending: boolean;
}

// Reusable Duration Input Component
export default function DurationInput({
  hours,
  minutes,
  setHours,
  setMinutes,
  isPending,
}: DurationInputProps) {
  return (
    <div>
      {/* Section label */}
      <label className="block mb-2">Duration</label>

      {/* Duration input container */}
      <div className="flex items-center gap-3">
        {/* Hours Input */}
        <div className="flex items-center bg-[#161324] rounded-md px-3 w-1/2">
          <input
            // Numeric input
            type="number"
            // Form field name
            name="durationHours"
            // Minimum allowed value
            min="0"
            // Placeholder
            placeholder="2"
            // Controlled input value
            value={hours}
            // Update state on change
            onChange={(e) => setHours(e.target.value)}
            // Disable while loading
            disabled={isPending}
            // Input styling
            className="
              w-full
              py-3
              bg-transparent
              text-white
              focus:outline-none
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
              disabled:opacity-50
            "
          />

          {/* Hours unit */}
          <span className="text-xs text-gray-400 ml-1">hr</span>
        </div>

        {/* Minutes Input */}
        <div className="flex items-center bg-[#161324] rounded-md px-3 w-1/2">
          <input
            // Numeric input
            type="number"
            // Form field name
            name="durationMinutes"
            // Allowed range
            min="0"
            max="59"
            // Placeholder
            placeholder="30"
            // Controlled value
            value={minutes}
            // Update state
            onChange={(e) => setMinutes(e.target.value)}
            // Disable during submit
            disabled={isPending}
            // Styling
            className="
              w-full
              py-3
              bg-transparent
              text-white
              focus:outline-none
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
              disabled:opacity-50
            "
          />

          {/* Minutes unit */}
          <span className="text-xs text-gray-400 ml-1">min</span>
        </div>
      </div>

      {/* Live duration preview */}
      <p className="text-xs text-gray-500 mt-1.5 pl-1">
        Format example:
        <span className="text-gray-300 font-mono">
          {/* Show entered values or fallback examples */}
          {hours || "2"} hr {minutes || "30"} min
        </span>
      </p>
    </div>
  );
}
