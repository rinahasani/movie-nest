"use client";
import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { GenreThumb } from "./GenreThumb";
import { getMoviesByGenre } from "@/lib/tmdbCalls/getMoviesByGenre";
import { GenreChildItem } from "./GenreChildItem";

const GenreCarousel = (props) => {
  const { slides, options, genres } = props;
  const [moviesByGenre, setMoviesByGenre] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });
  const [emblaMovieRef, emblaMovieApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });
  const router = useRouter();
  const locale = useLocale();
  const onThumbClick = useCallback(
    (index) => {
      setSelectedIndex(index);
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi, moviesByGenre, router]
  );

  const onMovieClick = useCallback(
    (id) => {
      setSelectedMovie(id);
      router.push(`/${locale}/details/${id}`);
    },
    [router, locale]
  );

  const itemsPerColumn = 2;
  const columns = [];
  for (let i = 0; i < genres.length; i += itemsPerColumn) {
    columns.push(genres.slice(i, i + itemsPerColumn));
  }

  const moviesPerColumn = 2;
  const movieRows = [];
  if (moviesByGenre && moviesByGenre.length > 0) {
    for (let i = 0; i < moviesByGenre.length; i += moviesPerColumn) {
      movieRows.push(moviesByGenre.slice(i, i + moviesPerColumn));
    }
  }
  const fetchMoviesForSelectedGenre = useCallback(async () => {
    const currentGenre = genres[selectedIndex];
    if (!currentGenre) {
      setMoviesByGenre(null);
      return;
    }
    try {
      const fetchedMoviesByGenre = await getMoviesByGenre(
        1,
        locale,
        currentGenre.id
      );
      setMoviesByGenre(fetchedMoviesByGenre);
    } catch (error) {
      console.error(error);
    }
  }, [genres, selectedIndex, locale]);
  useEffect(() => {
    fetchMoviesForSelectedGenre();
  }, [fetchMoviesForSelectedGenre]);

  return (
    <div
      className="max-w-full x mx-auto px-4 "
      style={{
        "--slide-height": "19rem",
        "--slide-spacing": "1rem",
        "--slide-size": "100%",
      }}
    >
      <div className="mt-[var(--thumbs-slide-spacing,0.8rem)]">
        <div className="overflow-hidden" ref={emblaThumbsRef}>
          <div
            className="flex flex-row w-full"
            style={{ marginLeft: "calc(var(--thumbs-slide-spacing) * -1)" }}
          >
            {columns.map((column, i) => (
              <div key={i} className="flex flex-col mr-4">
                {column.map((genre, j) => (
                  <GenreThumb
                    key={genre.id}
                    onClick={() => onThumbClick(i * itemsPerColumn + j)}
                    selected={selectedIndex === i * itemsPerColumn + j}
                    genre={genre}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="mt-[var(--thumbs-slide-spacing,0.8rem)]">
          <div className="overflow-hidden" ref={emblaMovieRef}>
            <div
              className="flex flex-row w-full"
              style={{ marginLeft: "calc(var(--thumbs-slide-spacing) * -1)" }}
            >
              {movieRows.map((row, i) => (
                <div key={i} className="flex flex-col mr-4">
                  {row.map((movie, j) => (
                    <GenreChildItem
                      key={movie.id}
                      movie={movie}
                      onClick={() => onMovieClick(movie.id)}
                      selected={selectedMovie === movie.id}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenreCarousel;
