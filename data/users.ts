import { firestore } from "../firebase/server";

export const getCurrentUsers = async (uid: string) => {
  const userRef = firestore.collection("users").doc(uid);
  const snap = await userRef.get();

  if (!snap.exists) {
    return { data: null };
  }

  const userData = snap.data();
  return { data: JSON.parse(JSON.stringify(userData)) };
};