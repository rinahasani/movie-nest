"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import SeasonEpisodesList from "@/components/tvShow/SeasonEpisodesList";
import { getTvShowDetails } from "@/lib/tmdbCallsTvShow/getTvShowDetails";
import convertImageUrl from "@/lib/utils/imageUrlHelper";
import convertOriginalImageUrl from "@/lib/utils/convertOriginalImage";
import { TvShow } from "@/constants/types/TvShow";
import { Season } from "@/constants/types/Season";

interface TvShowDetailsProps {
  id: string;
  locale: string;
}

export default function TvShowDetails({ id, locale }: TvShowDetailsProps) {
  const t = useTranslations("tvShowDetailsPage");
  const [tvShow, setTvShow] = useState<TvShow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);

  useEffect(() => {
    const fetchTvShow = async () => {
      try {
        setIsLoading(true);
        const tvShowId = parseInt(id, 10);
        const fetched = await getTvShowDetails(tvShowId, locale);
        setTvShow(fetched);
        const firstValid = fetched.seasons?.find(
          (s: Season) => s.season_number !== 0
        );
        setSelectedSeason(firstValid || null);
      } catch (err) {
        console.error("Failed to fetch TV show details:", err);
        setError(t("fetchError"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchTvShow();
  }, [id, locale, t]);

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

  if (!tvShow) {
    return (
      <div className="min-h-screen bg-black text-center text-white text-xl flex items-center justify-center">
        {t("notFound")}
      </div>
    );
  }

  const backdropUrl = convertOriginalImageUrl(tvShow.backdrop_path);
  const posterUrl = convertImageUrl(tvShow.poster_path);

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const num = parseInt(e.target.value, 10);
    const season = tvShow.seasons?.find((s: Season) => s.season_number === num);
    setSelectedSeason(season || null);
  };

  return (
    <div className="relative text-white min-h-screen bg-black">
      {backdropUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backdropUrl}
            alt={tvShow.name}
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
                alt={tvShow.name}
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
            <h1 className="text-5xl font-extrabold mb-4">{tvShow.name}</h1>
            <p className="text-lg mb-4 text-gray-300">{tvShow.overview}</p>
            <div className="text-xl mb-2 text-gray-200">
              <span className="font-semibold">{t("firstAirDate")}:</span>{" "}
              {new Date(tvShow.first_air_date).toLocaleDateString(locale)}
            </div>
            <div className="text-xl mb-2 text-gray-200">
              <span className="font-semibold">{t("rating")}:</span>{" "}
              {tvShow.vote_average?.toFixed(1) || "N/A"} / 10
            </div>
            <div className="text-xl mb-2 text-gray-200">
              <span className="font-semibold">{t("numberOfSeasons")}:</span>{" "}
              {tvShow.number_of_seasons || "N/A"}
            </div>
            <div className="text-xl mb-4 text-gray-200">
              <span className="font-semibold">{t("numberOfEpisodes")}:</span>{" "}
              {tvShow.number_of_episodes || "N/A"}
            </div>

            {tvShow.seasons?.length > 0 && (
              <div className="mb-4">
                <label
                  htmlFor="season-select"
                  className="block text-xl font-semibold text-gray-200 mb-2"
                >
                  {t("selectSeason")}:
                </label>
                <select
                  id="season-select"
                  value={selectedSeason?.season_number || ""}
                  onChange={handleSeasonChange}
                  className="block w-full md:w-1/2 p-2 rounded-md bg-gray-700/80 text-white border border-gray-600/70 focus:outline-none focus:ring focus:border-blue-300"
                >
                  {tvShow.seasons
                    .filter((s: Season) => s.season_number !== 0)
                    .sort((a, b) => a.season_number - b.season_number)
                    .map((season: Season) => (
                      <option key={season.id} value={season.season_number}>
                        {season.name} – {season.episode_count || 0}{" "}
                        {t("episodes")}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-black py-8">
        <div className="container mx-auto p-8 pt-0">
          <hr className="my-8 border-gray-700" />
          <h2 className="text-3xl font-bold mb-6">{t("episodes")}</h2>
          {selectedSeason ? (
            <SeasonEpisodesList tvId={tvShow.id} season={selectedSeason} />
          ) : (
            <p className="text-gray-400">{t("noSeasons")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
