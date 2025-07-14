// app/popular/page.tsx
import React from "react";
import { getAllMovies } from "../../public/lib/getAllMovies";
import PopularMovies from "@/components/popular/PopularMovies"; // '@' means root directory if configured, otherwise use relative path
import { ERROR_MESSAGES } from "@/public/constants/strings";

export const metadata = {
  title: "Popular Movies",
  description: "Discover the most popular movies.",
};

export default async function PopularMoviesPage() {
  const movies = await getAllMovies();
  const SLIDE_COUNT = movies ? movies.length : 0;
  const slides = Array.from({ length: SLIDE_COUNT }, (_, i) => i);
  const OPTIONS = { loop: true };
  const hasMovies = movies && movies.length > 0;
 
  return (
    <>
      <main>
        <h1>Popular Movies</h1>
        {hasMovies ? (
          <PopularMovies slides={slides} options={OPTIONS} movies={movies}/>
        ) : (
          <p>{ERROR_MESSAGES.NO_MOVIES_FOUND}</p>
        )}
      </main>
    </>
  );
}
