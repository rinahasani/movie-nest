import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TvShowsList from "../TvShowsList";
import { TvShow } from "@/constants/types/TvShow";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock TvShowCard
jest.mock("../TvShowCard", () => (props: any) => {
  return (
    <div
      data-testid={`tvshow-card-${props.tvShow.id}`}
      onClick={() => props.onClick(props.tvShow.id)}
      onMouseEnter={() => props.onHover(props.tvShow.id)}
      onMouseLeave={() => props.onHover(null)}
    >
      {props.tvShow.name} {props.isExpanded ? "(expanded)" : ""}
    </div>
  );
});

// Mock getAllTvShows
jest.mock("@/lib/tmdbCallsTvShow/getAllTvShows", () => ({
  getAllTvShows: jest.fn(),
}));

import { getAllTvShows } from "@/lib/tmdbCallsTvShow/getAllTvShows";

describe("TvShowsList", () => {
  const mockTvShowsPage1: TvShow[] = [
    {
      id: 1,
      name: "Show 1",
      poster_path: null,
      backdrop_path: null,
      overview: "",
      first_air_date: "",
      vote_average: 0,
      genre_ids: [],
      seasons: [],
    },
    {
      id: 2,
      name: "Show 2",
      poster_path: null,
      backdrop_path: null,
      overview: "",
      first_air_date: "",
      vote_average: 0,
      genre_ids: [],
      seasons: [],
    },
  ];

  const mockTvShowsPage2: TvShow[] = [
    {
      id: 3,
      name: "Show 3",
      poster_path: null,
      backdrop_path: null,
      overview: "",
      first_air_date: "",
      vote_average: 0,
      genre_ids: [],
      seasons: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    (getAllTvShows as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    render(<TvShowsList locale="en" />);

    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  it("renders error state on fetch failure", async () => {
    (getAllTvShows as jest.Mock).mockRejectedValue(new Error("Failed fetch"));

    render(<TvShowsList locale="en" />);

    await waitFor(() => {
      expect(screen.getByText("fetchError")).toBeInTheDocument();
    });
  });

  it("renders TV shows after successful fetch", async () => {
    (getAllTvShows as jest.Mock).mockResolvedValue({
      results: mockTvShowsPage1,
      total_pages: 1,
    });

    render(<TvShowsList locale="en" />);

    for (const show of mockTvShowsPage1) {
      await waitFor(() =>
        expect(screen.getByText(show.name)).toBeInTheDocument()
      );
    }
  });

  it("shows no TV shows found message if none", async () => {
    (getAllTvShows as jest.Mock).mockResolvedValue({
      results: [],
      total_pages: 1,
    });

    render(<TvShowsList locale="en" />);

    await waitFor(() => {
      expect(screen.getByText("noTvShowsFound")).toBeInTheDocument();
    });
  });
});
