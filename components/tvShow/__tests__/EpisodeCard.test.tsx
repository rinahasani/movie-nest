import React from "react";
import { render, screen } from "@testing-library/react";
import { Episode } from "@/constants/types/Season";
import EpisodeCard from "../EpisodeCard";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} alt={props.alt} />;
  },
}));

// Mock imageUrlHelper to return a test URL
jest.mock("@/lib/utils/imageUrlHelper", () => ({
  __esModule: true,
  default: (path: string) => (path ? `https://image.tmdb.org/t/p/w500${path}` : ""),
}));

const mockEpisode: Episode = {
  id: 1,
  name: "Pilot",
  overview: "This is the pilot episode of the series.",
  still_path: "/testimage.jpg",
  vote_average: 8.5,
  air_date: "2023-05-01",
  episode_number: 1,
  season_number: 1,
};

describe("EpisodeCard", () => {
  it("renders episode details correctly with image", () => {
    render(<EpisodeCard episode={mockEpisode} />);

    expect(
      screen.getByText(`S${mockEpisode.season_number}E${mockEpisode.episode_number}: ${mockEpisode.name}`)
    ).toBeInTheDocument();

    expect(screen.getByText(mockEpisode.overview)).toBeInTheDocument();
    expect(screen.getByText(/Rating:/)).toHaveTextContent(mockEpisode.vote_average.toFixed(1));
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      `https://image.tmdb.org/t/p/w500${mockEpisode.still_path}`
    );
    expect(screen.getByRole("img")).toHaveAttribute("alt", mockEpisode.name);
  });

  it("renders fallback when image is not available", () => {
    const episodeWithoutImage = { ...mockEpisode, still_path: "" };

    render(<EpisodeCard episode={episodeWithoutImage} />);

    expect(screen.getByText("No Image Available")).toBeInTheDocument();
  });
});
