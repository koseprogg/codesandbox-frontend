export type Competition = {
  name: string;
  image: string;
  isActive: boolean;
};

export type ImageCardProps = {
  name: string;
  image: string;
  isActive: string;
  isTask: boolean;
  day?: number;
};
