import { getPosts } from "../../data/posts";
import { getLatestSearchRanking } from "../../data/trend";
import HomePage from "./home";

export default async function Home() {
  const { data } = await getPosts();
  const searchRanking = await getLatestSearchRanking();

  return (<HomePage
    initialPosts={data}
    searchRanking={searchRanking} 
  />
  );
}