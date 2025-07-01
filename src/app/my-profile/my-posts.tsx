import PostDialog from "@/components/post-dialog";
import { getAuthorPosts } from "../../../data/posts";
import { Post } from "../../../type/post";

export default async function MyPosts() {
  const { data } = await getAuthorPosts();

  return (
    <div>
      {data.map((post: Post) => {
        return <PostDialog key={post.id} postItem={post} allowEdit/>;
      })}
    </div>
  );
}
