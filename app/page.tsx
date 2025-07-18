import FeaturedMovieHero from "@/components/FeaturedMovieHero";
import PopularCarousel from "@/components/PopularCarousel";
import SimilarCarousel from "@/components/SimilarCarousel";


export default function Home() {
  return (
    <main className="bg-black">
      <FeaturedMovieHero />
      <SimilarCarousel />
      <PopularCarousel />
    </main>
  );
}
