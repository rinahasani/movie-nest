import { ERROR_MESSAGES } from "@/constants/strings";
import PopularMovies from "./popular/PopularMovies";
import { getAllMovies } from "@/lib/getAllMovies";

export default async function PopularCarousel() {
  const movies = await getAllMovies(2);
  const SLIDE_COUNT = movies ? movies.length : 0;
  const slides = Array.from({ length: SLIDE_COUNT }, (_, i) => i);
  const OPTIONS = { loop: true };
  const hasMovies = movies && movies.length > 0;
  return (
    <main className="bg-black m-6">
      <h1 className="text-3xl md:text-2xl font-extrabold leading-tight drop-shadow-lg m-6">
        Popular
      </h1>
      {hasMovies ? (
        <PopularMovies slides={slides} options={OPTIONS} movies={movies} />
      ) : (
        <p>{ERROR_MESSAGES.NO_MOVIES_FOUND}</p>
      )}
    </main>
  );
} 
