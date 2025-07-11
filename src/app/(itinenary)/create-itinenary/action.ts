"use server";

import { auth, firestore } from "../../../../firebase/server";
import { itinenarySchema } from "../../../../validation/itinenarySchema";

export const saveNewitinenary = async (data: any) => {
  const { token, ...formData } = data;

  const verifiedToken = await auth.verifyIdToken(token);
  if (!verifiedToken) {
    return { error: true, message: "Unauthorized" };
  }

  const validation = itinenarySchema.safeParse({ ...formData, itinenary: [] });
  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0]?.message ?? "Validation failed",
    };
  }

  const itinenaryDoc = await firestore.collection("itineraries").add({
    ...formData,
    created: new Date(),
    updated: new Date(),
    authorId: verifiedToken.uid,
  });

  return { itinenaryId: itinenaryDoc.id };
}
