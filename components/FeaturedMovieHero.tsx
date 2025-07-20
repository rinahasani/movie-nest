import { getRandomMovie } from "../lib/getRandomMovie";
import MovieHero from "../components/MovieHero";
import convertOriginalImageUrl from "../lib/utils/convertOriginalImage";
import { MovieInfo } from "@/constants/types/MovieInfo";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export default function FeaturedMovieHero() {
  const [movie, setMovie] = useState<MovieInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const fetchedMovie = await getRandomMovie(1,locale);
        setMovie(fetchedMovie);
      } catch (error) {
        console.error("Failed to fetch movies: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (!movie) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        No movies found.
      </div>
    );
  }

  return (
    <MovieHero
      id={movie.id}
      title={movie.title}
      vote_average={movie.vote_average}
      release_date={movie.release_date?.slice(0, 4) || ""}
      overview={movie.overview}
      backdrop_path={convertOriginalImageUrl(movie.backdrop_path)}
      homepage={movie.homepage}
      moreInfo={true}
    />
  );
}
