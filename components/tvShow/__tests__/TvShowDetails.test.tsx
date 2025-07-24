import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TvShowDetails from "../TvShowDetails";
import { TvShow } from "@/constants/types/TvShow";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("next/image", () => (props: any) => {
  return <img {...props} alt={props.alt} />;
});

// Mock utils
jest.mock("@/lib/utils/imageUrlHelper", () => ({
  __esModule: true,
  default: jest.fn(() => "https://mocked.image/url.jpg"),
}));

jest.mock("@/lib/utils/convertOriginalImage", () => ({
  __esModule: true,
  default: jest.fn(() => "https://mocked.originalimage/url.jpg"),
}));

// Mock getTvShowDetails
jest.mock("@/lib/tmdbCallsTvShow/getTvShowDetails", () => ({
  getTvShowDetails: jest.fn(),
}));

// Mock SeasonEpisodesList
jest.mock("@/components/tvShow/SeasonEpisodesList", () => (props: any) => (
  <div data-testid="season-episodes-list">Mock SeasonEpisodesList</div>
));

import { getTvShowDetails } from "@/lib/tmdbCallsTvShow/getTvShowDetails";

describe("TvShowDetails", () => {
  const mockTvShow: TvShow = {
    id: 1,
    name: "Mock TV Show",
    overview: "This is a mock TV show overview.",
    poster_path: "/poster.jpg",
    backdrop_path: "/backdrop.jpg",
    first_air_date: "2022-01-01",
    vote_average: 8.5,
    genre_ids: [1, 2],
    number_of_seasons: 3,
    number_of_episodes: 30,
    seasons: [
      {
        id: 11,
        name: "Season 1",
        overview: "Season 1 overview",
        air_date: "2021-01-01",
        episode_count: 10,
        season_number: 1,
        poster_path: null,
      },
      {
        id: 12,
        name: "Season 0 (Specials)",
        overview: "Special episodes",
        air_date: "2020-01-01",
        episode_count: 2,
        season_number: 0,
        poster_path: null,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    (getTvShowDetails as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    ); 

    render(<TvShowDetails id="1" locale="en" />);

    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  it("renders error state", async () => {
    (getTvShowDetails as jest.Mock).mockRejectedValue(
      new Error("Failed fetch")
    );

    render(<TvShowDetails id="1" locale="en" />);

    await waitFor(() => {
      expect(screen.getByText("fetchError")).toBeInTheDocument();
    });
  });

  it("renders TV show details and seasons dropdown", async () => {
    (getTvShowDetails as jest.Mock).mockResolvedValue(mockTvShow);

    render(<TvShowDetails id="1" locale="en" />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Mock TV Show"
      );
    });

    expect(
      screen.getByText("This is a mock TV show overview.")
    ).toBeInTheDocument();

    expect(screen.getByText("firstAirDate:")).toBeInTheDocument();
    expect(screen.getByText("rating:")).toBeInTheDocument();
    expect(screen.getByText("numberOfSeasons:")).toBeInTheDocument();
    expect(screen.getByText("numberOfEpisodes:")).toBeInTheDocument();

    // Season select label and options
    expect(screen.getByLabelText("selectSeason:")).toBeInTheDocument();

    const select = screen.getByLabelText("selectSeason:") as HTMLSelectElement;

    expect(select).toHaveValue("1"); 

    expect(screen.getByText(/Season 1 – 10 episodes/)).toBeInTheDocument();

    expect(screen.getByTestId("season-episodes-list")).toBeInTheDocument();
  });

  it("changes selected season on dropdown change", async () => {
    (getTvShowDetails as jest.Mock).mockResolvedValue(mockTvShow);

    render(<TvShowDetails id="1" locale="en" />);

    await waitFor(() => screen.getByLabelText("selectSeason:"));

    const select = screen.getByLabelText("selectSeason:") as HTMLSelectElement;

    fireEvent.change(select, { target: { value: "1" } });

    expect(select.value).toBe("1");
  });
});
