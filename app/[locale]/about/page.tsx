import { getAllMovies } from '@/lib/tmdbCalls/getAllMovies';
import About from '@/components/about/About';

export default async function AboutPage() {
  const movies = await getAllMovies(1);
  return <About movies={movies} />;
} 
