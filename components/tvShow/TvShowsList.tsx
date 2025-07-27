"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { getAllTvShows } from "@/lib/tmdbCallsTvShow/getAllTvShows";
import { TvShow } from "@/constants/types/TvShow";
import Card from "../Card";

interface TvShowsListProps {
  locale: string;
}

export default function TvShowsList({ locale }: TvShowsListProps) {
  const t = useTranslations("tvShowsPage");

  const [tvShows, setTvShows] = useState<TvShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchTvShows = useCallback(
    async (pageToFetch: number) => {
      try {
        pageToFetch === 1 ? setIsLoading(true) : setIsFetchingMore(true);
        setError(null);

        const { results, total_pages } = await getAllTvShows(
          pageToFetch,
          locale
        );

        setTvShows((prev) =>
          pageToFetch === 1
            ? results
            : [
                ...prev,
                ...results.filter(
                  (tv: TvShow) => !prev.some((p) => p.id === tv.id)
                ),
              ]
        );

        setTotalPages(total_pages);
        setCurrentPage(pageToFetch);
      } catch (err: any) {
        console.error("Failed to fetch TV shows:", err);
        setError(t("fetchError"));
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    },
    [locale, t]
  );

  useEffect(() => {
    fetchTvShows(1);
  }, [locale, t, fetchTvShows]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-center text-white text-xl flex items-center justify-center">
        {t("loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-center text-red-500 text-xl flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {tvShows.length > 0 ? (
            tvShows.map((tvShow: TvShow) => (
              <Card
                key={tvShow.id}
                data={tvShow}
                isExpanded={tvShow.id === expandedCardId}
                onClick={(id) =>
                  setExpandedCardId((prev) => (prev === id ? null : id))
                }
                onHover={(id) => {
                  if (expandedCardId !== null && expandedCardId !== id) {
                    setExpandedCardId(null);
                  }
                }}
                type={"tvShow"}
              />
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-full">
              {t("noTvShowsFound")}
            </p>
          )}
        </div>

        {currentPage < totalPages && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => fetchTvShows(currentPage + 1)}
              disabled={isFetchingMore}
              className="px-6 py-3 bg-[#FFAC00] text-black font-semibold rounded-md hover:bg-[#CC8A00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFetchingMore ? t("loading") : t("seeMore")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
