import { getPosts } from "../../data/posts";
import PostDialog from "@/components/post-dialog";
import Search from "./search";

export default async function Home() {
  const { data } = await getPosts();
  return <Search initialPosts={data} />;


}
