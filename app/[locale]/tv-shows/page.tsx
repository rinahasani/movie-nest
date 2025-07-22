"use client";

import { useEffect, useState, useCallback } from "react";

import { useTranslations } from "next-intl";

import { getAllTvShows } from "@/lib/tmdbCallsTvShow/getAllTvShows";

import TvShowCard from "@/components/tvShow/TvShowCard";

import { TvShow } from "@/constants/types/TvShow";

interface TvShowsPageProps {
  params: {
    locale: string;
  };
}

export default function TvShowsPage({
  // @ts-ignore

  params: { locale },
}: TvShowsPageProps) {
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
        if (pageToFetch === 1) {
          setIsLoading(true);
        } else {
          setIsFetchingMore(true);
        }

        setError(null);

        const { results, total_pages } = await getAllTvShows(
          pageToFetch,

          locale
        );

        setTvShows((prevTvShows) => {
          if (pageToFetch === 1) {
            return results;
          } else {
            const existingIds = new Set(prevTvShows.map((tv) => tv.id));

            const uniqueNewResults = results.filter(
              (tv: TvShow) => !existingIds.has(tv.id)
            );

            return [...prevTvShows, ...uniqueNewResults];
          }
        });

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
    fetchTvShows(currentPage);
  }, [locale, t, fetchTvShows]);

  const handleCardClick = (id: number) => {
    setExpandedCardId(id === expandedCardId ? null : id);
  };

  const handleCardHover = (id: number | null) => {
    if (expandedCardId !== null && expandedCardId !== id) {
      setExpandedCardId(null);
    }
  };

  const handleSeeMore = () => {
    if (currentPage < totalPages && !isFetchingMore) {
      fetchTvShows(currentPage + 1);
    }
  };

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
              <TvShowCard
                key={tvShow.id}
                tvShow={tvShow}
                isExpanded={tvShow.id === expandedCardId}
                onClick={handleCardClick}
                onHover={handleCardHover}
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
              onClick={handleSeeMore}
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
