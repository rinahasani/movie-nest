"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Blockies from "react-blockies";
import { useAuth } from "@/app/contexts/AuthContext";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";
import { getUserFavorites } from "@/lib/favoriteMovies";

export default function Navbar() {
  const t = useTranslations("navbar");

  const { locale } = useParams() as { locale?: string };
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);

  const avatarMenuRef = useRef<HTMLDivElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);

  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        avatarMenuRef.current &&
        !avatarMenuRef.current.contains(event.target as Node) &&
        avatarButtonRef.current &&
        !avatarButtonRef.current.contains(event.target as Node)
      ) {
        setAvatarMenuOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDesktopSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setFavoriteIds([]);
      return;
    }
    let mounted = true;
    const fetchFavorites = async () => {
      const favs = await getUserFavorites();
      if (mounted) setFavoriteIds(favs.map((m: any) => Number(m.id)));
    };
    fetchFavorites();
    return () => { mounted = false; };
  }, [user]);

  useEffect(() => {
    if (desktopSearchOpen && user) {
      const fetchFavorites = async () => {
        const favs = await getUserFavorites();
        setFavoriteIds(favs.map((m: any) => Number(m.id)));
      };
      fetchFavorites();
    }
  }, [desktopSearchOpen, user]);

  useEffect(() => {
    if (mobileSearchOpen && user) {
      const fetchFavorites = async () => {
        const favs = await getUserFavorites();
        setFavoriteIds(favs.map((m: any) => Number(m.id)));
      };
      fetchFavorites();
    }
  }, [mobileSearchOpen, user]);

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
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`text-base uppercase tracking-wider font-medium px-3 py-2 cursor-pointer transition-colors ${
                          pathname === link.href
                            ? "text-white border-b-2 border-yellow-500"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-4 relative">
                {/* SearchBar extracted as a component */}
                <SearchBar
                  locale={locale}
                  user={user}
                  favoriteIds={favoriteIds}
                  setFavoriteIds={setFavoriteIds}
                  signOut={signOut}
                  router={router}
                  pathname={pathname}
                  setMobileSearchOpen={setMobileSearchOpen}
                  mobileSearchOpen={mobileSearchOpen}
                  desktopSearchOpen={desktopSearchOpen}
                  setDesktopSearchOpen={setDesktopSearchOpen}
                  t={t}
                />
                {/* Avatar/Login */}
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
              <div className="flex md:hidden items-center">
                <button
                  onClick={() => setMobileSearchOpen(true)}
                  aria-label="Search"
                  className="text-white hover:text-yellow-400 transition-colors"
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
            <SearchBar
              locale={locale}
              user={user}
              favoriteIds={favoriteIds}
              setFavoriteIds={setFavoriteIds}
              signOut={signOut}
              router={router}
              pathname={pathname}
              setMobileSearchOpen={setMobileSearchOpen}
              mobileSearchOpen={mobileSearchOpen}
              desktopSearchOpen={desktopSearchOpen}
              setDesktopSearchOpen={setDesktopSearchOpen}
              t={t}
              mobile
            />
          )}
        </div>
      </div>

      {/* Mobile Menu (unchanged) */}
      {mobileOpen && (
        <MobileMenu
          user={user}
          navLinks={navLinks}
          pathname={pathname}
          setMobileOpen={setMobileOpen}
          signOut={signOut}
          LoginButton={LoginButton}
        />
      )}
    </nav>
  );
}
