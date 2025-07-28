/* eslint-disable @next/next/no-img-element */
"use client";
import convertOriginalImageUrl from "@/lib/utils/convertOriginalImage";
import MovieHero from "./MovieHero";
import convertImageUrl from "@/lib/utils/imageUrlHelper";
import BudgetVsRevenueBarChart from "./Chart";
import { MovieInfo } from "@/constants/types/MovieInfo";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getMovieDetails } from "@/lib/tmdbCalls/getMovieDetails";
import Spinner from "./auth/Spinner";

const MovieDetails = ({ id }: { id: string }) => {
  const [movieDetails, setMovieDetails] = useState<MovieInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  const t = useTranslations("movieDetails");
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const fetchedMovieDetails = await getMovieDetails(id, locale);
        setMovieDetails(fetchedMovieDetails);
      } catch (error) {
        console.error("Failed to fetch movies: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);
  return (
    <>
      <main>
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <Spinner size={50}/>
          </div>
        ) : movieDetails ? (
          <div>
            <MovieHero
              id={movieDetails.id}
              title={movieDetails.title}
              vote_average={movieDetails.vote_average}
              release_date={movieDetails.release_date?.slice(0, 4) || ""}
              overview={movieDetails.overview}
              backdrop_path={convertOriginalImageUrl(
                movieDetails.backdrop_path
              )}
              homepage={movieDetails.homepage}
              moreInfo={false}
            />
            <div className="relative z-20 px-8 py-16 flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-1/2">
                  <h2 className="text-xl font-semibold mb-4">
                    {t("productionCompanies")}
                  </h2>
                  <div className="flex flex-wrap gap-4 p-[1rem]">
                    {movieDetails.production_companies?.map(
                      (company) =>
                        company.logo_path && (
                          <div
                            key={company.id}
                            className="min-w-[120px] h-64 p-3 flex-1 flex items-center justify-center rounded-xl bg-[#FFBD33]"
                          >
                            <img
                              src={convertImageUrl(company.logo_path)}
                              alt={movieDetails.title}
                              className="w-full h-full object-contain max-w-full max-h-full"
                            />
                          </div>
                        )
                    )}
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <BudgetVsRevenueBarChart
                    budget={movieDetails.budget}
                    revenue={movieDetails.revenue}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>{t("noDetails")}</p>
        )}
      </main>
    </>
  );
};

export default MovieDetails;
