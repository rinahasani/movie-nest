import { Season } from "./Season";

export interface TvShow {
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    first_air_date: string;
    vote_average: number;
    genre_ids: number[];
    number_of_seasons?: number; 
    number_of_episodes?: number; 
    seasons: Season[]; 
  }