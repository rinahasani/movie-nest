"use client";
import React from "react";
import { usePathname, useParams } from "next/navigation";

const socialLinks = [
  {
    href: "https://www.linkedin.com/",
    label: "LinkedIn",
    img: "/images/linked_in.png",
  },
  {
    href: "https://instagram.com/",
    label: "Instagram",
    img: "/images/insta_gram.png",
  },
  {
    href: "https://facebook.com/",
    label: "Facebook",
    img: "/images/face_book.png",
  },
  {
    href: "https://github.com/",
    label: "GitHub",
    img: "/images/git_hub.png",
  },
];

const Footer = () => {
  const pathname = usePathname();
  const { locale } = useParams() as { locale?: string };
  if (!locale) return null;
  const normalizedPathname = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  const isAuthPage =
    normalizedPathname === `/${locale}/login` ||
    normalizedPathname === `/${locale}/signup` ||
    normalizedPathname === `/${locale}/reset-password`;
  if (isAuthPage) return null;
  return (
    <footer className="w-full bg-black text-white py-4 px-6 flex flex-col md:flex-row items-center justify-between border-t border-[#222] gap-4">
      <div className="flex flex-col md:flex-row items-center gap-5 md:gap-3 text-base">
        <span>
          © 2025 <span className="font-bold text-yellow-400">Movie Nest</span>
        </span>
      </div>
      <div className="flex gap-2">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="transition-transform hover:scale-110"
          >
            <img
              src={link.img}
              alt={link.label}
              className="w-6 h-6 rounded-full"
            />
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
