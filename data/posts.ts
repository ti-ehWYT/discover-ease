import "server-only";
import { firestore } from "../firebase/server";
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
      likeCount: data.likeCount ?? 0,
      viewCount: data.viewCount ?? 0,
      avatar: data.avatar ?? "",
      user_preference: Array.isArray(data.user_preference)
        ? data.user_preference
        : [],
      created: data.created?.toDate().toISOString() ?? null,
      authorName: data.authorName ?? "",
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
      id: doc.id,
      title: data.title ?? "",
      description: data.description ?? "",
      country: data.country ?? "",
      images: Array.isArray(data.images) ? data.images : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      authorId: data.authorId ?? "",
      likeCount: data.likeCount ?? 0,
      viewCount: data.viewCount ?? 0,
      avatar: data.avatar ?? "",
      user_preference: Array.isArray(data.user_preference)
        ? data.user_preference
        : [],
      created: data.created?.toDate().toISOString() ?? null,
      authorName: data.authorName ?? "",
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


