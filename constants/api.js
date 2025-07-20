export const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = ""; //your api key here
export const API_ENDPOINTS = {
  DISCOVER:(page = 1) => `${BASE_URL}/discover/movie?page=${page}&api_key=${API_KEY}`,
  GENRES: `${BASE_URL}/genre/movie/list`,
  MOVIE_DETAILS: (movieId) => `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`,
};
