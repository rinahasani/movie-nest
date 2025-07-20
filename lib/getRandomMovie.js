import { getAllMovies } from "./getAllMovies";

export async function getRandomMovie(page = 1,language) {
  const movies = await getAllMovies(page,language);
  if (!movies || movies.length === 0) return null;
  const idx = Math.floor(Math.random() * movies.length);
  return movies[idx];
} 