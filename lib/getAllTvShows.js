import { API_ENDPOINTS } from '../constants/api';

export async function getAllTvShows(page = 1, language = 'en-EN') {
  const url = API_ENDPOINTS.DISCOVER_TV(page, language);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch TV shows: ${response.statusText}`);
  }
  const data = await response.json();
  return {
    results: data.results,
    total_pages: data.total_pages,
  };
}