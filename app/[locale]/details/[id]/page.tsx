import MovieDetails from "@/components/MovieDetails";
import React from "react";

export default function DetailsMoviesPage({
  params,
}: {
  params: { id: string };
}) {
  const resolvedParams = React.use(Promise.resolve(params)); 
  const id = resolvedParams.id;
  return (
    <>
      <main>
        <MovieDetails id={id} />
      </main>
    </>
  );
}
