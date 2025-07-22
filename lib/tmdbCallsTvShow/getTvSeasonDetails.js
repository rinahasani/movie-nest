import { API_ENDPOINTS } from "@/constants/api";

export async function getTvSeasonDetails(
  tvId,
  seasonNumber,
  language = "en-EN"
) {
  const url = API_ENDPOINTS.TV_SEASON_DETAILS(tvId, seasonNumber, language);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch season ${seasonNumber} details for TV show ID ${tvId}: ${response.statusText}`
    );
  }
  const data = await response.json();
  return data;
}
