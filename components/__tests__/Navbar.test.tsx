import { render, screen } from "@testing-library/react";
import Navbar from "../Navbar";
import { usePathname, useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/app/contexts/AuthContext";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useParams: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      "navbar.home": "Home",
      "navbar.movies": "Movies",
      "navbar.tvShows": "TV Shows",
      "navbar.myFavorite": "My Favorite",
      "navbar.about": "About",
      "navbar.login": "Login",
    };
    return translations[key] || key;
  },
}));

// Mock useAuth
jest.mock("@/app/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock next/image, removing priority to avoid DOM warnings
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { priority, ...rest } = props;
    return <img {...rest} alt={rest.alt || "image"} />;
  },
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
    const logo = screen.getByAltText(/movie logo/i);
    expect(logo).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Navbar />);
    expect(screen.getByText("home")).toBeInTheDocument();
    expect(screen.getByText("movies")).toBeInTheDocument();
    expect(screen.getByText("tvShows")).toBeInTheDocument();
    expect(screen.getByText("about")).toBeInTheDocument();
  });

  it("renders login button when user is not authenticated", () => {
    render(<Navbar />);
    expect(screen.getByText("login")).toBeInTheDocument();
  });
});

//npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event ts-jest jest-environment-jsdom
//npm i --save-dev @types/jest
//npm install --save-dev ts-node
//npm install --save-dev whatwg-fetch

