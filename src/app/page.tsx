  import { getPosts } from "../../data/posts";
  import { getLatestSearchRanking } from "../../data/trend";
  import HomePage from "./home";

export default async function Home() {
  const [postsResult, searchRanking] = await Promise.all([
    getPosts(),
    getLatestSearchRanking(),
  ]);

  return (
    <HomePage
      initialPosts={postsResult.data}
      searchRanking={searchRanking}
    />
  );
}