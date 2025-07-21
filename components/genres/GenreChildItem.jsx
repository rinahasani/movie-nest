"use client";
import React from "react";
import convertImageUrl from "@/lib/utils/imageUrlHelper";
export const GenreChildItem = (props) => {
  const { selected, onClick, movie } = props;

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
          src={convertImageUrl(movie?.poster_path)}
          alt="Movie"
          className={`rounded-xl object-cover w-full h-50 object-center`}
        />
      </button>
    </div>
  );
};
