"use server";

import { auth, firestore } from "../../../../../firebase/server";
import { Post } from "../../../../../type/post";
import { formDataSchema } from "../../../../../validation/postSchema";

export const updatePost = async (data: Post, authToken: string) => {
  const { id, ...postData } = data;
  const verifiedToken = await auth.verifyIdToken(authToken);

  if (!verifiedToken) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  const validation = formDataSchema.safeParse(postData);
  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0]?.message ?? "An error occurred",
    };
  }

  await firestore
    .collection("posts")
    .doc(id)
    .update({
      ...postData,
      updated: new Date(),
    });


};
