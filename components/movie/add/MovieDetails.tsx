// Define props accepted by MovieDetails component
interface MovieDetailsProps {
  // Disable fields while form submission is running
  isPending: boolean;
}

// Reusable Movie Details Component
// Responsible for collecting movie title and genre
export default function MovieDetails({ isPending }: MovieDetailsProps) {
  return (
    <>
      {/* =========================
          MOVIE TITLE SECTION
      ========================== */}
      <div>
        {/* Title label */}
        <label className="block mb-2">Movie Title</label>

        <input
          // Text input for movie title
          type="text"
          // FormData field key
          name="title"
          // Disable while submitting
          disabled={isPending}
          // Input styling
          className="
            w-full
            rounded-md
            p-3
            bg-[#161324]
            text-white
            focus:outline-none
            focus:ring-1
            focus:ring-[#ED80E9]/30
            disabled:opacity-50
          "
        />
      </div>

      {/* =========================
          MOVIE GENRE SECTION
      ========================== */}
      <div>
        {/* Genre label */}
        <label className="block mb-2">Genre</label>

        <select
          // FormData field key
          name="genre"
          // Disable during submit
          disabled={isPending}
          // Select styling
          className="
            w-full
            rounded-md
            p-3
            bg-[#161324]
            text-white
            focus:outline-none
            focus:ring-1
            focus:ring-[#ED80E9]/30
            cursor-pointer
            disabled:opacity-50
          "
        >
          {/* Default option */}
          <option value="" className="text-gray-500">
            -- Select Genre --
          </option>

          {/* Genre options */}
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
    </>
  );
}
