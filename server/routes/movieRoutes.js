import express from "express";
import Movie from "../models/Movie.js";

const router = express.Router();

// GET /api/movies/search?q=Avengers
router.get("/search", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);

    const movies = await Movie.find({
      title: { $regex: q, $options: "i" }
    }).limit(10);

    res.json(movies);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error while searching movies" });
  }
});

// GET /api/movies/:id
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (err) {
    console.error("Movie details error:", err);
    res.status(500).json({ message: "Server error while fetching movie details" });
  }
});

export default router;
