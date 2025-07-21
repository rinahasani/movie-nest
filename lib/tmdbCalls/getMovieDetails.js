import { API_ENDPOINTS } from "@/constants/api";
import { ERROR_MESSAGES } from "@/constants/strings";

/**
 * @typedef {import("@/constants/types/MovieInfo").MovieInfo} MovieDetails
 */

/**
 * Fetch full details for one movie from TMDb
 * @param {number|string} movieId
 * @returns {Promise<MovieDetails|null>}
 */
export async function getMovieDetails(movieId,language){
  try {
    const url = API_ENDPOINTS.MOVIE_DETAILS(movieId,language);
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Movie not found (404) for movieId: ${movieId}`);
        return null;
      }
      throw new Error(
        ERROR_MESSAGES.API_FETCH_FAILED(response.status, `movie/${movieId}`)
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch details for movie ${movieId}:`, error);
    return null;
  }
}
