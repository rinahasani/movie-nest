import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import convertImageUrl from "@/lib/utils/imageUrlHelper";
import { Result as Movie } from "@/constants/types/Movie";
import { searchMovies } from "@/lib/tmdbCalls/searchMovies";
import { ERROR_MESSAGES } from "@/constants/strings"
import { handleAddFavorite, handleRemoveFavorite } from "@/lib/handlers/favoritesHandler";

interface SearchBarProps {
  locale: string;
  user: any;
  favoriteIds: number[];
  setFavoriteIds: React.Dispatch<React.SetStateAction<number[]>>;
  signOut: () => Promise<void>;
  router: any;
  pathname: string;
  setMobileSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mobileSearchOpen: boolean;
  desktopSearchOpen: boolean;
  setDesktopSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  t: any;
  mobile?: boolean;
}

function SearchIconButton({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label="Search"
      className={`text-white hover:text-yellow-400 transition-colors ${className}`}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
        />
      </svg>
    </button>
  );
}

const SearchBar: React.FC<SearchBarProps> = ({
  locale,
  user,
  favoriteIds,
  setFavoriteIds,
  signOut,
  router,
  pathname,
  setMobileSearchOpen,
  mobileSearchOpen,
  desktopSearchOpen,
  setDesktopSearchOpen,
  t,
  mobile = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const [, forceUpdate] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.length > 3) {
      setLoadingSearch(true);
      const fetchResults = async () => {
        const data = await searchMovies(searchQuery, locale);
        setSearchResults(data);
        setLoadingSearch(false);
      };
      const debounce = setTimeout(() => {
        fetchResults();
      }, 300);
      return () => clearTimeout(debounce);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, locale]);

  const handleFavoriteClick = async (movie: Movie) => {
    if (!user) return;
    setFavoriteError(null);
    const isFav = favoriteIds.includes(movie.id);
    if (isFav) {
      setFavoriteIds((curr) => curr.filter((id) => id !== movie.id));
      forceUpdate((n) => n + 1);
      try {
        await handleRemoveFavorite(movie.id, user, undefined, setFavoriteError, ERROR_MESSAGES);
      } catch (e) {
        setFavoriteError("Unknown error");
        setFavoriteIds((curr) => [...curr, movie.id]);
        forceUpdate((n) => n + 1);
      }
    } else {
      setFavoriteIds((curr) => [...curr, movie.id]);
      forceUpdate((n) => n + 1);
      try {
        await handleAddFavorite({ id: movie.id, title: movie.title }, user, undefined, setFavoriteError, ERROR_MESSAGES);
      } catch (e) {
        setFavoriteError("Unknown error");
        setFavoriteIds((curr) => curr.filter((id) => id !== movie.id));
        forceUpdate((n) => n + 1);
      }
    }
    // Re-fetch search results to update favorite icons
    if (searchQuery.length > 3) {
      setLoadingSearch(true);
      const data = await searchMovies(searchQuery, locale);
      setSearchResults(data);
      setLoadingSearch(false);
    }
  };

  // Handler for favorite button click (used in both mobile and desktop)
  const handleFavoriteButtonClick = async (e: React.MouseEvent, movie: Movie) => {
    e.stopPropagation();
    try {
      await handleFavoriteClick(movie);
    } catch (err) {
      console.error('Error handling favorite click:', err);
    }
  };

  if (mobile) {
    return (
      <div className="w-full flex items-center md:hidden">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full p-2 pl-10 bg-black text-white border border-gray-700 rounded-md focus:outline-none focus:border-yellow-500"
            autoFocus
          />
          {searchQuery.length > 2 && (
            <div className="absolute top-14 left-0 w-full bg-black/80 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg z-50">
              {loadingSearch ? (
                <p className="text-white p-4">Loading...</p>
              ) : (
                <ul className="max-h-96 overflow-y-auto p-2 search-results-scrollbar w-full">
                  {searchResults.length > 0 ? (
                    searchResults.map((movie) => {
                      const isFav = favoriteIds.includes(movie.id);
                      return (
                        <li
                          key={movie.id}
                          className="flex items-center p-2 rounded-md hover:bg-gray-800 cursor-pointer"
                          onClick={(e) => {
                            if ((e.target as HTMLElement).closest('.fav-btn')) return;
                            router.push(`/${locale}/details/${movie.id}`);
                            setMobileSearchOpen(false);
                            setSearchQuery("");
                          }}
                        >
                          {movie.poster_path ? (
                            <Image
                              src={convertImageUrl(movie.poster_path)}
                              alt={movie.title}
                              width={40}
                              height={60}
                              className="mr-3 rounded"
                            />
                          ) : (
                            <div className="w-10 h-[60px] mr-3 rounded bg-gray-800 flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.55 5.55a8 8 0 10-11.3 11.3M6.34 6.34l11.3 11.3"
                                />
                              </svg>
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-sm">
                              {movie.title}
                            </h3>
                            <p className="text-gray-400 text-xs">
                              {movie.release_date?.slice(0, 4)}
                            </p>
                          </div>
                          <button
                            className="fav-btn ml-2 text-yellow-400 hover:text-yellow-500 focus:outline-none"
                            onClick={(e) => handleFavoriteButtonClick(e, movie)}
                            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            {isFav ? (
                              <FaHeart className="h-5 w-5" />
                            ) : (
                              <FaRegHeart className="h-5 w-5" />
                            )}
                          </button>
                        </li>
                      );
                    })
                  ) : (
                    <p className="text-gray-400 p-4">No results found.</p>
                  )}
                </ul>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => setMobileSearchOpen(false)}
          className="ml-4 text-gray-400 hover:text-white"
          aria-label="Close search"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    );
  }

  // Desktop
  return (
    <div className="flex items-center">
      {!desktopSearchOpen ? (
        <SearchIconButton
          onClick={() => {
            setDesktopSearchOpen(true);
            setTimeout(() => {
              searchInputRef.current?.focus();
            }, 100);
          }}
        />
      ) : (
        <div ref={searchRef} className="flex items-center w-[280px] transition-all">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full p-2 pl-10 pr-10 bg-black text-white border border-gray-700 rounded-md focus:outline-none focus:border-yellow-500"
              autoFocus
            />
            {/* X Button for clearing/closing */}
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
              aria-label={searchQuery ? 'Clear search' : 'Close search'}
              onClick={() => {
                if (searchQuery) {
                  setSearchQuery("");
                  searchInputRef.current?.focus();
                } else {
                  setDesktopSearchOpen(false);
                }
              }}
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          {searchQuery.length > 2 && (
            <div className="absolute left-0 top-12 w-full bg-black/80 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
              {loadingSearch ? (
                <p className="text-white p-4">Loading...</p>
              ) : (
                <ul className="max-h-96 overflow-y-auto p-2 search-results-scrollbar w-full">
                  {searchResults.length > 0 ? (
                    searchResults.map((movie) => {
                      const isFav = favoriteIds.includes(movie.id);
                      return (
                        <li
                          key={movie.id}
                          className="flex items-center p-2 rounded-md hover:bg-gray-800 cursor-pointer group"
                          onClick={(e) => {
                            if ((e.target as HTMLElement).closest('.fav-btn')) return;
                            router.push(`/${locale}/details/${movie.id}`);
                            setSearchQuery("");
                            setDesktopSearchOpen(false);
                          }}
                        >
                          {movie.poster_path ? (
                            <Image
                              src={convertImageUrl(movie.poster_path)}
                              alt={movie.title}
                              width={40}
                              height={60}
                              className="mr-3 rounded"
                            />
                          ) : (
                            <div className="w-10 h-[60px] mr-3 rounded bg-gray-800 flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.55 5.55a8 8 0 10-11.3 11.3M6.34 6.34l11.3 11.3"
                                />
                              </svg>
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-sm">
                              {movie.title}
                            </h3>
                            <p className="text-gray-400 text-xs">
                              {movie.release_date?.slice(0, 4)}
                            </p>
                          </div>
                          <button
                            className="fav-btn ml-2 text-yellow-400 hover:text-yellow-500 focus:outline-none"
                            onClick={(e) => handleFavoriteButtonClick(e, movie)}
                            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            {isFav ? (
                              <FaHeart className="h-5 w-5" />
                            ) : (
                              <FaRegHeart className="h-5 w-5" />
                            )}
                          </button>
                        </li>
                      );
                    })
                  ) : (
                    <p className="text-gray-400 p-4">No results found.</p>
                  )}
                </ul>
              )}
              {favoriteError && <p className="text-red-500 p-2 text-xs">{favoriteError}</p>}
            </div>
          )}
        </div>
      )}
    </div>
 );
};

export default SearchBar; 