"use server";

import { auth, firestore } from "../../../../firebase/server";
import { itinerarySchema } from "../../../../validation/itinerarySchema";

export const saveNewitinerary = async (data: any) => {
  const { token, ...formData } = data;

  const verifiedToken = await auth.verifyIdToken(token);
  if (!verifiedToken) {
    return { error: true, message: "Unauthorized" };
  }

  const validation = itinerarySchema.safeParse({ ...formData, itinerary: [] });
  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0]?.message ?? "Validation failed",
    };
  }
 const uid = verifiedToken.uid;

  const userDoc = await firestore.collection("users").doc(uid).get();

  let userPhotoURL = "";
  let name = "";
  if (userDoc.exists) {
    const userData = userDoc.data();
    userPhotoURL = userData?.photoURL || "";
    name = userData?.nickname || userData?.displayName;
  }
  const itineraryDoc = await firestore.collection("itineraries").add({
    ...formData,
    created: new Date(),
    updated: new Date(),
    authorId: verifiedToken.uid,
    avatar: userPhotoURL,
    authorName: name,
  });

  return { itineraryId: itineraryDoc.id };
}
