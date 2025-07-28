"use client";
import React, { useState, useEffect, useCallback, useTransition } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { GenreThumb } from "./GenreThumb";
import { getMoviesByGenre } from "@/lib/tmdbCalls/getMoviesByGenre";
import { GenreChildItem } from "./GenreChildItem";
import Spinner from "../auth/Spinner";

const GenreCarousel = (props) => {
  const {options, genres } = props;
  const [moviesByGenre, setMoviesByGenre] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
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
  const t = useTranslations("errors")
  const onThumbClick = useCallback(
    (index) => {
      setIsLoading(true);
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
    setIsLoading(true);
    const currentGenre = genres[selectedIndex];
    if (!currentGenre) {
      setMoviesByGenre(null);
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
         {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 rounded-lg">
            <Spinner size={50} />
          </div>
        )}
        <div
          className={`transition-opacity duration-1000 ease-out w-full ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          style={{ pointerEvents: isLoading ? "none" : "auto" }}
        >
          <div className="mt-[var(--thumbs-slide-spacing,0.8rem)]">
            <div className="overflow-hidden" ref={emblaMovieRef}>
              <div
                className="flex flex-row w-full"
                style={{ marginLeft: "calc(var(--thumbs-slide-spacing) * -1)" }}
              >
                {movieRows.length > 0 ? (
                  movieRows.map((row, i) => (
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
                  ))
                ) : (
                  !isLoading && (
                    <p className="text-center text-gray-500 w-full">
                     {t("noMoviesFound")}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenreCarousel;
