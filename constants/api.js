export const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
export const API_ENDPOINTS = {
  DISCOVER:(page = 1,language = 'en-EN') => `${BASE_URL}/discover/movie?page=${page}&api_key=${API_KEY}&language=${language}&include_adult=false`,
  GENRES: (language = 'en-EN') => `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=${language}`,
  MOVIE_DETAILS: (movieId,language='en-EN') => `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=${language}&include_adult=false`,
  MOVIE_BY_GENRE:(page = 1,language = 'en-EN',genreId) => `${BASE_URL}/discover/movie?with_genres=${genreId}&page=${page}&api_key=${API_KEY}&language=${language}&include_adult=false`,
  TRENDING_MOVIES: (language = 'en-EN') => `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=${language}&include_adult=false`,
};
