import React from "react";
import { render, screen } from "@testing-library/react";
import { Episode } from "@/constants/types/Season";

// 1️⃣ Mock next-intl before importing the component
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      noImage: "No Image Available",
      airDate: "Air Date",
      rating: "Rating",
    };
    return map[key] ?? key;
  },
}));

// 2️⃣ Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />,
}));

// 3️⃣ Mock imageUrlHelper
jest.mock("@/lib/utils/imageUrlHelper", () => ({
  __esModule: true,
  default: (path: string) =>
    path ? `https://image.tmdb.org/t/p/w500${path}` : "",
}));

// Now import after mocks
import EpisodeCard from "../EpisodeCard";

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

    // Title
    expect(
      screen.getByText(`S${mockEpisode.season_number}E${mockEpisode.episode_number}: ${mockEpisode.name}`)
    ).toBeInTheDocument();

    // Overview
    expect(screen.getByText(mockEpisode.overview)).toBeInTheDocument();

    // Rating line includes "Rating: 8.5"
    expect(screen.getByText(/Rating:/)).toHaveTextContent("8.5");

    // Image element
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute(
      "src",
      `https://image.tmdb.org/t/p/w500${mockEpisode.still_path}`
    );
    expect(img).toHaveAttribute("alt", mockEpisode.name);
  });

  it("renders fallback when image is not available", () => {
    const noImageEp = { ...mockEpisode, still_path: "" };
    render(<EpisodeCard episode={noImageEp} />);

    expect(screen.getByText("No Image Available")).toBeInTheDocument();
  });
});
