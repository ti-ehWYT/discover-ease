"use server";

import { getAuthorPosts } from "../../../data/posts";
import { getCurrentUsers, updateUserProfile } from "../../../data/users";


export async function fetchUserPosts(uid: string) {
  const { data } = await getAuthorPosts(uid);
  return data;
}

export async function fetchUserProfile(uid: string) {
  const { data } = await getCurrentUsers(uid);
  console.log("TEST", data);
  return data;
}

export async function saveUserProfile(uid: string, updates: {
  bio?: string;
  gender?: string;
  photoURL?: string;
  nickname?: string
}) {
  await updateUserProfile(uid, updates);
}