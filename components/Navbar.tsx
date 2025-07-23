"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Blockies from "react-blockies";
import { useAuth } from "@/app/contexts/AuthContext";
import { Result as Movie } from "@/constants/types/Movie";
import convertImageUrl from "@/lib/utils/imageUrlHelper";

export default function Navbar() {
  const t = useTranslations("navbar");

  const { locale } = useParams() as { locale?: string };
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const avatarMenuRef = useRef<HTMLDivElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchQuery("");
      }
      if (
        avatarMenuRef.current &&
        !avatarMenuRef.current.contains(event.target as Node) &&
        avatarButtonRef.current &&
        !avatarButtonRef.current.contains(event.target as Node)
      ) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      setLoadingSearch(true);
      const fetchResults = async () => {
        const response = await fetch(
          `/api/search?query=${searchQuery}&locale=${locale}`
        );
        const data = await response.json();
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

  if (!locale) return null;

  // Build your navLinks with the locale prefiximport { useAuth } from "@/app/contexts/AuthContext";

  const navLinks = [
    { name: t("home"), href: `/${locale}` },
    { name: t("movies"), href: `/${locale}/movies` },
    { name: t("tvShows"), href: `/${locale}/tv-shows` },
    { name: t("myFavorite"), href: `/${locale}/favoriteMovies` },
    { name: t("about"), href: `/${locale}/about` },
  ];

  const allowedPaths = navLinks.map((l) => l.href);

  const normalizedPathname =
    pathname.endsWith("/") && pathname !== "/"
      ? pathname.slice(0, -1)
      : pathname;

  const isAuthPage =
    normalizedPathname === `/${locale}/login` ||
    normalizedPathname === `/${locale}/signup` ||
    normalizedPathname === `/${locale}/reset-password`;

  if (isAuthPage) return null;

  // Login button
  function LoginButton({ className = "" }: { className?: string }) {
    return (
      <Link
        href={`/${locale}/login`}
        className={`text-base uppercase tracking-wider px-6 py-2.5 rounded bg-yellow-500 text-white font-medium hover:bg-yellow-400 transition-colors ${className}`}
      >
        {t("login")}
      </Link>
    );
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

  return (
    <nav className="bg-black w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Standard Navbar Layout */}
          {!mobileSearchOpen && (
            <>
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link href={`/${locale}`}>
                  <div className="flex items-center cursor-pointer">
                    <Image
                      src="/images/logo.png"
                      alt="Movie Logo"
                      width={80}
                      height={80}
                      priority
                      className="mr-2"
                    />
                  </div>
                </Link>
              </div>

              {/* Nav Links (Desktop) */}
              <div className="hidden md:flex flex-1 justify-center">
                <div className="flex items-center space-x-8">
                  {navLinks
                    .filter((link) => link.name !== "My Favorite" || user)
                    .map((link) => (
                      <Link key={link.name} href={link.href}>
                        <span
                          className={`text-base uppercase tracking-wider font-medium px-3 py-2 cursor-pointer transition-colors ${
                            pathname === link.href
                              ? "text-white border-b-2 border-yellow-500"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          {link.name}
                        </span>
                      </Link>
                    ))}
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-4">
                <div ref={searchRef} className="relative">
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
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-64 p-2 pl-10 bg-black text-white border border-gray-700 rounded-md focus:outline-none focus:border-yellow-500"
                  />
                  {searchQuery.length > 2 && (
                    <div className="absolute top-14 left-0 w-full bg-black/80 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
                      {loadingSearch ? (
                        <p className="text-white p-4">Loading...</p>
                      ) : (
                        <ul className="max-h-96 overflow-y-auto p-2 search-results-scrollbar">
                          {searchResults.length > 0 ? (
                            searchResults.map((movie) => (
                              <li
                                key={movie.id}
                                className="flex items-center p-2 rounded-md hover:bg-gray-800 cursor-pointer"
                                onClick={() => {
                                  router.push(`/${locale}/details/${movie.id}`);
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
                                <div>
                                  <h3 className="text-white font-bold text-sm">
                                    {movie.title}
                                  </h3>
                                  <p className="text-gray-400 text-xs">
                                    {movie.release_date?.slice(0, 4)}
                                  </p>
                                </div>
                              </li>
                            ))
                          ) : (
                            <p className="text-gray-400 p-4">No results found.</p>
                          )}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
                {user ? (
                  <div className="relative">
                    <button
                      ref={avatarButtonRef}
                      className="flex items-center focus:outline-none"
                      onClick={() => setAvatarMenuOpen((open) => !open)}
                      aria-label="User menu"
                    >
                      <Blockies
                        seed={user.email || user.uid}
                        size={10}
                        scale={4}
                        className="rounded-full border-2 border-yellow-400 bg-black"
                      />
                    </button>
                    {avatarMenuOpen && (
                      <div
                        ref={avatarMenuRef}
                        className="absolute right-0 mt-2 w-40 bg-black border border-gray-800 rounded-lg shadow-lg z-50"
                      >
                        <button
                          className="w-full text-left px-4 py-2 text-white hover:bg-yellow-400 hover:text-black rounded-lg transition-colors"
                          onClick={async () => {
                            setAvatarMenuOpen(false);
                            await signOut();
                            router.push("/");
                          }}
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <LoginButton />
                )}
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center md:hidden">
                <SearchIconButton onClick={() => setMobileSearchOpen(true)} />
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Toggle menu"
                  className="text-gray-200 hover:text-yellow-500 focus:outline-none ml-2"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        mobileOpen
                          ? "M6 18L18 6M6 6l12 12"
                          : "M4 6h16M4 12h16M4 18h16"
                      }
                    />
                  </svg>
                </button>
              </div>
            </>
          )}

          {/* Mobile Search View */}
          {mobileSearchOpen && (
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
                      <ul className="max-h-96 overflow-y-auto p-2 search-results-scrollbar">
                        {searchResults.length > 0 ? (
                          searchResults.map((movie) => (
                            <li
                              key={movie.id}
                              className="flex items-center p-2 rounded-md hover:bg-gray-800 cursor-pointer"
                              onClick={() => {
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
                              <div>
                                <h3 className="text-white font-bold text-sm">
                                  {movie.title}
                                </h3>
                                <p className="text-gray-400 text-xs">
                                  {movie.release_date?.slice(0, 4)}
                                </p>
                              </div>
                            </li>
                          ))
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
          )}
        </div>
      </div>

      {/* Mobile Menu (unchanged) */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center space-y-6 md:hidden">
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-6 right-6 text-white text-3xl focus:outline-none"
            aria-label="Close menu"
          >
            &times;
          </button>

          {user && (
            <div className="flex flex-col items-center mb-4">
              <Blockies
                seed={user.email || user.uid}
                size={10}
                scale={4}
                className="rounded-full border-2 border-yellow-400 bg-black"
              />
            </div>
          )}

          {/* Nav links */}
          {navLinks
            .filter((link) => link.name !== "My Favorite" || user)
            .map((link) => (
              <Link key={link.name} href={link.href}>
                <span
                  className={`text-2xl uppercase tracking-wider font-light cursor-pointer transition-colors ${
                    pathname === link.href
                      ? "text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </span>
              </Link>
            ))}

          {user ? (
            <button
              className="text-base uppercase tracking-wider px-6 py-2.5 rounded bg-yellow-500 text-white font-medium hover:bg-yellow-400 transition-colors mt-6"
              onClick={signOut}
            >
              Sign Out
            </button>
          ) : (
            <div className="mt-6">
              <LoginButton />
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
