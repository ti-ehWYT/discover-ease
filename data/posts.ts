import "server-only";
import { firestore } from "../firebase/server";
import { Post } from "../type/post";

export const getPosts = async (searchTxt?: string) => {
  let postQuery = firestore.collection("posts").orderBy("created", "desc");

  if (searchTxt?.trim()) {
    // Firestore can only do *prefix* matching on a single field with two range filters
    const txt = searchTxt.trim();
    postQuery = postQuery
      .orderBy("title") // secondary orderBy must match the where field
      .startAt(txt)
      .endAt(txt + "\uf8ff");
  }

  const snap = await postQuery.get();

  const posts = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }) as Post)
  return { data: posts }
};
