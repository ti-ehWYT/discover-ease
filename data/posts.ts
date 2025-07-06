import "server-only";
import { firestore, auth } from "../firebase/server";
import { Post } from "../type/post";

export const getPosts = async () => {
  const postQuery = firestore.collection("posts").orderBy("created", "desc");
  const snap = await postQuery.get();

  const posts: Post[] = snap.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      title: data.title ?? "",
      description: data.description ?? "",
      country: data.country ?? "",
      images: Array.isArray(data.images) ? data.images : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      authorId: data.authorId ?? "",
    };
  });

  return { data: posts };
};

export const getAuthorPosts = async (uid: string) => {
  const postQuery = firestore
    .collection("posts")
    .where("authorId", "==", uid)
    .orderBy("created", "desc");

  const snap = await postQuery.get();

  const posts: Post[] = snap.docs.map((doc) => {
    const data = doc.data();

    return {
      id: data.id,
      description: data.description,
      title: data.title,
      country: data.country,
      images: data.images,
      tags: data.tags,
      authorId: data.authorId,
    };
  });

  return { data: posts };
};

export const getPostById = async (postId: string) => {
  const postSnapshot = await firestore.collection("posts").doc(postId).get();
  const postData = {
    id: postId,
    ...postSnapshot.data(),
  } as Post;
  return postData;
};
