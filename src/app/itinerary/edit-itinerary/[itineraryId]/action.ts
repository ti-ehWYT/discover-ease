'use server';

import { firestore, auth } from '../../../../../firebase/server'; 


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

    const docRef = firestore.collection('itineraries').doc(data.itineraryId);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      return { success: false, message: 'Itinerary not found' };
    }

    const existingData = docSnapshot.data();
    if (existingData?.authorId !==  verifiedToken.uid) {
      return { success: false, message: 'Unauthorized' };
    }

    await docRef.update({
      title: data.title,
      description: data.description,
      country: data.country,
      tags: data.tags,
      user_preference: data.user_preference,
      updatedAt: new Date(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error updating itinerary:', error);
    return { success: false, message: error.message };
  }
}