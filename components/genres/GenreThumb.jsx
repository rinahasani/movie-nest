"use client";
import React from "react";

export const GenreThumb = (props) => {
  const { selected, onClick, genre } = props;


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
        rounded-md
        p-3
        flex-none min-w-32
        border-2
        ${selected ? "" : "border-transparent"}
      `}
        style={selected ? { borderColor: "var(--base-color)" } : undefined}
      >
       {genre.name}
      </button>
    </div>
  );
};
