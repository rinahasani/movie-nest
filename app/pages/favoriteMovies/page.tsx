"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "../../contexts/AuthContext";
import { getUserFavorites } from "../../../lib/favoriteMovies";
import { getMovieDetails } from "../../../lib/getMovieDetails";
import { ERROR_MESSAGES } from "../../../constants/strings";

// TMDB movie type
type TMDBMovie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  original_language: string;
};

// Firebase favorite type
type Favorite = {
  id: string;
  title: string;
};

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  async function handleRemove(movieId: number) {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/favorites/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movie: { id: movieId } }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || ERROR_MESSAGES.UNKNOWN_ERROR);
      }
      setMovies((curr) => curr.filter((m) => m.id !== movieId));
    } catch (err) {
      setErrorMsg(ERROR_MESSAGES.ERROR_FETCHING_MOVIES);
      console.error(ERROR_MESSAGES.ERROR_FETCHING_MOVIES, err);
    }
  }

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-black text-white">
        <p className="text-lg">Loading…</p>
      </div>
    );
  }

  // Empty state
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
          <span className="text-yellow-400">favorite movies</span> is still empty
          for the{" "}
          <span className="text-yellow-400">moment.</span>
        </h2>
      </div>
    );
  }

  return (
    <section className="bg-black text-white py-12 px-6 lg:px-20 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-10">
        <span className="text-white">The movies you’ve </span>
        <span className="text-yellow-400">marked</span>
        <span className="text-white"> as </span>
        <span className="text-yellow-400">favorites.</span>
      </h1>

      {/* Error message UI */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-600 rounded text-white font-semibold">
          {errorMsg}
        </div>
      )}

      <ul className="space-y-6">
        {movies.map((m) => (
          <li
            key={m.id}
            className="flex flex-col md:flex-row bg-[#111] rounded-xl overflow-hidden shadow-lg"
          >
            <div className="flex-shrink-0">
              <Image
                src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                alt={m.title}
                width={150}
                height={225}
                className="object-cover"
              />
            </div>

            <div className="flex flex-col flex-grow p-6">
              <h2 className="text-xl font-bold mb-2">{m.title}</h2>
              <p className="flex items-center space-x-2 mb-4 text-sm text-gray-300">
                <span>⭐ {m.vote_average.toFixed(1)}</span>
                <span>•</span>
                <span>{new Date(m.release_date).getFullYear()}</span>
                <span>•</span>
                <span>{m.original_language.toUpperCase()}</span>
              </p>

              <div className="mt-auto flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-[#f4c10f] text-black font-semibold rounded-lg hover:bg-[#e0b609] transition">
                  More Info
                </button>
                <button
                  onClick={() => handleRemove(m.id)}
                  className="px-4 py-2 bg-[#ea1c2c] text-white font-semibold rounded-lg hover:bg-[#c41826] transition"
                >
                  Remove from Favorites
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-center mt-12">
        <button className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-600 transition">
          See More
        </button>
      </div>
    </section>
  );
}
