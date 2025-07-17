import { getAllMovies } from "./getAllMovies";

export async function getRandomMovie() {
  const movies = await getAllMovies();
  if (!movies || movies.length === 0) return null;
  const idx = Math.floor(Math.random() * movies.length);
  return movies[idx];
} 