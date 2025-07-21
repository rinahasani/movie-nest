"use client";

import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import convertImageUrl from "@/lib/utils/imageUrlHelper";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

/**
 * @param {{ movies?: any[], onMovieClick?: (movie: any) => void }} props
 */
export default function CoverflowCarousel({ movies = [], onMovieClick }) {
  const router = useRouter();
  const locale = useLocale();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center", skipSnaps: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    const interval = setInterval(() => {
      if (emblaApi) {
        emblaApi.scrollNext();
      }
    }, 200);
    return () => clearInterval(interval);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full flex justify-center items-center py-6">
      <div className="w-full no-scrollbar" ref={emblaRef}>
        <div className="flex justify-center items-center gap-4">
          {movies.map((movie, i) => {
            const offset = i - selectedIndex;
            const isCenter = offset === 0;
            const scale = isCenter ? 1.2 : 0.8;
            const opacity = isCenter ? 1 : 0.6;

            return (
              <button
                key={movie.id}
                type="button"
                className={`relative transition-all duration-500 ease-in-out cursor-pointer rounded-xl overflow-hidden border-2 ${isCenter ? "border-yellow-400" : "border-transparent"}`}
                style={{
                  width: 160,
                  height: 230,
                  transform: `scale(${scale})`,
                  opacity,
                }}
                onClick={() => {
                  if (onMovieClick) {
                    onMovieClick(movie);
                  } else {
                    router.push(`/${locale}/details/${movie.id}`);
                  }
                }}
                aria-label={movie.title}
              >
                <img
                  src={convertImageUrl(movie.poster_path)}
                  alt={movie.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              </button>
            );
          })}
        </div>
      </div>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
