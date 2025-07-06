import { getPosts } from "../../../data/posts";
import Question from "./question";

export default async function Foryou() {
  const { data } = await getPosts();
  return <Question data={data} />;

}
