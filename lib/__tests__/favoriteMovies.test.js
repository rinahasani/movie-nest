import { addFavoriteMovie, removeFavoriteMovie, getUserFavorites } from "../favoriteMovies";
import { ref, set, remove, get, getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { ERROR_MESSAGES } from "@/constants/strings";

// Mock firebase/database including getDatabase
jest.mock("firebase/database", () => ({
  ref: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
  get: jest.fn(),
  getDatabase: jest.fn(() => ({})),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
}));

jest.mock("../firebase", () => ({
  db: {},
}));

describe("favoriteMovies", () => {
  const mockUid = "user123";
  const mockMovie = { id: 1, title: "Test Movie" };
  const fakeRef = { path: "fake/path" };

  beforeEach(() => {
    jest.clearAllMocks();
    ref.mockReturnValue(fakeRef);
  });

  describe("addFavoriteMovie", () => {
    it("adds a favorite movie when uid and movie are valid", async () => {
      await addFavoriteMovie(mockUid, mockMovie);

      expect(ref).toHaveBeenCalledWith(expect.anything(), `users/${mockUid}/favoriteMovies/${mockMovie.id}`);
      expect(set).toHaveBeenCalledWith(fakeRef, {
        id: mockMovie.id,
        title: mockMovie.title,
      });
    });

    it("throws error if uid or movie is invalid", async () => {
      await expect(addFavoriteMovie(null, mockMovie)).rejects.toThrow(ERROR_MESSAGES.INVALID_UID_OR_MOVIE);
      await expect(addFavoriteMovie(mockUid, null)).rejects.toThrow(ERROR_MESSAGES.INVALID_UID_OR_MOVIE);
      await expect(addFavoriteMovie(mockUid, { id: 1 })).rejects.toThrow(ERROR_MESSAGES.INVALID_UID_OR_MOVIE);
    });
  });

  describe("removeFavoriteMovie", () => {
    it("removes movie if it exists", async () => {
      get.mockResolvedValueOnce({
        exists: () => true,
      });

      await removeFavoriteMovie(mockUid, mockMovie);

      expect(ref).toHaveBeenCalledWith(expect.anything(), `users/${mockUid}/favoriteMovies/${mockMovie.id}`);
      expect(get).toHaveBeenCalledWith(fakeRef);
      expect(remove).toHaveBeenCalledWith(fakeRef);
    });

    it("throws error if uid or movie is invalid", async () => {
      await expect(removeFavoriteMovie(null, mockMovie)).rejects.toThrow(ERROR_MESSAGES.INVALID_UID_OR_MOVIE);
      await expect(removeFavoriteMovie(mockUid, { title: "Missing ID" })).rejects.toThrow(ERROR_MESSAGES.INVALID_UID_OR_MOVIE);
    });

    it("throws error if movie does not exist", async () => {
      get.mockResolvedValueOnce({
        exists: () => false,
      });

      await expect(removeFavoriteMovie(mockUid, mockMovie)).rejects.toThrow(ERROR_MESSAGES.MOVIE_NOT_FOUND);
    });
  });

  describe("getUserFavorites", () => {
    it("returns empty array if no user is logged in", async () => {
      getAuth.mockReturnValueOnce({
        currentUser: null,
      });

      const result = await getUserFavorites();
      expect(result).toEqual([]);
    });

    it("returns empty array if no favorites exist", async () => {
      getAuth.mockReturnValueOnce({
        currentUser: { uid: mockUid },
      });
      get.mockResolvedValueOnce({
        exists: () => false,
      });

      const result = await getUserFavorites();
      expect(ref).toHaveBeenCalledWith(expect.anything(), `users/${mockUid}/favoriteMovies`);
      expect(result).toEqual([]);
    });

    it("returns favorites if they exist", async () => {
      const mockFavorites = {
        "1": { id: 1, title: "Movie 1" },
        "2": { id: 2, title: "Movie 2" },
      };

      getAuth.mockReturnValueOnce({
        currentUser: { uid: mockUid },
      });
      get.mockResolvedValueOnce({
        exists: () => true,
        val: () => mockFavorites,
      });

      const result = await getUserFavorites();
      expect(result).toEqual(Object.values(mockFavorites));
    });
  });
});