"use server";

import { auth, firestore } from "../../../firebase/server";
import { z } from "zod";

export const saveItineraryImages = async (
  {
    ItineraryId,
    images,
  }: {
    ItineraryId: string;
    images: {
      coverImage: string[];
      itinerary: {
        day: number;
        activity: string[];
        images: string[];
      }[];
    };
  },
  token: string
) => {
  const verifiedToken = await auth.verifyIdToken(token);
  if (!verifiedToken) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  const schema = z.object({
    ItineraryId: z.string(),
    images: z.object({
      coverImage: z.array(z.string()),
      itinerary: z.array(
        z.object({
          day: z.number(),
          activity: z.array(z.string()),
          images: z.array(z.string()),
        })
      ),
    }),
  });

  const validation = schema.safeParse({ ItineraryId, images });
  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0]?.message ?? "Invalid data format",
    };
  }

  await firestore.collection("itineraries").doc(ItineraryId).update({
    coverImage: images.coverImage,
    itinerary: images.itinerary,
  });

  return {
    success: true,
  };
};  