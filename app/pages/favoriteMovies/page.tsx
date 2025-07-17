"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "../../contexts/AuthContext";
import { getUserFavorites } from "../../../lib/favoriteMovies";
import { getMovieDetails } from "../../../lib/getMovieDetails";
import { ERROR_MESSAGES } from "../../../constants/strings";
import { handleRemoveFavorite } from "../../../lib/handlers/favoritesHandler";

import MovieCard, { TMDBMovie, User } from "../../../components/FavoriteMovieCard";

type Favorite = {
  id: string;
  title: string;
};

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // NEW: number of movies currently visible
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setMovies([]);
      setLoading(false);
      return;
    }

    async function loadFavorites() {
      try {
        const favs = await getUserFavorites();
        if (favs.length === 0) {
          setMovies([]);
          setLoading(false);
          return;
        }

        const details = await Promise.all(
          favs.map((f: Favorite) => getMovieDetails(f.id))
        );
        setMovies(details.filter((d): d is TMDBMovie => !!d));
        setLoading(false);
      } catch (err) {
        setErrorMsg(ERROR_MESSAGES.ERROR_FETCHING_MOVIES);
        setLoading(false);
        console.error(ERROR_MESSAGES.ERROR_FETCHING_MOVIES, err);
      }
    }

    loadFavorites();
  }, [authLoading, user]);

  function handleRemove(movieId: number) {
    handleRemoveFavorite(
      movieId,
      user as User,
      setMovies,
      setErrorMsg,
      ERROR_MESSAGES
    );
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-black text-white">
        <p className="text-lg">Loading…</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 bg-black text-white min-h-[80vh]">
        <Image
          src="/assets/empty-favorites.png"
          alt="No favorites"
          width={350}
          height={350}
        />
        <h2 className="mt-8 text-2xl font-bold max-w-md">
          It seems like your list of{" "}
          <span className="text-yellow-400">favorite movies</span> is still
          empty for the{" "}
          <span className="text-yellow-400">moment.</span>
        </h2>
      </div>
    );
  }

  // Slice down to only the movies we want to show right now
  const displayedMovies = movies.slice(0, visibleCount);

  return (
    <section className="bg-black text-white py-12 px-6 lg:px-20 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-10">
        <span>The movies you’ve </span>
        <span className="text-yellow-400">marked</span>
        <span> as </span>
        <span className="text-yellow-400">favorites.</span>
      </h1>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-600 rounded text-white font-semibold">
          {errorMsg}
        </div>
      )}

      <ul className="space-y-6">
        {displayedMovies.map((m) => (
          <MovieCard
            key={m.id}
            movie={m}
            user={user as User}
            onRemove={handleRemove}
          />
        ))}
      </ul>

      {/* Only show if there are more movies than we’re currently displaying */}
      {visibleCount < movies.length && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() =>
              setVisibleCount((prev) =>
                Math.min(prev + 5, movies.length)
              )
            }
            className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-600 transition"
          >
            See More
          </button>
        </div>
      )}
    </section>
  );
}
