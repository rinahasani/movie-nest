"use client";
import PopularMovies from "./popular/PopularMovies";
import { useEffect, useState } from "react";
import { MovieInfo } from "@/constants/types/MovieInfo";
import { useLocale, useTranslations } from "next-intl";
import { getTrendingMovies } from "@/lib/tmdbCalls/getTrendingMovies";

export default function PopularCarousel() {
  const [movies, setMovies] = useState<MovieInfo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const fetchedMovies = await getTrendingMovies(locale);
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
  const t = useTranslations("popularCarousel");

  return (
    <main className="bg-black m-6">
      <h1 className="text-3xl md:text-2xl font-extrabold leading-tight drop-shadow-lg m-6">
        {t("title")}
      </h1>
      {hasMovies ? (
        <PopularMovies slides={slides} options={OPTIONS} movies={movies} />
      ) : (
        <p>{t("noMovies")}</p>
      )}
    </main>
  );
}
