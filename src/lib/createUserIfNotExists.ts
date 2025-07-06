import { db } from "../../firebase/client";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { User } from "firebase/auth";

export const createUserIfNotExists = async (
  user: User,
  method: "google" | "email"
) => {
  try {
    if (!user.uid) {
      console.error("Error: user.uid is missing!");
      return null;
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const newUserData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName ?? "",
        photoURL: user.photoURL ?? "",
        loginMethod: method,
        createdAt: serverTimestamp(),
      };

      await setDoc(userRef, newUserData);
      return newUserData;
    } else {
      return userSnap.data();
    }
  } catch (error) {
    console.error("Error in createUserIfNotExists:", error);
    return null;
  }
};