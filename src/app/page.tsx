import { getPosts } from "../../data/posts";
import PostDialog from "@/components/post-dialog";

export default async function Home() {
  const { data } = await getPosts();

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
      {data.map((item) => (
        <div key={item.id} className="mb-4 break-inside-avoid">
           <PostDialog   postItem={item} allowEdit={false} />
          </div>
       
      ))}
    </div>
  );
}
