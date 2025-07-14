import "server-only";
import { firestore } from "../firebase/server";
import { Post } from "../type/post";
type LikesByCountryDate = {
  [date: string]: {
    [country: string]: number;
  };
};

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
      user_preference:  Array.isArray(data.user_preference) ? data.user_preference : [],
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

export const getTopLikedPosts = async (limitCount: number = 3) => {
  const snap = await firestore
    .collection("posts")
    .orderBy("likeCount", "desc")
    .limit(limitCount)
    .get();

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
    };
  });

  return { data: posts };
};

export const getMostViewPosts = async (limitCount: number = 5) => {
  const snap = await firestore
    .collection("posts")
    .orderBy("viewCount", "desc")
    .limit(limitCount)
    .get();

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
    };
  });

  return { data: posts };
};

export const getLikesOverTimeByCountry = async () => {
  const postsSnap = await firestore.collection("posts").get();

  const grouped: LikesByCountryDate = {};

  for (const postDoc of postsSnap.docs) {
    const postData = postDoc.data();
    const country = postData.country ?? "Unknown";
    const postId = postDoc.id;

    const likesSnap = await firestore
      .collection("posts")
      .doc(postId)
      .collection("likes")
      .get();

    likesSnap.forEach((likeDoc) => {
      const data = likeDoc.data();
      const likedAt = data.likedAt;

      if (!likedAt) return;

      const date = new Date(likedAt).toISOString().split("T")[0]; // "YYYY-MM-DD"

      if (!grouped[date]) grouped[date] = {};
      if (!grouped[date][country]) grouped[date][country] = 0;

      grouped[date][country]++;
    });
  }

  // Convert to chart format
  const chartData = Object.entries(grouped)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([date, countries]) => ({
      date,
      ...countries,
    }));

  return chartData;
};
