import { ref, set, remove } from "firebase/database";
import { db } from "./firebase";
import { ERROR_MESSAGES } from "../constants/strings";

// Add movie under users/{uid}/favoriteMovies/{movieId}
export async function addFavoriteMovie(uid, movie) {
  if (!uid || !movie?.id || !movie?.title) {
    throw new Error(ERROR_MESSAGES.INVALID_UID_OR_MOVIE);
  }
  const movieRef = ref(db, `users/${uid}/favoriteMovies/${movie.id}`);
  return set(movieRef, {
    id: movie.id,
    title: movie.title,
  });
}

// Remove movie from users/{uid}/favoriteMovies/{movieId}
export async function removeFavoriteMovie(uid, movie) {
  if (!uid || !movie?.id) {
    throw new Error(ERROR_MESSAGES.INVALID_UID_OR_MOVIE);
  }
  const movieRef = ref(db, `users/${uid}/favoriteMovies/${movie.id}`);
  return remove(movieRef);
}
