"use client";
import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Thumb } from "../popular/Thumb";
import { useRouter } from "next/navigation";

const Carousel = (props) => {
  const { slides, options, movies } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });
  const router = useRouter();

  const onThumbClick = useCallback(
    (index) => {
      setSelectedIndex(index);
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
      const clickedMovie = movies[index];
      if (clickedMovie && clickedMovie.id) {
        router.push(`/pages/details?id=${clickedMovie.id}`);
      }
    },
    [emblaMainApi, emblaThumbsApi, movies, router]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();

    emblaMainApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);
  return (
    <div
      className="max-w-full x mx-auto px-4"
      style={{
        "--slide-height": "19rem",
        "--slide-spacing": "1rem",
        "--slide-size": "100%",
      }}
    >
      <div className="mt-[var(--thumbs-slide-spacing,0.8rem)]">
        <div className="overflow-hidden" ref={emblaThumbsRef}>
          <div
            className="flex flex-row w-full"
            style={{ marginLeft: "calc(var(--thumbs-slide-spacing) * -1)" }}
          >
            {slides.map((index) => (
              <Thumb
                key={movies[index].id}
                onClick={() => onThumbClick(index)}
                selected={index === selectedIndex}
                movie={movies[index]}
                type="carousel"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaMainRef}>
        <div className="flex">
          {slides.length > 0 && <div className="min-w-full h-1 hidden" />}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
