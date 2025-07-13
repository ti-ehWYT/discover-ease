export type ItineraryType = {
  id: string;
  description?: string;
  title: string;
  country: string;
  coverImage?: string[];
  tags?: string[];
  authorId?: string;
  itinerary: ActivityType[],
  favoriteCount?: number,
};

export type ActivityType = {
  day: number;
  images?: string[];
  activity: string[];
};
