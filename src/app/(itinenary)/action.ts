"use server";

import { auth, firestore } from "../../../firebase/server";
import { z } from "zod";

export const saveItinenaryImages = async (
  {
    itinenaryId,
    images,
  }: {
    itinenaryId: string;
    images: {
      coverImage: string[];
      itinenary: {
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
    itinenaryId: z.string(),
    images: z.object({
      coverImage: z.array(z.string()),
      itinenary: z.array(
        z.object({
          day: z.number(),
          activity: z.array(z.string()),
          images: z.array(z.string()),
        })
      ),
    }),
  });

  const validation = schema.safeParse({ itinenaryId, images });
  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0]?.message ?? "Invalid data format",
    };
  }

  await firestore.collection("itineraries").doc(itinenaryId).update({
    coverImage: images.coverImage,
    itinenary: images.itinenary,
  });

  return {
    success: true,
  };
};  