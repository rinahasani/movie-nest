import React from "react";
import { getMovieDetails } from "@/lib/getMovieDetails";
import { MovieInfo } from "@/constants/types/MovieInfo";
import MovieDetails from "@/components/MovieDetails";

export default async function DetailsMoviesPage({
 params,
}: {
  params: { id: string };
}) {
  const { id } = await params
  let movieDetails: MovieInfo | null = null;
  if (id) {
    try {
      movieDetails = await getMovieDetails(id);
    } catch (error) {
      console.log(error);
    }
  }
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
