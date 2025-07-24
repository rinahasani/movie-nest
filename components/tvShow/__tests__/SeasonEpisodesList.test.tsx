import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { getTvSeasonDetails } from "@/lib/tmdbCallsTvShow/getTvSeasonDetails";
import { Episode } from "@/constants/types/Season";
import SeasonEpisodesList from "../SeasonEpisodesList";

// Mock getTvSeasonDetails
jest.mock("@/lib/tmdbCallsTvShow/getTvSeasonDetails", () => ({
  getTvSeasonDetails: jest.fn(),
}));

// Mock next-intl useLocale
jest.mock("next-intl", () => ({
  useLocale: () => "en-US",
}));

// Mock EpisodeCard to simplify DOM
jest.mock("@/components/tvShow/EpisodeCard", () => ({
  __esModule: true,
  default: ({ episode }: { episode: Episode }) => (
    <div data-testid="episode-card">{episode.name}</div>
  ),
}));

const mockEpisodes = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Episode ${i + 1}`,
  overview: "Overview",
  still_path: "/path.jpg",
  vote_average: 7.5,
  air_date: "2024-01-01",
  episode_number: i + 1,
  season_number: 1,
}));

describe("SeasonEpisodesList", () => {
  const tvId = 1;
  const season = {
    id: 1,
    name: "Season 1",
    season_number: 1,
    overview: "Overview",
    air_date: "2024-01-01",
    episode_count: 12,
    poster_path: "/poster.jpg",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays loading initially", async () => {
    (getTvSeasonDetails as jest.Mock).mockResolvedValueOnce({
      episodes: [],
    });

    render(<SeasonEpisodesList tvId={tvId} season={season} />);
    expect(screen.getByText(/Loading episodes/i)).toBeInTheDocument();
    await waitFor(() => expect(getTvSeasonDetails).toHaveBeenCalled());
  });

  it("displays error message if fetch fails", async () => {
    (getTvSeasonDetails as jest.Mock).mockRejectedValueOnce(
      new Error("Fetch failed")
    );

    render(<SeasonEpisodesList tvId={tvId} season={season} />);
    await waitFor(() =>
      expect(screen.getByText(/Error: Fetch failed/i)).toBeInTheDocument()
    );
  });

  it("displays message when no episodes are found", async () => {
    (getTvSeasonDetails as jest.Mock).mockResolvedValueOnce({
      episodes: [],
    });

    render(<SeasonEpisodesList tvId={tvId} season={season} />);
    await waitFor(() =>
      expect(
        screen.getByText(/No episodes found for this season/i)
      ).toBeInTheDocument()
    );
  });

  it("displays episodes and loads more when Show More is clicked", async () => {
    (getTvSeasonDetails as jest.Mock).mockResolvedValueOnce({
      episodes: mockEpisodes,
    });

    render(<SeasonEpisodesList tvId={tvId} season={season} />);

    await waitFor(() => {
      expect(screen.getAllByTestId("episode-card")).toHaveLength(10);
    });

    const button = screen.getByRole("button", { name: /show more/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getAllByTestId("episode-card")).toHaveLength(12);
    });
  });
});
