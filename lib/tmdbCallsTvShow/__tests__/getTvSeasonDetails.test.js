import { getTvSeasonDetails } from "../getTvSeasonDetails";
import { API_ENDPOINTS } from "@/constants/api";

describe("getTvSeasonDetails", () => {
  const tvId = 123;
  const seasonNumber = 2;
  const language = "en-EN";
  const mockUrl = `mocked-url-for-tv-${tvId}-season-${seasonNumber}-${language}`;

  beforeAll(() => {
    // Mock API_ENDPOINTS.TV_SEASON_DETAILS to return predictable URL
    jest.spyOn(API_ENDPOINTS, "TV_SEASON_DETAILS").mockReturnValue(mockUrl);
  });

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and returns season details data on success", async () => {
    const mockData = { id: tvId, season: seasonNumber, episodes: [] };
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const result = await getTvSeasonDetails(tvId, seasonNumber, language);

    expect(global.fetch).toHaveBeenCalledWith(mockUrl);
    expect(result).toEqual(mockData);
  });

  it("throws error when fetch response is not ok", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      statusText: "Not Found",
    });

    await expect(
      getTvSeasonDetails(tvId, seasonNumber, language)
    ).rejects.toThrow(
      `Failed to fetch season ${seasonNumber} details for TV show ID ${tvId}: Not Found`
    );
  });
});
