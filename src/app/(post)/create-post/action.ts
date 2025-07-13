"use server";
import { auth, firestore } from "../../../../firebase/server";
import { formDataSchema } from "../../../../validation/postSchema";

export const saveNewPost = async (data: {
  title: string;
  description?: string;
  country: string;
  token: string;
}) => {
  const { token, ...formData } = data;

  const verifiedToken = await auth.verifyIdToken(token);

  if (!verifiedToken) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }
  const validation = formDataSchema.safeParse(formData);

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
  const post = await firestore.collection("posts").add({
    ...formData,
    created: new Date(),
    updated: new Date(),
    avatar: userPhotoURL, 
    authorName: name,
    authorId: verifiedToken.uid,
  });

  return {
    postId: post.id,
  }
};
