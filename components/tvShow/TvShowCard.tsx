"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TvShow } from "@/constants/types/TvShow";
import { useLocale } from "next-intl";
import { FaStar, FaRegStar } from "react-icons/fa";
import convertImageUrl from "@/lib/utils/imageUrlHelper";

interface TvShowCardProps {
  tvShow: TvShow;
  isExpanded: boolean;
  onClick: (id: number) => void;
  onHover: (id: number | null) => void;
}

const TvShowCard: React.FC<TvShowCardProps> = ({
  tvShow,
  isExpanded,
  onClick,
  onHover,
}) => {
  const locale = useLocale();
  const [isHovered, setIsHovered] = useState(false);
  const filledStars = Math.round(tvShow.vote_average / 2);

  const mainButtonColor = "bg-[#FFAC00]";
  const hoverButtonColor = "hover:bg-[#CC8A00]";

  const posterUrl = convertImageUrl(tvShow.poster_path || tvShow.backdrop_path);

  const cardScaleClass =
    isExpanded || isHovered ? "scale-105 z-20" : "scale-100 z-10";
  const cardTransitionClass =
    "transition-transform duration-300 ease-in-out transform";

  return (
    <div
      className={`relative rounded-lg shadow-lg overflow-hidden cursor-pointer ${cardScaleClass} ${cardTransitionClass} flex-shrink-0 w-full`}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover(tvShow.id);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHover(null);
      }}
      onClick={() => onClick(tvShow.id)}
    >
      <div className="relative w-full aspect-[2/3] bg-gray-900">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={tvShow.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover"
            priority={isHovered || isExpanded}
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex flex-col items-center justify-center p-2 text-gray-200 text-lg font-bold text-center">
            <h3 className="text-xl leading-tight">{tvShow.name}</h3>
          </div>
        )}

        {(isHovered || isExpanded) && (
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-end p-3 transition-opacity duration-300 ease-in-out">
            <h3 className="text-base font-bold text-white mb-1">
              {tvShow.name}
            </h3>
            <div className="flex items-center mb-1">
              {[1, 2, 3, 4, 5].map((i) =>
                i <= filledStars ? (
                  <FaStar key={i} className="mr-0.5 text-yellow-400 text-xs" />
                ) : (
                  <FaRegStar
                    key={i}
                    className="mr-0.5 text-yellow-400 text-xs"
                  />
                )
              )}
              <span className="ml-0.5 text-xs text-gray-300">
                {tvShow.vote_average.toFixed(1)}
              </span>
            </div>
            <p className="text-gray-400 text-xs line-clamp-3 mb-2">
              {tvShow.overview}
            </p>
            <Link
              href={`/${locale}/tv-shows/${tvShow.id}`}
              className={`px-3 py-1.5 ${mainButtonColor} text-black font-semibold rounded-md ${hoverButtonColor} transition-colors text-center text-sm mb-2`}
              onClick={(e) => e.stopPropagation()}
            >
              View Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TvShowCard;
