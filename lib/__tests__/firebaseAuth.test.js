import {
  registerUser,
  loginUser,
  updateUserData,
  readUserData,
} from "../firebaseAuth";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ref, set, get, child } from "firebase/database";
import { ERROR_MESSAGES } from "@/constants/strings";

// Mock Firebase
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));
jest.mock("firebase/database", () => ({
  ref: jest.fn(),
  set: jest.fn(),
  get: jest.fn(),
  child: jest.fn(),
}));
jest.mock("../firebase", () => ({
  auth: {},
  db: {},
}));

describe("authHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("registers user successfully", async () => {
      const mockUser = { uid: "uid123", email: "test@example.com" };
      createUserWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });
      ref.mockReturnValue("refPath");
      set.mockResolvedValueOnce();

      const user = await registerUser(
        "Test",
        "test@example.com",
        "password123"
      );

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "test@example.com",
        "password123"
      );
      expect(ref).toHaveBeenCalledWith(
        expect.anything(),
        `users/${mockUser.uid}`
      );
      expect(set).toHaveBeenCalledWith("refPath", {
        userid: mockUser.uid,
        email: mockUser.email,
        name: "Test",
        favoriteMovies: {},
        myRatings: {},
      });
      expect(user).toEqual(mockUser);
    });

    it("throws error for invalid email", async () => {
      await expect(
        registerUser("Test", "invalid-email", "password123")
      ).rejects.toThrow(ERROR_MESSAGES.INVALID_EMAIL);
    });

    it("throws error for short password", async () => {
      await expect(
        registerUser("Test", "test@example.com", "short")
      ).rejects.toThrow(ERROR_MESSAGES.PASSWORD_SHORT);
    });

    it("throws mapped Firebase error on failure", async () => {
      createUserWithEmailAndPassword.mockRejectedValueOnce({
        code: "auth/email-already-in-use",
      });
      await expect(
        registerUser("Test", "test@example.com", "password123")
      ).rejects.toThrow(ERROR_MESSAGES.EMAIL_IN_USE);
    });
  });

  describe("loginUser", () => {
    it("logs in user successfully", async () => {
      const mockUser = { uid: "uid123", email: "test@example.com" };
      signInWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });

      const user = await loginUser("test@example.com", "password123");

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "test@example.com",
        "password123"
      );
      expect(user).toEqual(mockUser);
    });

    it("throws error for invalid email", async () => {
      await expect(loginUser("invalid-email", "password123")).rejects.toThrow(
        ERROR_MESSAGES.INVALID_EMAIL
      );
    });

    it("throws error for short password", async () => {
      await expect(loginUser("test@example.com", "short")).rejects.toThrow(
        ERROR_MESSAGES.PASSWORD_SHORT
      );
    });

    it("throws mapped Firebase error on failure", async () => {
      signInWithEmailAndPassword.mockRejectedValueOnce({
        code: "auth/user-not-found",
      });
      await expect(
        loginUser("test@example.com", "password123")
      ).rejects.toThrow(ERROR_MESSAGES.USER_NOT_FOUND);
    });
  });

  describe("updateUserData", () => {
    it("updates user data successfully", async () => {
      ref.mockReturnValue("refPath");
      set.mockResolvedValueOnce();

      await updateUserData("uid123", { name: "New Name" });

      expect(ref).toHaveBeenCalledWith(expect.anything(), "users/uid123");
      expect(set).toHaveBeenCalledWith("refPath", { name: "New Name" });
    });

    it("throws error if uid is missing", async () => {
      await expect(updateUserData(null, { name: "Name" })).rejects.toThrow(
        ERROR_MESSAGES.UID_REQUIRED
      );
    });
  });

  describe("readUserData", () => {
    it("returns user data if exists", async () => {
      const mockSnapshot = {
        exists: () => true,
        val: () => ({ name: "Test User" }),
      };
      get.mockResolvedValueOnce(mockSnapshot);
      child.mockReturnValueOnce("childPath");
      ref.mockReturnValueOnce("refObj");

      const data = await readUserData("uid123");

      expect(ref).toHaveBeenCalled();
      expect(child).toHaveBeenCalledWith("refObj", "users/uid123");
      expect(get).toHaveBeenCalledWith("childPath");
      expect(data).toEqual({ name: "Test User" });
    });

    it("returns null if user data does not exist", async () => {
      const mockSnapshot = {
        exists: () => false,
      };
      get.mockResolvedValueOnce(mockSnapshot);
      child.mockReturnValueOnce("childPath");
      ref.mockReturnValueOnce("refObj");

      const data = await readUserData("uid123");

      expect(data).toBeNull();
    });

    it("throws error if uid is missing", async () => {
      await expect(readUserData(null)).rejects.toThrow(
        ERROR_MESSAGES.UID_REQUIRED
      );
    });
  });
});
