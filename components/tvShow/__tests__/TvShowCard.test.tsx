import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TvShow } from "@/constants/types/TvShow";

// 1️⃣ Mock next-intl before importing the component
jest.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      viewDetails: "View Details",
      noDescription: "No Description Available",
    };
    return map[key] ?? key;
  },
}));

// 2️⃣ Mock imageUrlHelper
jest.mock("@/lib/utils/imageUrlHelper", () => ({
  __esModule: true,
  default: jest.fn(() => "https://mocked.image/url.jpg"),
}));

// 3️⃣ Now import the component under test
import TvShowCard from "../TvShowCard";

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

  it("renders the TV show poster and name (collapsed)", () => {
    render(
      <TvShowCard
        tvShow={mockTvShow}
        isExpanded={false}
        onClick={onClick}
        onHover={onHover}
      />
    );

    const img = screen.getByAltText("Mock Show");
    expect(img).toBeInTheDocument();

    // Since not hovered/expanded, overlay text should not appear
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

    // Find the outer div by role=img’s parent container
    const card = screen.getByAltText("Mock Show").closest("div") as HTMLElement;

    // Fire hover
    fireEvent.mouseEnter(card);
    expect(onHover).toHaveBeenCalledWith(mockTvShow.id);

    // Overlay content appears
    expect(screen.getByText("Mock Show")).toBeInTheDocument();
    expect(screen.getByText("View Details")).toBeInTheDocument();
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

    const card = screen.getByAltText("Mock Show").closest("div") as HTMLElement;

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

    const card = screen.getByAltText("Mock Show").closest("div") as HTMLElement;
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

    // View Details link is rendered because isExpanded=true
    const viewDetails = screen.getByText("View Details");
    fireEvent.click(viewDetails);
    expect(onClick).not.toHaveBeenCalled();
  });
});
