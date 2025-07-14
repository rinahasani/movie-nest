"use client";
import React from "react";
import Image from "next/image";

export const Thumb = (props) => {
  const { selected, onClick, movie } = props;
  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";
  const THUMBNAIL_SIZE = "w500";
  const imageUrl = movie?.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${THUMBNAIL_SIZE}${movie.poster_path}`
    : "";
  return (
    <div
      className={`
    p-[0.2rem]
    `}
    >
      <button
        onClick={onClick}
        type="button"
        className={`
        rounded-xl
        flex-none min-w-32
        border-2
        ${selected ? "" : "border-transparent"}
      `}
        style={selected ? { borderColor: "var(--base-color)" } : undefined}
      >
        <img
          src={imageUrl}
          width={600}
          height={300}
          alt=""
          className={`rounded-xl object-cover w-full h-full`}
        />
      </button>
    </div>
  );
};
