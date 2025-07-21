"use client";
import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Thumb } from "./Thumb";
import MovieHero from "../MovieHero";

const PopularMovies = (props) => {
  const { slides, options, movies } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
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
                type="details"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaMainRef}>
        <div
          className="flex touch-pan-y touch-pinch-zoom"
          style={{ marginLeft: "calc(var(--slide-spacing) * -1)" }}
        >
          {slides.map((index) => (
            <div
              className="flex-none min-w-0"
              key={index}
              style={{
                transform: "translate3d(0, 0, 0)",
                flex: "0 0 var(--slide-size)",
                paddingLeft: "var(--slide-spacing)",
              }}
            >
              <div className="my-8">
                <MovieHero
                  id={movies[index].id}
                  title={movies[index].title}
                  vote_average={movies[index].vote_average}
                  release_date={movies[index].release_date}
                  overview={movies[index].overview}
                  backdrop_path={movies[index].backdrop_path}
                  homepage={movies[index].homepage}
                  moreInfo={true}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularMovies;
