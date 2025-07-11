export type ItinenaryType = {
  id: string;
  description?: string;
  title: string;
  country: string;
  coverImage?: string[];
  tags?: string[];
  authorId?: string;
  itinenary: ActivityType[],
};

export type ActivityType = {
  day: number;
  images?: string[];
  activity: string[];
};
