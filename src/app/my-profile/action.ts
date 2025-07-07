"use server";

import { getAuthorPosts } from "../../../data/posts";
import { getCurrentUsers } from "../../../data/users";

export async function fetchUserPosts(uid: string) {
  const { data } = await getAuthorPosts(uid);
  return data;
}

export async function fetchUserProfile(uid: string) {
  const { data } = await getCurrentUsers(uid);
  return data;
}
