"use client";
import { MovieHeroProps } from "@/constants/types/MovieInfo";
import convertOriginalImageUrl from "@/lib/utils/convertOriginalImage";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { handleAddFavorite, handleRemoveFavorite } from "../lib/handlers/favoritesHandler";
import { ERROR_MESSAGES } from "../constants/strings";
import { getUserFavorites } from "../lib/favoriteMovies";
import { useTranslations } from "next-intl";

const getStarIcons = (rating: number) => {
  const stars = [];
  const starValue = rating / 2; // Convert 0-10 scale to 0-5
  for (let i = 0; i < 5; i++) {
    if (starValue >= i + 1) {
      // Full star
      stars.push(
        <svg
          key={i}
          className="w-5 h-5 inline text-yellow-400"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth={1}
          viewBox="0 0 24 24"
        >
          <polygon
            stroke="currentColor"
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          />
        </svg>
      );
    } else if (starValue > i && starValue < i + 1) {
      stars.push(
        <svg
          key={i}
          className="w-5 h-5 inline text-yellow-400"
          viewBox="0 0 24 24"
        >
          <defs>
            <linearGradient
              id={`half-gradient-${i}`}
              x1="0"
              x2="1"
              y1="0"
              y2="0"
            >
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <polygon
            stroke="currentColor"
            fill={`url(#half-gradient-${i})`}
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          />
        </svg>
      );
    } else {
      stars.push(
        <svg
          key={i}
          className="w-5 h-5 inline text-yellow-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          viewBox="0 0 24 24"
        >
          <polygon
            stroke="currentColor"
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          />
        </svg>
      );
    }
  }
  return stars;
};

const MovieHero: React.FC<MovieHeroProps> = ({
  id,
  title,
  vote_average,
  release_date,
  overview,
  backdrop_path,
  homepage,
  moreInfo,
}) => {
  const t = useTranslations();

  const router = useRouter();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");

  // Check if this movie is in user's favorites
  useEffect(() => {
    async function checkFavorite() {
      if (!user) {
        setIsFavorite(false);
        return;
      }
      const favs = await getUserFavorites();
      setIsFavorite(favs.some((m) => m.id === id));
    }
    checkFavorite();
  }, [user, id]);

  const handleTrailerClick = () => {
    window.open(homepage, "_blank");
  };
  const handleInfoClick = () => {
    router.push(`/pages/details/${id}}`);
  };
  const handleFavoriteClick = async () => {
    if (!user) return;
    if (isFavorite) {
      await handleRemoveFavorite(id, user, undefined, setErrorMsg, ERROR_MESSAGES);
      setIsFavorite(false);
      setPopupMsg("Removed from favorites!");
      setShowPopup(true);
    } else {
      await handleAddFavorite({ id, title }, user, undefined, setErrorMsg, ERROR_MESSAGES);
      setIsFavorite(true);
      setPopupMsg("Added to favorites!");
      setShowPopup(true);
    }
  };

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <section
      className="relative w-full min-h-[60vh] flex items-center justify-start bg-black text-white overflow-hidden"
      style={{
        backgroundImage: `url(${convertOriginalImageUrl(backdrop_path)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10" />
      <div className="relative z-20 max-w-4xl px-8 py-16 flex flex-col gap-6">
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
          {title}
        </h1>
        <div className="flex items-center gap-4 text-lg font-semibold">
          <span>{getStarIcons(vote_average)}</span>
          <span className="ml-2 text-yellow-400">
            {vote_average?.toFixed(1)}
          </span>
          <span className="ml-2 text-white/80">{release_date}</span>
        </div>
        <p className="max-w-2xl text-white/90 text-base md:text-lg line-clamp-4">
          {overview}
        </p>
        <div className="flex gap-4 mt-4 items-center">
          {homepage && (
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg text-base transition-colors shadow-lg"
              onClick={handleTrailerClick}
            >
              {t("movieHero.playTrailerButton")}
            </button>
          )}
          {moreInfo && (
            <button
              className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold py-3 px-8 rounded-lg text-base transition-colors shadow-lg"
              onClick={handleInfoClick}
            >
              {t("movieHero.moreInfoButton")}
            </button>
          )}
          {user && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="50px"
              width="50px"
              viewBox="0 -960 960 960"
              className={`ml-2 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-0 ${isFavorite ? "text-red-500" : "text-yellow-400 hover:text-yellow-300"
                }`}
              onClick={handleFavoriteClick}
              tabIndex={0}
              aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              style={{ filter: "drop-shadow(0 0 2px #000)" }}
              fill="currentColor"
            >
              <title>{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</title>
              <path
                d="M480-388q51-47 82.5-77.5T611-518q17-22 23-38.5t6-35.5q0-36-26-62t-62-26q-21 0-40.5 8.5T480-648q-12-15-31-23.5t-41-8.5q-36 0-62 26t-26 62q0 19 5.5 35t22.5 38q17 22 48 52.5t84 78.5ZM200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>

          )}
        </div>
      </div>
      {/* Popup for added/removed from favorites */}
      {showPopup && (
        <div className="fixed left-1/2 bottom-8 transform -translate-x-1/2 z-50 px-6 py-3 bg-yellow-400 text-black font-bold rounded-full shadow-lg animate-jump-in">
          {popupMsg}
        </div>
      )}
    </section >
  );
};

export default MovieHero;
