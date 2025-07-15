"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

type SliderColumnProps = {
  images: string[];
  direction: "up" | "down";
  duration?: number;
};

function SliderColumn({
  images,
  direction,
  duration = 30,
}: SliderColumnProps) {
  const looped = [...images, ...images];
  const [initialY, animateY] = direction === "up" ? ["0%", "-50%"] : ["-50%", "0%"];

  return (
    <div className="w-1/3 overflow-hidden relative h-screen">
      <motion.div
        initial={{ y: initialY }}
        animate={{ y: [initialY, animateY] }}
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
        className="absolute inset-0 w-full flex flex-col items-center"
      >
        {looped.map((src, i) => (
          <div
            key={i}
            className="w-[90%] h-64 mb-6 last:mb-0"
          >
            <Image
              src={src}
              alt={`slide-${i}`}
              width={300}
              height={256}
              className="object-cover rounded-xl border border-white/20 w-full h-full"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

type AuthSliderProps = {
  title: string;
  subtitle: string;
  emoji?: string;
};

export function AuthSlider({ title, subtitle, emoji = "🎬" }: AuthSliderProps) {
  const pics = [
    "/assets/movies/movie1.jpg",
    "/assets/movies/movie2.png",
    "/assets/movies/movie3.png",
    "/assets/movies/movie4.jpg",
    "/assets/movies/movie5.png",
    "/assets/movies/movie6.png",
    "/assets/movies/movie7.jpg",
  ];

  return (
    <div className="w-full md:w-1/2 flex gap-4 relative h-screen">
      <SliderColumn images={pics} direction="down" />
      <SliderColumn images={pics} direction="up" />
      <SliderColumn images={pics} direction="down" />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80" />
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm p-8 rounded-xl text-center w-4/5 md:w-3/4 lg:w-2/3">
        <h2 className="text-xl md:text-2xl font-semibold text-white">{title}</h2>
        <p className="mt-4 text-base md:text-lg text-gray-100">{subtitle}</p>
        <div className="mt-4 text-3xl">{emoji}</div>
      </div>
    </div>
  );
}
