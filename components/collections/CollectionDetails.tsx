"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import convertImageUrl from "@/lib/utils/imageUrlHelper";
import convertOriginalImageUrl from "@/lib/utils/convertOriginalImage";
import { Collection } from "@/constants/types/Collection";
import { getCollections } from "@/lib/tmdbCalls/getCollections";
import CollectionMovies from "./CollectionMovies";
import Spinner from "../auth/Spinner";

interface CollectionDetailsProps {
  id: string;
  locale: string;
}

export default function CollectionDetails({
  id,
  locale,
}: CollectionDetailsProps) {
  const t = useTranslations("collectionsDetailsPage");
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true);
        const data = await getCollections(id, locale);
        setCollection(data);
      } catch (err) {
        console.error("Failed to fetch TV show details:", err);
        setError(t("fetchError"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchCollections();
  }, [id, locale, t]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size={50} />
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

  if (!collection) {
    return (
      <div className="min-h-screen bg-black text-center text-white text-xl flex items-center justify-center">
        {t("fetchError")}
      </div>
    );
  }
  const backdropUrl = convertOriginalImageUrl(collection.backdrop_path);
  const posterUrl = convertImageUrl(collection.poster_path);

  return (
    <div className="relative text-white min-h-screen bg-black">
      {backdropUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backdropUrl}
            alt="collection"
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90" />
        </div>
      )}

      <div className="relative z-10 container mx-auto p-8 py-12">
        <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-l from-black/30 to-black/80 p-6 rounded-lg shadow-xl">
          <div className="flex-shrink-0">
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt="collection"
                width={300}
                height={450}
                className="rounded-lg shadow-lg"
                priority
              />
            ) : (
              <div className="w-[300px] h-[450px] bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-lg">
                No Poster
              </div>
            )}
          </div>
          <div className="flex-grow">
            <h1 className="text-5xl font-extrabold mb-4">{collection.name}</h1>
            <p className="text-lg mb-4 text-gray-300">{collection.overview}</p>
            <div className="text-xl mb-2 text-gray-200">
              <span className="font-semibold">{t("numberOfMovies")}:</span>{" "}
              {collection?.parts.length || "N/A"}
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 bg-black py-8">
        <div className="container mx-auto p-8 pt-0">
          <hr className="my-8 border-gray-700" />
          <h2 className="text-3xl font-bold mb-6">{t("movies")}</h2>
          {collection.parts && collection.parts.length > 0 ? (
            <CollectionMovies parts={collection.parts} />
          ) : (
            <p className="text-gray-400">{t("noMovies")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
