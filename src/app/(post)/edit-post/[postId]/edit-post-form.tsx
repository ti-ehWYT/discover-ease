"use client";
import { Post } from "../../../../../type/post";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PostForm from "@/components/post-form";
import { postSchema } from "../../../../../validation/postSchema";
import { z } from "zod";
import { auth, storage } from "../../../../../firebase/client";
import { updatePost } from "./action";
import { SaveIcon } from "lucide-react";
import {
  deleteObject,
  ref,
  uploadBytesResumable,
  UploadTask,
} from "firebase/storage";
import { savePostImages } from "../../action";
import { useAuth } from "../../../../../context/auth";

type Props = Post;

export default function EditPostForm({
  id,
  title,
  description,
  country,
  tags = [],
  images = [],
  user_preference = [],
}: Props) {
  const router = useRouter();
  const auth = useAuth();
  const handleSubmit = async (data: z.infer<typeof postSchema>) => {
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      return;
    }
    const { images: newImages, ...rest } = data;

    const response = await updatePost({ ...rest, id }, token);

    if (response?.error) {
      toast.error("Error!", {
        description: response.message,
      });
      return;
    }

    const storageTasks: (UploadTask | Promise<void>)[] = [];
    const imagesToDelete = images.filter(
      (image) => !newImages.find((newImage) => image === newImage.url)
    );
    imagesToDelete.forEach((image) => {
      storageTasks.push(deleteObject(ref(storage, image)));
    });

    const paths: string[] = [];
    newImages.forEach((image, index) => {
      if (image.file) {
        const path = `posts/${id}/${Date.now()}-${index}-${image.file.name}`;
        paths.push(path);
        const storageRef = ref(storage, path);
        storageTasks.push(uploadBytesResumable(storageRef, image.file));
      } else {
        paths.push(image.url);
      }
    });

    await Promise.all(storageTasks);
    await savePostImages({postId: id, images: paths}, token)

    toast.success("Success!", {
      description: "Post updated!",
    });

    router.push(`/profile/${auth?.currentUser?.uid}`);
  };
  return (
    <div className="w-full max-w-4xl mx-auto">
      <PostForm
        handleSubmit={handleSubmit}
        submitButtonLabel={
          <>
            <SaveIcon /> Save Post
          </>
        }
        defaultValues={{
          title,
          description,
          country,
          tags,
          user_preference,
          images: images.map((image) => ({
            id: image,
            url: image,
          })),
        }}
      />
    </div>
  );
}
