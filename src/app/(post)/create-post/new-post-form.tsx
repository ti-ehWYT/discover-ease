"use client";
import PostForm from "@/components/post-form";
import { z } from "zod";
import { formDataSchema } from "../../../../validation/postSchema";
import { useAuth } from "../../../../context/auth";
import { saveNewPost } from "./action";

export default function NewPostForm() {
  const auth = useAuth();
  const handleSubmit = async (data: z.infer<typeof formDataSchema>) => {
    const token = await auth?.currentUser?.getIdToken();
    if (!token) {
      return;
    }
    const response = await saveNewPost({ ...data, token });
    console.log({ response });
  };

  return (
    <div>
      <PostForm handleSubmit={handleSubmit} submitButtonLabel={<>Create</>} />
    </div>
  );
}
