"use client";
import PostForm from "@/components/post-form";
import { z } from "zod";
import { formDataSchema } from "../../../../validation/postSchema";
import { useAuth } from "../../../../context/auth";
import { saveNewPost } from "./action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NewPostForm() {
  const auth = useAuth();
  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof formDataSchema>) => {
    const token = await auth?.currentUser?.getIdToken();
    if (!token) {
         toast.error("You'll need to sign in first", {
        description: 'Please log in with your account to create a post.'
      })
      return;
    }
    const response = await saveNewPost({ ...data, token });
    if (response.error || !response.postId) {
      toast.error("Error!", {
        description: response.message
      })
      return;
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
