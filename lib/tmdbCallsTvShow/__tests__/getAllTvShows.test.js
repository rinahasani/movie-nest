import { API_ENDPOINTS } from "@/constants/api";
import { getAllTvShows } from "../getAllTvShows";

global.fetch = jest.fn();

const mockTvShows = {
  results: [{ id: 1, name: "Show 1" }],
  total_pages: 5,
};

describe("getAllTvShows", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("fetches TV shows successfully", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTvShows,
    });

    const data = await getAllTvShows(2, "en-US");

    expect(fetch).toHaveBeenCalledWith(API_ENDPOINTS.DISCOVER_TV(2, "en-US"));
    expect(data).toEqual({
      results: mockTvShows.results,
      total_pages: mockTvShows.total_pages,
    });
  });

  it("throws an error when fetch fails", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    await expect(getAllTvShows(1, "en-US")).rejects.toThrow(
      "Failed to fetch TV shows: Internal Server Error"
    );
  });
});
