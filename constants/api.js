export const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "fdb91272c3f95e9e093b31f73184bd5c"; //your api key here
export const API_ENDPOINTS = {
  DISCOVER:(page = 1,language = 'en-EN') => `${BASE_URL}/discover/movie?page=${page}&api_key=${API_KEY}&language=${language}`,
  // GENRES: (language = 'en-EN') `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=${language}`,
  MOVIE_DETAILS: (movieId,language='en-EN') => `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=${language}`,
};
