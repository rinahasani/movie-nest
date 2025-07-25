import { render, screen } from "@testing-library/react";
import { usePathname, useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/app/contexts/AuthContext";
import Navbar from "../navbar/Navbar";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useParams: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock next-intl: map the *short* keys ("home", "movies", etc.) to capitalized labels
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      home: "Home",
      collections: "Collections",
      tvShows: "TV Shows",
      about: "About",
      login: "Login",
      myFavorite: "My Favorite",
      movies: "Movies",
    };
    return translations[key] ?? key;
  },
}));

// Mock useAuth
jest.mock("@/app/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { priority, ...rest } = props;
    return <img {...rest} alt={rest.alt ?? "image"} />;
  },
}));

// Mock favorites so no Firebase calls
jest.mock("@/lib/favoriteMovies", () => ({
  getUserFavorites: jest.fn().mockResolvedValue([]),
}));

describe("Navbar", () => {
  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ locale: "en" });
    (usePathname as jest.Mock).mockReturnValue("/en");
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      signOut: jest.fn(),
    });
  });

  it("renders logo correctly", () => {
    render(<Navbar />);
    expect(screen.getByAltText(/movie logo/i)).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Navbar />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Collections")).toBeInTheDocument();
    expect(screen.getByText("TV Shows")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("renders login button when user is not authenticated", () => {
    render(<Navbar />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});
