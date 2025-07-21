"use client";
import React, { useEffect, useState } from "react";
import { getMovieDetails } from "@/lib/getMovieDetails";
import { MovieInfo } from "@/constants/types/MovieInfo";
import MovieDetails from "@/components/MovieDetails";
import { useLocale } from "next-intl";

export default function DetailsMoviesPage({
  params,
}: {
  params: { id: string };
}) {
  const [movieDetails, setMovieDetails] = useState<MovieInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

  const { id } = params;
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const fetchedMovieDetails = await getMovieDetails(id, locale);
        setMovieDetails(fetchedMovieDetails);
      } catch (error) {
        console.error("Failed to fetch movies: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);
  return (
    <>
      <main>
        {movieDetails ? (
          <MovieDetails movieDetails={movieDetails} />
        ) : (
          <p>No movie details found.</p>
        )}
      </main>
    </>
  );
}
