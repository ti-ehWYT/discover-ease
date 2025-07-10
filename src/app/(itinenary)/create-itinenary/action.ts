"use server";

import { auth, firestore } from "../../../../firebase/server";
import { itinerarySchema } from "../../../../validation/itinerarySchema";

export const saveNewItinerary = async (data: any) => {
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

  const itineraryDoc = await firestore.collection("itineraries").add({
    ...formData,
    created: new Date(),
    updated: new Date(),
    authorId: verifiedToken.uid,
  });

  return { itineraryId: itineraryDoc.id };
}
