import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchOverlay = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setResults([]);

      const res = await axios.get(
        `https://event-sphere-live-server.vercel.app/api/movies/search?q=${encodeURIComponent(
          query
        )}`
      );

      setResults(res.data || []);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (id) => {
    onClose();
    navigate(`/movies/${id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-2xl"
      >
        ✖
      </button>

      <div className="text-center w-full max-w-xl px-6">
        <h2 className="text-2xl font-bold text-white mb-6">Search Movies 🎬</h2>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex justify-center mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter movie title..."
            className="w-full p-3 rounded text-black"
          />
          <button
            type="submit"
            className="ml-3 px-6 py-2 bg-pink-600 rounded hover:bg-pink-700"
          >
            Search
          </button>
        </form>

        {loading && <p className="text-gray-400">Searching...</p>}

        {/* Search Results */}
        <div className="text-white grid grid-cols-2 gap-4">
          {results.length > 0 ? (
            results.map((movie) => (
              <div
                key={movie._id}
                className="bg-white/10 p-3 rounded text-left cursor-pointer hover:bg-white/20"
                onClick={() => handleMovieClick(movie._id)}
              >
                <img
                  src={movie.poster_path}
                  alt={movie.title}
                  className="w-full h-48 object-cover rounded mb-2"
                />
                <h3 className="font-semibold">{movie.title}</h3>
                <p className="text-sm text-gray-300">
                  {movie.release_date?.slice(0, 4)} • ⭐{" "}
                  {movie.vote_average?.toFixed(1)}
                </p>
              </div>
            ))
          ) : (
            !loading && <p className="text-gray-400">No results yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
