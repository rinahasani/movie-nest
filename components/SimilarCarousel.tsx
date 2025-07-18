import React from "react";
import { getAllMovies } from "@/lib/getAllMovies";
import Carousel from "@/components/carousel/Carousel";
import { ERROR_MESSAGES } from "@/constants/strings";


export default async function SimilarCarousel() {
  const movies = await getAllMovies();
  const SLIDE_COUNT = movies ? movies.length : 0;
  const slides = Array.from({ length: SLIDE_COUNT }, (_, i) => i);
  const OPTIONS = { loop: true };
  const hasMovies = movies && movies.length > 0;

  return (
    <main className="bg-black m-6">
     <h1 className="text-3xl md:text-2xl font-extrabold leading-tight drop-shadow-lg m-6">Similar</h1>
      {hasMovies ? (
        <Carousel slides={slides} options={OPTIONS} movies={movies} />
      ) : (
        <p>{ERROR_MESSAGES.NO_MOVIES_FOUND}</p>
      )}
    </main>
  );
}
