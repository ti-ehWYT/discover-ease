import { Timestamp } from "firebase/firestore";

export type ItineraryType = {
  id: string;
  description?: string;
  title: string;
  country: string;
  coverImage?: string[];
  tags?: string[];
  authorId?: string;
  itinerary: ActivityType[],
  user_preference?: string[],
  favoriteCount?: number,
  avatar?: string,
  authorName?: string,
  created?: Timestamp,
};

export type ActivityType = {
  day: number;
  images?: string[];
  activity: string[];
};
