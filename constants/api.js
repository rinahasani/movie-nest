export const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "4dbdd164e78dcc5d587179c7a0851ff2"; //your api key here
export const API_ENDPOINTS = {
  DISCOVER:(page = 1,language = 'en-EN') => `${BASE_URL}/discover/movie?page=${page}&api_key=${API_KEY}&language=${language}`,
  // GENRES: (language = 'en-EN') `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=${language}`,
  MOVIE_DETAILS: (movieId,language='en-EN') => `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=${language}`,
};
