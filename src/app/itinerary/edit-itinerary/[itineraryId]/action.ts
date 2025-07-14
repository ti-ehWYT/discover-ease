"use server";

import { firestore, auth } from "../../../../../firebase/server";

type UpdateItineraryInput = {
  itineraryId: string;
  title: string;
  description?: string;
  country: string;
  tags: string[];
  user_preference?: string[];
};

export async function updateItinerary(
  data: UpdateItineraryInput,
  token: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const verifiedToken = await auth.verifyIdToken(token);

    const docRef = firestore.collection("itineraries").doc(data.itineraryId);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      return { success: false, message: "Itinerary not found" };
    }

    const existingData = docSnapshot.data();
    if (existingData?.authorId !== verifiedToken.uid) {
      return { success: false, message: "Unauthorized" };
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
    await docRef.update({
      title: data.title,
      description: data.description,
      country: data.country,
      tags: data.tags,
      user_preference: data.user_preference,
      updatedAt: new Date(),
      avatar: userPhotoURL,
      authorName: name,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error updating itinerary:", error);
    return { success: false, message: error.message };
  }
}
