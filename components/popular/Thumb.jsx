"use client";
import React from "react";
import convertImageUrl from "@/lib/utils/imageUrlHelper";

export const Thumb = (props) => {
  const { selected, onClick, movie, type } = props;
  let imageUrl;
  let height;
  if (type == "details") {
    imageUrl = convertImageUrl(movie?.backdrop_path);
    height = "h-20";
  } else if (type == "carousel") {
    imageUrl = convertImageUrl(movie?.poster_path);
    height = "h-full";
  }

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
          alt="Movie"
          className={`rounded-xl object-cover w-full ${height} object-center`}
        />
      </button>
    </div>
  );
};
