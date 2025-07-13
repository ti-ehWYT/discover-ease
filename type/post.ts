export type Post = {
  id: string;
  description?: string;
  title: string;
  country: string;
  images?: string[];
  tags?: string[];
  user_preference?: string[];
  authorId?: string;
  likeCount?: number;
  viewCount?: number;
  avatar?: string;
  created?: string;
  authorName?: string;
};
