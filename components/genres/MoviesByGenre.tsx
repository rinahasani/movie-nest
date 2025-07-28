"use client";
import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getAllGenres } from "@/lib/tmdbCalls/getGenres";
import GenreCarousel from "./GenreCarousel";
import { GenreList } from "@/constants/types/GenreList";
import Spinner from "../auth/Spinner";

export default function MoviesByGenre() {
  const [genres, setGenres] = useState<GenreList[] | null>(null);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const fetchedGenres = await getAllGenres(locale);
        setGenres(fetchedGenres);
      } catch (error) {
        console.error("Failed to fetch genres: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  },[]);
  const SLIDE_COUNT = genres ? genres.length : 0;
  const slides = Array.from({ length: SLIDE_COUNT }, (_, i) => i);
  const OPTIONS = { loop: true };
  const hasGenres = genres && genres.length > 0;
  const t = useTranslations("movieGenres");

  return (
    <main className="bg-black mt-6 mb-8">
      <h1 className="text-3xl md:text-2xl font-extrabold leading-tight drop-shadow-lg m-6">
        {t("title")}
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size={50} />
        </div>
      ) : hasGenres ? (
        <GenreCarousel slides={slides} options={OPTIONS} genres={genres} />
      ) : (
        <p>{t("noGenres")}</p>
      )}
    </main>
  );
}
