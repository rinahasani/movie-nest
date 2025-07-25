import { API_ENDPOINTS } from "@/constants/api";
import { getTvShowDetails } from "../getTvShowDetails";

global.fetch = jest.fn();

const mockTvShowDetails = {
  id: 123,
  name: "Mock Show",
  overview: "A test show",
};

describe("getTvShowDetails", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("fetches TV show details successfully", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTvShowDetails,
    });

    const data = await getTvShowDetails(123, "en-US");

    expect(fetch).toHaveBeenCalledWith(API_ENDPOINTS.TV_SHOW_DETAILS(123, "en-US"));
    expect(data).toEqual(mockTvShowDetails);
  });

  it("throws an error when fetch fails", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Not Found",
    });

    await expect(getTvShowDetails(123, "en-US")).rejects.toThrow(
      "Failed to fetch TV show details for ID 123: Not Found"
    );
  });
});
