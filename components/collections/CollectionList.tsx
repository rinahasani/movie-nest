/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import { MovieCollections } from "@/constants/movieCollections";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import CollectionCard from "./CollectionCard";

export interface MovieCollection {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  name: string;
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
}

export default function CollectionList() {
  const t = useTranslations("collectionsPage");

  const [movieCollection, setMovieCollection] = useState<MovieCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchMovieCollections = useCallback(
    async (
      pageToFetch: number
    ): Promise<{ results: MovieCollection[]; total_pages: number }> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const startIndex = (pageToFetch - 1) * 10;
            const endIndex = startIndex + 10;
            const totalItems = MovieCollections.length;
            const total_pages = Math.ceil(totalItems / 10);

            if (pageToFetch > total_pages && totalItems > 0) {
              resolve({ results: [], total_pages: total_pages });
              return;
            }

            const results = MovieCollections.slice(startIndex, endIndex);

            resolve({ results, total_pages });
          } catch (error) {
            reject(error);
          }
        }, 500);
      });
    },
    []
  );

  const handleFetchCollections = useCallback(
    async (pageToFetch: number) => {
      try {
        pageToFetch === 1 ? setIsLoading(true) : setIsFetchingMore(true);
        setError(null);

        const { results, total_pages } = await fetchMovieCollections(
          pageToFetch
        );

        setMovieCollection((prev) =>
          pageToFetch === 1
            ? results
            : [
                ...prev,
                ...results.filter(
                  (collection: MovieCollection) =>
                    !prev.some((p: MovieCollection) => p.id === collection.id)
                ),
              ]
        );

        setTotalPages(total_pages);
        setCurrentPage(pageToFetch);
      } catch (err) {
        console.error("Failed to fetch movie collections:", err);
        setError(t("fetchError"));
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    },
    [t, fetchMovieCollections]
  );

  useEffect(() => {
    handleFetchCollections(1);
  }, [handleFetchCollections]);

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isLoading && !isFetchingMore) {
      handleFetchCollections(currentPage + 1);
    }
  };
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {movieCollection.length > 0 ? (
            movieCollection.map((movieCollection: MovieCollection) => (
              <CollectionCard
                key={movieCollection.id}
                collection={movieCollection}
                isExpanded={movieCollection.id === expandedCardId}
                onClick={(id) =>
                  setExpandedCardId((prev) => (prev === id ? null : id))
                }
                onHover={(id) => {
                  if (expandedCardId !== null && expandedCardId !== id) {
                    setExpandedCardId(null);
                  }
                }}
              />
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-full">
              {t("noCollectionsFound")}
            </p>
          )}
        </div>

        {currentPage < totalPages && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
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
