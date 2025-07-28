"use client";

import CoverflowCarousel from '@/components/carousel/CoverflowCarousel';
import { useRouter } from 'next/navigation';

export default function AboutCarousel({ movies }: { movies: any[] }) {
  const router = useRouter();
  return (
    <section className="w-full flex flex-col items-center justify-center py-2 bg-black">
      <div className="w-full px-0">
        {movies.length > 0 ? (
          <CoverflowCarousel
            movies={movies}
            onMovieClick={(movie: any) => router.push(`/details/${movie.id}`)}
          />
        ) : (
          <div className="flex justify-center items-center h-20 text-gray-400">No movies found.</div>
        )}
      </div>
    </section>
  );
} 