'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const navLinks = [
  { name: 'Home', href: '/', active: true },
  { name: 'Movies', href: '/movies', active: false },
  { name: 'TV Shows', href: '/tv-shows', active: false },
  { name: 'My Favorite', href: '/favorites', active: false },
];

function LoginButton({ className = '' }) {
  return (
    <Link
      href="/login"
      className={`text-base uppercase tracking-wider px-4 py-2 rounded bg-yellow-500 text-black font-medium hover:bg-yellow-400 transition-colors ${className}`}
    >
      Log In
    </Link>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-black w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <Image
                  src="/images/logo.png"
                  alt="Movie Logo"
                  width={50}
                  height={50}
                  className="mr-2"
                />
              </div>
            </Link>
          </div>

          {/* Centered Nav Links (Desktop) */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href}>
                  <span
                    className={`text-base uppercase tracking-wider font-medium px-3 py-2 cursor-pointer ${
                      link.active
                        ? 'text-white font-light'
                        : 'text-gray-400 hover:text-white font-bold'
                    } transition-colors`}
                  >
                    {link.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Log In Button (Desktop) */}
          <div className="hidden md:flex items-center">
            <LoginButton className="ml-4" />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="text-gray-200 hover:text-yellow-500 focus:outline-none"
            >
              {/* Hamburger icon */}
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
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M4 6h16M4 12h16M4 18h16'
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Full-Screen Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center space-y-6 transition-all md:hidden">
          {/* Close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-6 right-6 text-white text-3xl focus:outline-none"
            aria-label="Close menu"
          >
            &times;
          </button>

          {/* Nav Links */}
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              <span
                className={`text-2xl uppercase tracking-wider font-light cursor-pointer ${
                  link.active ? 'text-white' : 'text-gray-300 hover:text-white'
                } transition-colors`}
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </span>
            </Link>
          ))}
          {/* Log In Button (Mobile) */}
          <LoginButton />
        </div>
      )}
    </nav>
  );
}
