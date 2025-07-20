"use client";
import React from "react";

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
  return (
    <footer className="w-full bg-black text-white py-4 px-6 flex flex-col md:flex-row items-center justify-between border-t border-[#222]">
      <div className="flex flex-col md:flex-row items-center gap-5 md:gap-3 text-m">
        <span>
          © 2025 <span className="font-bold text-yellow-400">Movie Nest</span>
        </span>
      </div>
      <div className="flex gap-2 mt-3 md:mt-0">
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
