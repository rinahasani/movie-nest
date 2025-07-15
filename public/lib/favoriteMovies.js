import { ref, set, remove, get } from "firebase/database";
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
  const snapshot = await get(movieRef);

  if (!snapshot.exists()) {
    throw new Error(ERROR_MESSAGES.MOVIE_NOT_FOUND);
  }

  return remove(movieRef);
}
