import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TvShowCard from "../TvShowCard";
import { TvShow } from "@/constants/types/TvShow";
import { Season } from "@/constants/types/Season";

// Mock next-intl
jest.mock("next-intl", () => ({
  useLocale: () => "en",
}));

// Mock imageUrlHelper
jest.mock("@/lib/utils/imageUrlHelper", () => ({
  __esModule: true,
  default: jest.fn(() => "https://mocked.image/url.jpg"),
}));

describe("TvShowCard", () => {
  const mockTvShow: TvShow = {
    id: 1,
    name: "Mock Show",
    poster_path: "/poster.jpg",
    backdrop_path: "/backdrop.jpg",
    vote_average: 8.4,
    overview: "This is a mock show overview for testing.",
    first_air_date: "2023-01-01",
    genre_ids: [1, 2],
    number_of_seasons: 3,
    number_of_episodes: 24,
    seasons: [], 
  };

  const onClick = jest.fn();
  const onHover = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the TV show poster and name", () => {
    render(
      <TvShowCard
        tvShow={mockTvShow}
        isExpanded={false}
        onClick={onClick}
        onHover={onHover}
      />
    );

    const image = screen.getByAltText("Mock Show");
    expect(image).toBeInTheDocument();

    expect(screen.queryByText("View Details")).not.toBeInTheDocument();
  });

  it("shows overlay on hover and displays correct details", () => {
    render(
      <TvShowCard
        tvShow={mockTvShow}
        isExpanded={false}
        onClick={onClick}
        onHover={onHover}
      />
    );

    const card = screen.getByRole("img", { hidden: true }).parentElement
      ?.parentElement as HTMLElement;

    fireEvent.mouseEnter(card);

    expect(onHover).toHaveBeenCalledWith(mockTvShow.id);

    expect(screen.getByText("Mock Show")).toBeInTheDocument();
    expect(screen.getByText(/View Details/i)).toBeInTheDocument();
    expect(screen.getByText(mockTvShow.overview)).toBeInTheDocument();
  });

  it("removes overlay on mouse leave", () => {
    render(
      <TvShowCard
        tvShow={mockTvShow}
        isExpanded={false}
        onClick={onClick}
        onHover={onHover}
      />
    );

    const card = screen.getByRole("img", { hidden: true }).parentElement
      ?.parentElement as HTMLElement;

    fireEvent.mouseEnter(card);
    fireEvent.mouseLeave(card);

    expect(onHover).toHaveBeenLastCalledWith(null);
  });

  it("calls onClick when card is clicked", () => {
    render(
      <TvShowCard
        tvShow={mockTvShow}
        isExpanded={false}
        onClick={onClick}
        onHover={onHover}
      />
    );

    const card = screen.getByRole("img", { hidden: true }).parentElement
      ?.parentElement as HTMLElement;

    fireEvent.click(card);

    expect(onClick).toHaveBeenCalledWith(mockTvShow.id);
  });

  it("prevents onClick when View Details link is clicked", () => {
    render(
      <TvShowCard
        tvShow={mockTvShow}
        isExpanded={true} 
        onClick={onClick}
        onHover={onHover}
      />
    );

    const viewDetailsButton = screen.getByText(/View Details/i);

    fireEvent.click(viewDetailsButton);

    expect(onClick).not.toHaveBeenCalled();
  });
});
