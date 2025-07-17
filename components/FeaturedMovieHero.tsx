import { getRandomMovie } from "../lib/getRandomMovie";
import MovieHero from "./MovieHero";
import convertOriginalImageUrl from "../lib/utils/convertOriginalImage";

export default async function FeaturedMovieHero() {
  const movie = await getRandomMovie();

  if (!movie) {
    return <div className="w-full min-h-[60vh] flex items-center justify-center">No movies found.</div>;
  }

  return (
    <MovieHero
      title={movie.title}
      rating={movie.vote_average}
      year={movie.release_date?.slice(0, 4) || ""}
      description={movie.overview}
      backgroundImage={convertOriginalImageUrl(movie.backdrop_path)}
    />
  );
} 