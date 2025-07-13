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

  const uid = verifiedToken.uid;

  const userDoc = await firestore.collection("users").doc(uid).get();

  let userPhotoURL = "";
  let name = "";
  if (userDoc.exists) {
    const userData = userDoc.data();
    userPhotoURL = userData?.photoURL || "";
    name = userData?.nickname || userData?.displayName;
  }

  await firestore.collection("posts").doc(id).update({
    ...postData,
    avatar: userPhotoURL, 
    authorName: name,
    updated: new Date(),
  });

  return {
    error: false,
  };
};