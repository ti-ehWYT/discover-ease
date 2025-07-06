"use client";

import PostDialog from "@/components/post-dialog";
import { Post } from "../../../type/post";
import { useAuth } from "../../../context/auth";


export default function MyPosts({ data }: {data: Post[]}) {
  const auth = useAuth();
  const userId = auth?.currentUser?.uid;
  const list = data.filter((item) => item.authorId === userId);
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
      {list.map((post: Post) => {
        return <PostDialog key={post.id} postItem={post} allowEdit />;
      })}
    </div>
  );
}
