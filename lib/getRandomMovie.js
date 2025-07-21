import { API_ENDPOINTS } from "../constants/api";
import { ERROR_MESSAGES } from "../constants/strings";

export async function getRandomMovie(language) {
  try {
    // Fetch a random page (1-10 for variety)
    const page = Math.floor(Math.random() * 10) + 1;
    const response = await fetch(API_ENDPOINTS.DISCOVER(page,language), { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(ERROR_MESSAGES.API_FETCH_FAILED(response.status));
    }
    const data = await response.json();
    if (!data.results || data.results.length === 0) return null;
    const idx = Math.floor(Math.random() * data.results.length);
    return data.results[idx];
  } catch (error) {
    console.error(ERROR_MESSAGES.ERROR_FETCHING_MOVIES, error);
    return null;
  }
} 