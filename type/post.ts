export type Post = {
  id: string;
  description?: string;
  title: string;
  country: string;
  images?: string[];
  tags?: string[];
  authorId?: string;
};
