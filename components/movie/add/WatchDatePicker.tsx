import React from "react";

// Props received from parent component
interface WatchDatePickerProps {
  // Selected watch date
  watchDate: string;

  // Function to update selected date
  setWatchDate: (val: string) => void;

  // Disable input while submitting
  isPending: boolean;
}

// Custom watch date picker component
export default function WatchDatePicker({
  watchDate,
  setWatchDate,
  isPending,
}: WatchDatePickerProps) {
  return (
    <div>
      {/* Label above date field */}
      <label className="block mb-2">Watch Date</label>

      {/* Wrapper for custom date input UI */}
      <div className="relative group cursor-pointer">
        {/* Hidden native HTML date picker */}
        <input
          type="date"
          name="watchDate"
          value={watchDate}
          // Update state when user selects date
          onChange={(e) => setWatchDate(e.target.value)}
          // Disable while request is running
          disabled={isPending}
          className="
            absolute
            inset-0
            w-full
            h-full
            opacity-0
            z-10
            cursor-pointer
            disabled:cursor-not-allowed

            /* Expand browser calendar icon to full area */
            [&::-webkit-calendar-picker-indicator]:absolute
            [&::-webkit-calendar-picker-indicator]:inset-0
            [&::-webkit-calendar-picker-indicator]:w-full
            [&::-webkit-calendar-picker-indicator]:h-full
            [&::-webkit-calendar-picker-indicator]:cursor-pointer
          "
        />

        {/* Custom visible date display */}
        <div className="flex items-center justify-between w-full rounded-xl p-3.5 bg-gradient-to-r from-[#161324] to-[#1c182e] border border-white/5 group-hover:border-[#ED80E9]/40 group-hover:shadow-[0_0_15px_rgba(237,128,233,0.1)] transition-all duration-300">
          {/* Left side date information */}
          <div className="flex items-center gap-2 select-none">
            {watchDate ? (
              <>
                {/* Day */}
                <span className="bg-[#ED80E9]/10 text-[#ED80E9] px-2.5 py-1 rounded-md text-sm font-mono font-bold border border-[#ED80E9]/20">
                  {watchDate.split("-")[2]}
                </span>

                {/* Month */}
                <span className="bg-white/5 text-white/90 px-2.5 py-1 rounded-md text-sm font-medium">
                  {new Date(watchDate).toLocaleString("en-US", {
                    month: "short",
                  })}
                </span>

                {/* Year */}
                <span className="bg-white/5 text-gray-400 px-2.5 py-1 rounded-md text-sm font-mono">
                  {watchDate.split("-")[0]}
                </span>
              </>
            ) : (
              // Placeholder when no date selected
              <span className="text-gray-500 text-sm pl-1">
                Set a watch date...
              </span>
            )}
          </div>

          {/* Calendar icon */}
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1a162b] border border-white/5 text-[#ED80E9] group-hover:bg-[#ED80E9] group-hover:text-white transition-all duration-300">
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
  );
}
