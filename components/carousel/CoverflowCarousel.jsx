"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import convertImageUrl from "@/lib/utils/imageUrlHelper";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { getAllMovies } from "@/lib/getAllMovies";

/**
 * @param {{ movies?: any[], onMovieClick?: (movie: any) => void }} props
 */
export default function CoverflowCarousel({ movies = [], onMovieClick }) {
  const router = useRouter();
  const locale = useLocale();
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: false, align: "start" },
    [
      Autoplay({
        delay: 2000,
        stopOnInteraction: false,
        stopOnLastSnap: false, // allow autoplay to continue
      }),
    ]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slideStyles, setSlideStyles] = useState([]);
  const [extraMovies, setExtraMovies] = useState([]);

  useEffect(() => {
    async function fetchMoreMovies() {
      try {
        // Fetch multiple pages for more variety
        const [page1, page5, page6] = await Promise.all([
          getAllMovies(1, locale),
          getAllMovies(5, locale),
          getAllMovies(6, locale),
        ]);
        setExtraMovies([...(page1 || []), ...(page5 || []), ...(page6 || [])]);
      } catch (err) {
        console.error('Failed to fetch more movies', err);
      }
    }
    fetchMoreMovies();
  }, [locale]);

  const allMovies = useMemo(() => {
    const uniqueMovies = [];
    const seenIds = new Set();
    [...movies, ...extraMovies].forEach(movie => {
      if (!seenIds.has(movie.id)) {
        uniqueMovies.push(movie);
        seenIds.add(movie.id);
      }
    });
    return uniqueMovies;
  }, [movies, extraMovies]);


  // Calculate dynamic styles for each slide
  const calculateStyles = useCallback(() => {
    if (!emblaApi) return;
    const selected = emblaApi.selectedScrollSnap();
    const styles = allMovies.map((_, i) => {
      if ((i % 2) === (selected % 2)) {
        return { scale: 1, opacity: 1, border: "2px solid #facc15" };
      } else {
        return { scale: 0.7, opacity: 0.4, border: "2px solid transparent" };
      }
    });
    setSlideStyles(styles);
  }, [emblaApi, allMovies]);

  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = emblaApi.plugins().autoplay;

    const onSelect = () => {
      const currentIndex = emblaApi.selectedScrollSnap();
      setSelectedIndex(currentIndex);
      calculateStyles();

      // If at last slide, rewind after short delay and continue autoplay
      if (currentIndex === allMovies.length - 1) {
        setTimeout(() => {
          emblaApi.scrollTo(0); // rewind
          autoplay && autoplay.reset(); // continue autoplay
        }, 600); // slight delay before rewinding
      }
    };

    onSelect(); // initial setup
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("scroll", calculateStyles);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("scroll", calculateStyles);
    };
  }, [emblaApi, calculateStyles, allMovies.length]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(0, true);
    }
  }, [emblaApi]);

  useEffect(() => {
    calculateStyles();
  }, [allMovies, calculateStyles]);

  return (
    <div className="relative w-full flex justify-start items-center py-6">
      <div className="embla w-full no-scrollbar" ref={emblaRef}>
        <div className="embla__container flex gap-4 sm:gap-6">
          {allMovies.map((movie, i) => {
            const style = slideStyles[i] || { scale: 0.9, opacity: 0.7, border: "2px solid transparent" };
            return (
              <button
                key={movie.id}
                type="button"
                className="embla__slide w-32 h-48 sm:w-40 sm:h-56 transition-transform duration-500 ease-in-out cursor-pointer rounded-xl overflow-hidden border-2"
                style={{
                  transform: `scale(${style.scale})`,
                  opacity: style.opacity,
                  border: style.border,
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
        .embla {
          overflow: hidden;
        }
        .embla__container {
          display: flex;
          will-change: transform;
        }
        .embla__slide {
          flex: 0 0 auto;
        }
      `}</style>
    </div>
  );
}
