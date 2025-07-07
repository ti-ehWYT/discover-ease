"use client";
import PostForm from "@/components/post-form";
import { z } from "zod";
import { postSchema } from "../../../../validation/postSchema";
import { useAuth } from "../../../../context/auth";
import { saveNewPost } from "./action";
import { savePostImages } from "../action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ref, uploadBytesResumable, UploadTask } from "firebase/storage";
import { storage, analytics } from "../../../../firebase/client";
import { logEvent } from "firebase/analytics";

export default function NewPostForm() {
  const auth = useAuth();
  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof postSchema>) => {
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      toast.error("You'll need to sign in first", {
        description: "Please log in with your account to create a post.",
      });
      return;
    }
    const { images, ...rest } = data;
    const response = await saveNewPost({ ...rest, token });
    if (response.error || !response.postId) {
      toast.error("Error!", {
        description: response.message,
      });
      return;
    }
    const totalSize = images.reduce((sum, image) => {
      return sum + (image.file?.size || 0);
    }, 0);

    if (totalSize > 5 * 1024 * 1024) {
      // 5MB
      toast.error("Images too large", {
        description: "Please keep total image size under 5MB.",
      });
      return;
    }

    const uploadTasks: UploadTask[] = [];
    const paths: string[] = [];
    images.forEach((image, index) => {
      if (image.file) {
        const path = `posts/${response.postId}/${Date.now()}-${index}-${
          image.file.name
        }`;
        paths.push(path);
        const storageRef = ref(storage, path);
        uploadTasks.push(uploadBytesResumable(storageRef, image.file));
      }
    });

    await Promise.all(uploadTasks);
    await savePostImages({ postId: response.postId, images: paths }, token);
    if (analytics) {
      logEvent(analytics, "post_created", {
        country: data.country, // where the user is posting from
        tag_count: data.tags?.length || 0, // how many tags
        has_images: images.length > 0, // whether post has images
        title_length: data.title.length, // optional: length of title
      });
    }
    toast.success("Success!", {
      description: "You've created your post",
    });

    router.push("/");
  };

  return (
    <div>
      <PostForm handleSubmit={handleSubmit} submitButtonLabel={<>Create</>} />
    </div>
  );
}
