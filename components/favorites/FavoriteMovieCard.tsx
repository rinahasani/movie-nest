"use client";

import React from "react";
import Image from "next/image";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useTranslations } from "next-intl";
import convertImageUrl from "@/lib/utils/imageUrlHelper";
import Link from "next/link";
import { useLocale } from "next-intl";

// — Types —
export type TMDBMovie = {
  id: number;
  title: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  original_language: string;
};

export type User = {
  uid: string;
  email: string;
};

type MovieCardProps = {
  movie: TMDBMovie;
  user: User | null;
  onRemove: (id: number) => void;
};

export default function MovieCard({
  movie: m,
  user,
  onRemove,
}: MovieCardProps) {
  const t = useTranslations("favorites");
  const locale = useLocale();
  const filledStars = Math.round(m.vote_average / 2);
  const langMap: Record<string, string> = {
    en: "English",
    de: "German",
    fr: "French",
  };
  const language =
    langMap[m.original_language] || m.original_language.toUpperCase();
  const year = new Date(m.release_date).getFullYear();

  return (
    <li className="flex flex-col md:flex-row bg-[#111] rounded-2xl shadow-lg p-3">
      {/* Poster */}
      <div
        className="
    relative flex-shrink-0
    w-full aspect-[6/5] mb-4
    overflow-hidden rounded-xl shadow-2xl
    md:w-[300px] md:h-[250px] md:aspect-auto md:mb-0 md:mr-6
  "
      >
        {m.backdrop_path ? (
          <Image
            src={convertImageUrl(m.backdrop_path)}
            alt={m.title}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            priority
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center rounded-xl">
            <svg
              className="w-12 h-12 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.55 5.55a8 8 0 10-11.3 11.3M6.34 6.34l11.3 11.3"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-grow p-8">
        <h2 className="text-3xl font-extrabold text-white mb-4">{m.title}</h2>

        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((i) =>
            i <= filledStars ? (
              <FaStar key={i} className="mr-2 text-yellow-400 text-2xl" />
            ) : (
              <FaRegStar key={i} className="mr-2 text-yellow-400 text-2xl" />
            )
          )}
          <span className="ml-4 text-lg text-gray-300">
            {m.vote_average.toFixed(1)}
          </span>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <span className="text-lg text-gray-400">{year}</span>
          <span className="text-lg text-gray-400">|</span>
          <span className="text-lg text-gray-400">{language}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <Link
            href={`/${locale}/details/${m.id}`}
            className="w-full sm:w-auto px-6 py-3 bg-[#f4c10f] text-lg text-white font-semibold rounded-xl hover:bg-[#e0b609] transition text-center"
          >
            {t("moreInfo")}
          </Link>
          <button
            onClick={() => onRemove(m.id)}
            className="w-full sm:w-auto px-6 py-3 bg-[#ea1c2c] text-lg text-white font-semibold rounded-xl hover:bg-[#c41826] transition"
          >
            {t("remove")}
          </button>
        </div>
      </div>
    </li>
  );
}
