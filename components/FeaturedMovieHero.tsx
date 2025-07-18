import { getRandomMovie } from "../lib/getRandomMovie";
import MovieHero from "../components/MovieHero";
import convertOriginalImageUrl from "../lib/utils/convertOriginalImage";

export default async function FeaturedMovieHero() {
  const movie = await getRandomMovie();

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
