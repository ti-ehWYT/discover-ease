import { getPosts } from "../../data/posts";
import HomePage from "./home";

export default async function Home() {
  const { data } = await getPosts();
  return <HomePage initialPosts={data} />;
}
