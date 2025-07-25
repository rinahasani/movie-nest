"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/app/contexts/AuthContext";
import { getUserFavorites } from "@/lib/favoriteMovies";
import {
  handleRemoveFavorite,
  handleAddFavorite,
} from "@/lib/handlers/favoritesHandler";
import { useRouter } from "next/navigation";

import MovieCard, {
  TMDBMovie,
  User,
} from "@/components/favorites/FavoriteMovieCard";
import { getMovieDetails } from "@/lib/tmdbCalls/getMovieDetails";

type Favorite = { id: string; title: string };

export default function FavoritesPage() {
  const t = useTranslations("favorites");
  const tErrors = useTranslations("errors");
  const { user, loading: authLoading } = useAuth();
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (authLoading || !user) return; // Guard: do not run if not logged in

    async function loadFavorites() {
      try {
        const favs = await getUserFavorites();
        if (!favs.length) {
          setMovies([]);
          setLoading(false);
          return;
        }
        const details = await Promise.all(
          favs.map((f: Favorite) => getMovieDetails(f.id, locale))
        );
        setMovies(details.filter((d: unknown): d is TMDBMovie => !!d));
        setLoading(false);
      } catch {
        setErrorMsg(tErrors("errorFetchingMovies"));
        setLoading(false);
      }
    }

    loadFavorites();
  }, [authLoading, user, tErrors]);

  function handleRemove(movieId: number) {
    if (!user) return; // Guard: do not run if not logged in
    handleRemoveFavorite(movieId, user as User, setMovies, setErrorMsg, {});
  }

  function handleAdd(movie: { id: number; title: string }) {
    if (!user) return; // Guard: do not run if not logged in
    handleAddFavorite(movie, user as User, setMovies, setErrorMsg, {});
  }

  // Loader for not logged in (prevents flicker and hook errors)
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <span className="text-lg">Signing out...</span>
      </div>
    );
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-black text-white">
        <p className="text-lg">{t("loading")}</p>
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 bg-black text-white min-h-screen">
        <Image
          src="/assets/empty-favorites.png"
          alt="No favorites"
          width={350}
          height={350}
        />
        <h2 className="mt-8 text-2xl font-bold max-w-md">{t("emptyTitle")}</h2>
      </div>
    );
  }

  const displayed = movies.slice(0, visibleCount);

  return (
    <section className="bg-black text-white py-12 px-6 lg:px-20 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-10">{t("title")}</h1>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-600 rounded text-white font-semibold">
          {errorMsg}
        </div>
      )}

      <ul className="space-y-6">
        {displayed.map((m) => (
          <MovieCard
            key={m.id}
            movie={m}
            user={user as User}
            onRemove={handleRemove}
          />
        ))}
      </ul>

      {visibleCount < movies.length && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() =>
              setVisibleCount((prev) => Math.min(prev + 5, movies.length))
            }
            className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-600 transition"
          >
            {t("seeMore")}
          </button>
        </div>
      )}
    </section>
  );
}
