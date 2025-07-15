import { getPosts } from "../../data/posts";
import { getSearchRanking } from "../../data/trend";
import HomePage from "./home";

export default async function Home() {
  const { data } = await getPosts();
  const searchRanking = await getSearchRanking();

  return (<HomePage
    initialPosts={data}
    searchRanking={searchRanking.slice(0, 3)} // top 3 only
  />
  );
}