import { API_ENDPOINTS } from "../constants/api";

export async function getTvShowDetails(tvId, language = "en-EN") {
  const url = API_ENDPOINTS.TV_SHOW_DETAILS(tvId, language);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch TV show details for ID ${tvId}: ${response.statusText}`
    );
  }
  const data = await response.json();
  return data; 
}
