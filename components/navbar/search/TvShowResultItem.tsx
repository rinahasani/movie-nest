import React from "react";
import Image from "next/image";
import convertImageUrl from "@/lib/utils/imageUrlHelper";
import { TvShow } from "@/constants/types/TvShow";

interface TvShowResultItemProps {
  show: TvShow;
  isFavorite: boolean;
  onFavoriteClick: (e: React.MouseEvent) => void;
  onClick: (e: React.MouseEvent) => void;
  user: any;
}

const TvShowResultItem: React.FC<TvShowResultItemProps> = ({ show, isFavorite, onFavoriteClick, onClick, user }) => (
  <li
    className="flex items-center p-2 rounded-md hover:bg-gray-800 cursor-pointer"
    onClick={onClick}
  >
    {show.poster_path ? (
      <Image
        src={convertImageUrl(show.poster_path)}
        alt={show.name}
        width={40}
        height={60}
        className="mr-3 rounded"
      />
    ) : (
      <div className="w-10 h-[60px] mr-3 rounded bg-gray-800 flex items-center justify-center">
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.55 5.55a8 8 0 10-11.3 11.3M6.34 6.34l11.3 11.3" />
        </svg>
      </div>
    )}
    <div className="flex-1">
      <h3 className="text-white font-bold text-sm">{show.name}</h3>
      <p className="text-gray-400 text-xs">{show.first_air_date?.slice(0, 4)}</p>
    </div>
    {user && (
      <button
        className="fav-btn ml-2 text-yellow-400 hover:text-yellow-500 focus:outline-none"
        onClick={onFavoriteClick}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        tabIndex={0}
        type="button"
      >
      </button>
    )}
  </li>
);

export default TvShowResultItem; 