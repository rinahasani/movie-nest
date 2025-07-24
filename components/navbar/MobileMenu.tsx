import React from "react";
import Link from "next/link";
import Blockies from "react-blockies";

interface MobileMenuProps {
  user: any;
  navLinks: { name: string; href: string }[];
  pathname: string;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  signOut: () => Promise<void>;
  LoginButton: React.FC;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ user, navLinks, pathname, setMobileOpen, signOut, LoginButton }) => (
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
        <Link
          key={link.name}
          href={link.href}
          className={`text-2xl uppercase tracking-wider font-light cursor-pointer transition-colors ${
            pathname === link.href
              ? "text-white"
              : "text-gray-300 hover:text-white"
          }`}
          onClick={() => setMobileOpen(false)}
        >
          {link.name}
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
);

export default MobileMenu; 