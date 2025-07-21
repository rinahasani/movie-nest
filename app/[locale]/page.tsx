import FeaturedMovieHero from "@/components/FeaturedMovieHero";
import MoviesByGenre from "@/components/genres/MoviesByGenre";
import PopularCarousel from "@/components/PopularCarousel";
import SimilarCarousel from "@/components/SimilarCarousel";

export default function Home() {
  return (
    <main className="bg-black">
      <FeaturedMovieHero />
      <SimilarCarousel />
      <PopularCarousel />
      <MoviesByGenre />
    </main>
  );
}
