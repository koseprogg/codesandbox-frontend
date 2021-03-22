export type Competition = {
  name: string;
  image: string;
  isActive: boolean;
};

export interface ImageCardProps {
  name: string;
  image: string;
  isTask: boolean;
  day?: number;
}

export type Task = {
  name: string;
  day: number;
  _id: string;
  description: string;
  image: string;
  subtasks: string[];
};

export interface CompetitionCardProps extends ImageCardProps {
  isActive: string;
}

export interface TaskCardProps extends ImageCardProps {
  isActive: string;
}
