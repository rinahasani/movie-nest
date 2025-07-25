import React from "react";
import MovieResultItem from "./MovieResultItem";
import TvShowResultItem from "./TvShowResultItem";
import { Result as Movie } from "@/constants/types/Movie";
import { TvShow } from "@/constants/types/TvShow";

interface SearchResultsListProps {
  movieResults: Movie[];
  tvResults: TvShow[];
  favoriteIds: number[];
  onFavoriteClick: (e: React.MouseEvent, item: Movie | TvShow) => void;
  onMovieClick: (e: React.MouseEvent<any, MouseEvent>, movie: Movie) => void;
  onTvShowClick: (e: React.MouseEvent<any, MouseEvent>, show: TvShow) => void;
  user: any;
  loading: boolean;
  error?: string | null;
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({
  movieResults,
  tvResults,
  favoriteIds,
  onFavoriteClick,
  onMovieClick,
  onTvShowClick,
  user,
  loading,
  error,
}) => {
  if (loading) return <p className="text-white p-4">Loading...</p>;
  return (
    <ul className="max-h-[32rem] overflow-y-auto p-2 search-results-scrollbar w-full">
      {movieResults.length > 0 && (
        <>
          <li className="px-2 py-1 text-yellow-400 font-semibold">Movies:</li>
          {movieResults.slice(0, 5).map((movie) => (
            <MovieResultItem
              key={movie.id}
              movie={movie}
              isFavorite={favoriteIds.includes(movie.id)}
              onFavoriteClick={(e) => onFavoriteClick(e, movie)}
              onClick={(e) => onMovieClick(e, movie)}
              user={user}
            />
          ))}
        </>
      )}
      {tvResults.length > 0 && (
        <>
          <li className="px-2 py-1 text-yellow-400 font-semibold">TV Shows:</li>
          {tvResults.slice(0, 5).map((show) => (
            <TvShowResultItem
              key={show.id}
              show={show}
              isFavorite={favoriteIds.includes(show.id)}
              onFavoriteClick={(e) => onFavoriteClick(e, show)}
              onClick={(e) => onTvShowClick(e, show)}
              user={user}
            />
          ))}
        </>
      )}
      {movieResults.length === 0 && tvResults.length === 0 && !loading && (
        <p className="text-gray-400 p-4">No results found.</p>
      )}
      {error && <p className="text-red-500 p-2 text-xs">{error}</p>}
    </ul>
  );
};

export default SearchResultsList; 