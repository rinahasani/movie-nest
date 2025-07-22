"use client";

import React from "react";
import Image from "next/image";
import convertImageUrl from "@/lib/utils/imageUrlHelper";
import { Episode } from "@/constants/types/Season";

interface EpisodeCardProps {
  episode: Episode;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode }) => {
  const imageUrl = convertImageUrl(episode.still_path);

  return (
    <div className="flex bg-[#302f2e] rounded-lg shadow-md p-3 items-start">
      <div className="flex-shrink-0 mr-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={episode.name}
            width={120}
            height={67}
            className="rounded-md"
            priority
          />
        ) : (
          <div className="w-[120px] h-[67px] bg-gray-600 rounded-md flex items-center justify-center text-gray-400 text-xs text-center">
            No Image Available
          </div>
        )}
      </div>
      <div className="flex-grow">
        <h4 className="text-md font-semibold text-white">
          S{episode.season_number}E{episode.episode_number}: {episode.name}
        </h4>
        <p className="text-gray-300 text-sm line-clamp-2">{episode.overview}</p>
        <p className="text-gray-400 text-xs mt-1">
          Air Date: {new Date(episode.air_date).toLocaleDateString()} | Rating:{" "}
          {episode.vote_average.toFixed(1)}
        </p>
      </div>
    </div>
  );
};

export default EpisodeCard;
