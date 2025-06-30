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
import { storage } from "../../../../firebase/client";

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
