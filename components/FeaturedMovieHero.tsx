"use client";
import MovieHero from "@/components/MovieHero";
import convertOriginalImageUrl from "@/lib/utils/convertOriginalImage";
import { MovieInfo } from "@/constants/types/MovieInfo";
import { useEffect, useState, useRef } from "react";
import { useLocale } from "next-intl";
import { getRandomMovie } from "@/lib/tmdbCalls/getRandomMovie";
import Spinner from "./auth/Spinner";

export default function FeaturedMovieHero() {
  const [movie, setMovie] = useState<MovieInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const locale = useLocale();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch the initial movie
  useEffect(() => {
    let isMounted = true;
    const fetchInitialMovie = async () => {
      setLoading(true);
      try {
        const fetchedMovie = await getRandomMovie(locale);
        if (isMounted) setMovie(fetchedMovie);
      } catch (error) {
        console.error("Failed to fetch movies: ", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchInitialMovie();
    return () => { isMounted = false; };
  }, [locale]);

  // Set up interval for changing movie
  useEffect(() => {
    if (!movie) return;
    intervalRef.current = setInterval(async () => {
      setIsFading(true); 
      await new Promise((resolve) => setTimeout(resolve, 400));
      try {
        const fetchedMovie = await getRandomMovie(locale);
        setMovie(fetchedMovie);
      } catch (error) {
        console.error("Failed to fetch movies: ", error);
      }
      setIsFading(false);
    }, 20000);
    return () => {
      clearInterval(intervalRef.current!);
    };
  }, [movie, locale]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Spinner size={50} />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        No movies found.
      </div>
    );
  }

  return (
    <div
      className={`transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}
    >
      <MovieHero
        id={movie.id}
        title={movie.title}
        vote_average={movie.vote_average}
        release_date={movie.release_date?.slice(0, 4) || ""}
        overview={movie.overview}
        backdrop_path={convertOriginalImageUrl(movie.backdrop_path)}
        homepage={movie.homepage}
        moreInfo={true}
      />
    </div>
  );
}
