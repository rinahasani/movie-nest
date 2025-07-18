/* eslint-disable @next/next/no-img-element */
"use client";
import convertOriginalImageUrl from "@/lib/utils/convertOriginalImage";
import MovieHero from "./MovieHero";
import convertImageUrl from "@/lib/utils/imageUrlHelper";
import BudgetVsRevenueBarChart from "./Chart";
import { MovieInfo } from "@/constants/types/MovieInfo";

const MovieDetails: React.FC<{ movieDetails: MovieInfo | null }> = ({
  movieDetails,
}) => {
  return (
    <>
      <main>
        {movieDetails ? (
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
                    Production Companies
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
          <p>No movie details found.</p>
        )}
      </main>
    </>
  );
};

export default MovieDetails;
