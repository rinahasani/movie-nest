export interface Season {
  id: number;
  name: string;
  overview: string;
  air_date: string;
  episode_count: number;
  poster_path: string | null;
  season_number: number;
  episodes?: Episode[]; 
}

export interface Episode {
    id: number;
    name: string;
    overview: string;
    still_path: string | null;
    air_date: string;
    episode_number: number;
    season_number: number;
    vote_average: number;
  }