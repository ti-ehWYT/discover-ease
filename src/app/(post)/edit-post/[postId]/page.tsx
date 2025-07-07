import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPostById } from "../../../../../data/posts";
import EditPostForm from "./edit-post-form";

export default async function EditPost({ params }: { params: Promise<any> }) {
  const paramsValue = await params;

  const post = await getPostById(paramsValue.postId);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Edit Post</CardTitle>
      </CardHeader>
      <CardContent>
        <EditPostForm
          id={post.id}
          title={post.title}
          description={post.description}
          country={post.country}
          tags={post.tags}
          images={post.images || []}
        />
      </CardContent>
    </Card>
  );
}
