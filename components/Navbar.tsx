"use client";

import React, { useState } from "react";
import { usePathname, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const t = useTranslations("navbar");

  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { locale } = useParams() as { locale?: string };

  if (!locale) return null;

  // Build your navLinks with the locale prefix
  const navLinks = [
    { name: t("home"), href: `/${locale}/` },
    { name: t("movies"), href: `/${locale}/movies` },
    { name: t("tvShows"), href: `/${locale}/tv-shows` },
    { name: t("myFavorite"), href: `/${locale}/favoriteMovies` },
    { name: t("about"), href: `/${locale}/about` },
  ];

  // Allowed paths = all nav hrefs + the locale root
  const allowedPaths = [...navLinks.map((l) => l.href), `/${locale}/`];

  if (!allowedPaths.includes(pathname)) return null;

  // Login button
  function LoginButton({ className = "" }: { className?: string }) {
    return (
      <Link
        href={`/${locale}/login`}
        className={`text-base uppercase tracking-wider px-6 py-2.5 rounded bg-yellow-500 text-white font-medium hover:bg-yellow-400 transition-colors ${className}`}
      >
        Log In
      </Link>
    );
  }

  // Search icon button
  function SearchIconButton({
    onClick = () => {},
    className = "",
  }: {
    onClick?: () => void;
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
              {navLinks.map((link) => (
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

          {/* Desktop Actions (Search + Login) */}
          <div className="hidden md:flex items-center gap-4">
            <SearchIconButton />
            <LoginButton />
          </div>

          {/* Hamburger Icon (Mobile) */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="text-gray-200 hover:text-yellow-500 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
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
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center space-y-6 md:hidden">
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-6 right-6 text-white text-3xl focus:outline-none"
            aria-label="Close menu"
          >
            &times;
          </button>

          {navLinks.map((link) => (
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

          <LoginButton />
        </div>
      )}
    </nav>
  );
}
