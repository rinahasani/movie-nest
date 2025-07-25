"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import convertImageUrl from "@/lib/utils/imageUrlHelper";
import { Part } from "@/constants/types/Collection";

interface CollectionCardProps {
  collection: Part;
  isExpanded: boolean;
  onClick: (id: number) => void;
  onHover: (id: number | null) => void;
}

const CollectionMovieCard: React.FC<CollectionCardProps> = ({
  collection,
  isExpanded,
  onClick,
  onHover,
}) => {
  const locale = useLocale();
  const [isHovered, setIsHovered] = useState(false);
   const t = useTranslations("collectionsPage");

  const mainButtonColor = "bg-[#FFAC00]";
  const hoverButtonColor = "hover:bg-[#CC8A00]";

  const posterUrl = convertImageUrl(
    collection.poster_path || collection.backdrop_path
  );

  const cardScaleClass =
    isExpanded || isHovered ? "scale-105 z-20" : "scale-100 z-10";
  const cardTransitionClass =
    "transition-transform duration-300 ease-in-out transform";

  return (
    <div
      className={`relative rounded-lg shadow-lg overflow-hidden cursor-pointer ${cardScaleClass} ${cardTransitionClass} flex-shrink-0 w-full`}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover(collection.id);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHover(null);
      }}
      onClick={() => onClick(collection.id)}
    >
      <div className="relative w-full aspect-[2/3] bg-gray-900">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={collection.original_title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover"
            priority={isHovered || isExpanded}
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex flex-col items-center justify-center p-2 text-gray-200 text-lg font-bold text-center">
            <h3 className="text-xl leading-tight">{collection.original_title}</h3>
          </div>
        )}

        {(isHovered || isExpanded) && (
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-end p-3 transition-opacity duration-300 ease-in-out">
            <h3 className="text-base font-bold text-white mb-1">
              {collection.original_title}
            </h3>
            <p className="text-gray-400 text-xs line-clamp-3 mb-2">
              {collection.overview}
            </p>
            <Link
              href={`/${locale}/details/${collection.id}`}
              className={`px-3 py-1.5 ${mainButtonColor} text-black font-semibold rounded-md ${hoverButtonColor} transition-colors text-center text-sm mb-2`}
              onClick={(e) => e.stopPropagation()}
            >
                {t("viewDetails")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionMovieCard;
