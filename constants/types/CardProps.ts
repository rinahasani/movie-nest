export interface CardInfoProps {
  id: number;
  poster_path: string | null;
  backdrop_path: string | null;
  name: string;
  overview: string;
  vote_average?: number | null;
}

export interface CardProps {
  data: CardInfoProps;
  isExpanded: boolean;
  onClick: (id: number) => void;
  onHover: (id: number | null) => void;
  type: string;
}
