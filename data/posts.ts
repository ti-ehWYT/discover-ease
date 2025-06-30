import "server-only";
import { firestore, auth } from "../firebase/server";
import { Post } from "../type/post";
import { cookies } from "next/headers";

export const getPosts = async () => {
  const postQuery = firestore.collection("posts").orderBy("created", "desc");
  const snap = await postQuery.get();
  const posts = snap.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Post)
  );
  return { data: posts };
};

export const getAuthorPosts = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebaseAuthToken")?.value;
  if (!token) {
    return { data: [] };
  }
  const verifiedToken = await auth.verifyIdToken(token);
  if (!verifiedToken) {
    return { data: [] };
  }
  const postQuery = firestore
    .collection("posts")
    .where("authorId", "==", verifiedToken.uid)
    .orderBy("created", "desc");

  const snap = await postQuery.get();
  const posts = snap.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Post)
  );

  return { data: posts };
};

export const getPostById = async (postId: string) => {
  const postSnapshot = await firestore.collection('posts').doc(postId).get();
  const postData = {
    id: postId,
    ...postSnapshot.data(),
  } as Post;
  return postData;
}
