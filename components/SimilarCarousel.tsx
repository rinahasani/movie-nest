"use client";
import React, { useEffect, useState } from "react";
import { getAllMovies } from "@/lib/getAllMovies";
import Carousel from "@/components/carousel/Carousel";
import { ERROR_MESSAGES } from "@/constants/strings";
import { MovieInfo } from "@/constants/types/MovieInfo";

export default function SimilarCarousel() {
  const [movies, setMovies] = useState<MovieInfo[] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const fetchedMovies = await getAllMovies();
        setMovies(fetchedMovies);
      } catch (error) {
        console.error("Failed to fetch movies: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const SLIDE_COUNT = movies ? movies.length : 0;
  const slides = Array.from({ length: SLIDE_COUNT }, (_, i) => i);
  const OPTIONS = { loop: true };
  const hasMovies = movies && movies.length > 0;

  return (
    <main className="bg-black m-6">
      <h1 className="text-3xl md:text-2xl font-extrabold leading-tight drop-shadow-lg m-6">
        Similar
      </h1>
      {hasMovies ? (
        <Carousel slides={slides} options={OPTIONS} movies={movies} />
      ) : (
        <p>{ERROR_MESSAGES.NO_MOVIES_FOUND}</p>
      )}
    </main>
  );
}
