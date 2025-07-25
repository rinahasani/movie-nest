import { API_ENDPOINTS } from "@/constants/api";
import { ERROR_MESSAGES } from "@/constants/strings";

export async function searchTvShows(query, language) {
  try {
    const response = await fetch(API_ENDPOINTS.SEARCH_TV(query, language), {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      throw new Error(ERROR_MESSAGES.API_FETCH_FAILED(response.status));
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error searching TV shows:", error);
    return [];
  }
} 