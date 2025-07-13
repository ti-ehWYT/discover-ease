"use server";

import { firestore } from "../../../../../firebase/server";

export async function updateUserProfile(
  userId: string,
  data: { bio?: string; gender?: string; photoURL?: string }
) {
  const userRef = firestore.collection("users").doc(userId);
  await userRef.update(data);
}