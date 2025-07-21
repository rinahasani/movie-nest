'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import CoverflowCarousel from '@/components/carousel/CoverflowCarousel';
import { getAllMovies } from '@/lib/getAllMovies';

export default function AboutPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(-1);
  const t = useTranslations('About');
  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Fetch page 1 movies
        const moviesData = await getAllMovies(1);
        setMovies(moviesData);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const faqs = [
    { q: t('faq1Question'), a: t('faq1Answer') },
    { q: t('faq2Question'), a: t('faq2Answer') },
    { q: t('faq3Question'), a: t('faq3Answer') },
    { q: t('faq4Question'), a: t('faq4Answer') },
  ];

  return (
    <main className="bg-black flex flex-col items-center w-full">
      {/* Full-width Movie Slider at the top */}
      <section className="w-full flex flex-col items-center justify-center py-2 bg-black">
        <div className="w-full px-0">
          {loading ? (
            <div className="flex justify-center items-center h-20 text-yellow-400 font-bold text-lg">Loading…</div>
          ) : movies.length > 0 ? (
            <CoverflowCarousel
              movies={movies}
              onMovieClick={(movie: any) => router.push(`/details/${movie.id}`)}
            />
          ) : (
            <div className="flex justify-center items-center h-20 text-gray-400">No movies found.</div>
          )}
        </div>
      </section>

      {/* Description Section */}
      <section className="w-full flex flex-col items-center py-3 bg-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-white text-sm md:text-base leading-relaxed font-bold">
            {t('description.line1')} <span className="text-yellow-400">{t('description.highlight1')}</span> {t('description.line2')}<br />
            {t('description.line3')}<br />
            <span className="text-yellow-400">{t('description.highlight2')}</span><br />
            <span className="text-yellow-400">{t('description.highlight3')}</span>
          </p>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="w-full flex flex-col items-center gap-3 px-4 py-3">
        {/* Card 1: Social Interaction */}
        <div className="bg-yellow-400 rounded-2xl w-full max-w-xl p-3 flex flex-col items-center shadow-lg">
          <div className="bg-black rounded-lg p-2 mb-2 flex items-center justify-center">
            {/* Social Icon (video chat style) */}
            <svg width="28" height="28" fill="none" stroke="yellow" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="3" fill="black" />
              <path d="M8 8h8v8H8z" fill="yellow" />
              <path d="M15 11l3-2v6l-3-2" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-extrabold text-lg text-black mb-2 text-center">{t('feature1Title')}</h2>
          <p className="text-black text-center text-xs font-medium">
            {t('feature1Description')}
          </p>
        </div>

        {/* Card 2: Open Collaboration */}
        <div className="bg-yellow-400 rounded-2xl w-full max-w-xl p-3 flex flex-col items-center shadow-lg">
          <div className="bg-black rounded-lg p-2 mb-2 flex items-center justify-center">
            {/* Code Icon */}
            <svg width="28" height="28" fill="none" stroke="yellow" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="3" fill="black" />
              <path d="M9 9h6v6H9z" fill="yellow" />
              <path d="M10 14l-2-2 2-2M14 10l2 2-2 2" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-extrabold text-lg text-black mb-2 text-center">{t('feature2Title')}</h2>
          <p className="text-black text-center text-xs font-medium">
            {t('feature2Description')}
          </p>
        </div>
      </section>

      {/* FAQ Section (styled as in screenshot) */}
      <section className="w-full flex flex-col items-center py-3 bg-black">
        <h2 className="text-lg font-bold text-yellow-400 mb-3 text-center">{t('faqTitle')}</h2>
        <div className="space-y-2 w-full max-w-3xl">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-yellow-400 rounded-xl p-0 overflow-hidden">
              <button
                className="flex items-center justify-between w-full px-4 py-2 focus:outline-none"
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                aria-expanded={openIndex === i}
              >
                <span className="font-extrabold text-sm md:text-base text-black text-left">
                  {i + 1}. {faq.q}
                </span>
                <span className="ml-2 flex items-center justify-center w-5 h-5 bg-black rounded text-yellow-400">
                  {openIndex === i ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="yellow" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="yellow" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  )}
                </span>
              </button>
              {openIndex === i && (
                <div className="px-4 pb-2">
                  <p className="text-black text-xs font-medium mt-1">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Movie grid + share section */}
      <section className="w-full flex flex-col items-center justify-center py-4 px-4">
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center md:items-stretch gap-8">
          {/* Left side: Two separate movie sections */}
          <div className="flex flex-col gap-4 md:w-[480px] w-full">
            {/* Bottom: Grid of 7 smaller images */}
            <div className="grid grid-cols-4 gap-1 md:w-[440px] w-full" style={{
              gridTemplateAreas: `
                "large large large large"
                "cover1 poster poster cover2"
                "cover3 cover4 cover5 cover6"
              `,
              gridTemplateRows: 'auto auto auto'
            }}>
              {/* Row 1: Large Cover */}
              {movies && movies.length > 1 && (
                <div style={{ gridArea: 'large' }} className="overflow-hidden h-40 border-4 border-yellow-400 rounded-2xl">
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${movies[1].backdrop_path || movies[1].poster_path}`} 
                    alt={movies[1].title} 
                    className="object-cover w-full h-full" 
                  />
                </div>
              )}
              
              {/* Row 2: Cover, Poster, Cover */}
              {movies && movies.length > 2 && (
                <div style={{ gridArea: 'cover1' }} className="overflow-hidden h-28 border-4 border-yellow-400 rounded-2xl">
                  <img src={`https://image.tmdb.org/t/p/w500${movies[2].backdrop_path || movies[2].poster_path}`} alt={movies[2].title} className="object-cover w-full h-full" />
                </div>
              )}
              {movies && movies.length > 3 && (
                <div style={{ gridArea: 'poster' }} className="overflow-hidden h-28 border-4 border-yellow-400 rounded-2xl">
                  <img src={`https://image.tmdb.org/t/p/w500${movies[3].poster_path || movies[3].backdrop_path}`} alt={movies[3].title} className="object-cover w-full h-full" />
                </div>
              )}
              {movies && movies.length > 4 && (
                <div style={{ gridArea: 'cover2' }} className="overflow-hidden h-28 border-4 border-yellow-400 rounded-2xl">
                  <img src={`https://image.tmdb.org/t/p/w500${movies[4].backdrop_path || movies[4].poster_path}`} alt={movies[4].title} className="object-cover w-full h-full" />
                </div>
              )}

              {/* Row 3: 4 Covers */}
              {movies.slice(5, 9).map((movie, i) => (
                <div key={i+5} style={{ gridArea: `cover${i+3}` }} className="overflow-hidden h-24 border-4 border-yellow-400 rounded-2xl">
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`} 
                    alt={movie.title} 
                    className="object-cover w-full h-full" 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right side: Text and button */}
          <div className="flex flex-col justify-center items-start space-y-6 flex-1">
            <div className="text-4xl md:text-5xl font-bold text-white leading-tight">
              <div>{t('shareSection.line1')}</div>
              <div>{t('shareSection.line2')}</div>
              <div className="text-yellow-400">{t('shareSection.line3')}</div>
              <div>{t('shareSection.line4')}</div>
            </div>
            
            <button className="bg-yellow-400 text-black px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-yellow-300 transition-colors" onClick={() => router.push('/signup')}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              {t('signupButton')}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
} 