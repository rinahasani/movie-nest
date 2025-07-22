"use client";

import React, { useEffect, useState } from "react";
import { Season } from "@/constants/types/Season";
import { Episode } from "@/constants/types/Season";
import { getTvSeasonDetails } from "@/lib/tmdbCallsTvShow/getTvSeasonDetails";
import { useLocale } from "next-intl";
import EpisodeCard from "./EpisodeCard";

interface SeasonEpisodesListProps {
  tvId: number;
  season: Season;
}

const EPISODES_PER_PAGE = 10;

const SeasonEpisodesList: React.FC<SeasonEpisodesListProps> = ({
  tvId,
  season,
}) => {
  const locale = useLocale();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleEpisodesCount, setVisibleEpisodesCount] =
    useState(EPISODES_PER_PAGE);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const seasonDetails = await getTvSeasonDetails(
          tvId,
          season.season_number,
          locale
        );
        setEpisodes(seasonDetails.episodes || []);
        setVisibleEpisodesCount(EPISODES_PER_PAGE);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEpisodes();
  }, [tvId, season.season_number, locale]);

  const handleShowMore = () => {
    setVisibleEpisodesCount((prevCount) => prevCount + EPISODES_PER_PAGE);
  };

  const episodesToDisplay = episodes.slice(0, visibleEpisodesCount);
  const hasMoreEpisodes = episodes.length > visibleEpisodesCount;

  return (
    <div className="rounded-lg p-4 mb-4 bg-[#121110]">
      {isLoading && <p className="text-gray-400">Loading episodes...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!isLoading && !error && episodes.length === 0 && (
        <p className="text-gray-400">No episodes found for this season.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {episodesToDisplay.map((episode) => (
          <EpisodeCard key={episode.id} episode={episode} />
        ))}
      </div>

      {hasMoreEpisodes && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleShowMore}
            className="px-6 py-3 bg-[#FFAC00] text-black font-semibold rounded-md hover:bg-[#CC8A00] transition-colors"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default SeasonEpisodesList;
