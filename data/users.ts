import { firestore } from "../firebase/server";

// Get a user by their UID (document ID in 'users' collection)

export const getCurrentUsers = async (uid: string) => {
  const userRef = firestore.collection("users").doc(uid);
  const snap = await userRef.get();

  if (!snap.exists) {
    return { data: null };
  }

  // 🔥 Convert to plain object
  const userData = snap.data();

  // Optional: remove metadata or convert timestamps if needed
  return { data: JSON.parse(JSON.stringify(userData)) };
};