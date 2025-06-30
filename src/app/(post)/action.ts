"use server";

import { auth, firestore } from "../../../firebase/server";
import { z } from "zod";

export const savePostImages = async ({ postId, images }: {
  postId: string,
  images: string[]
}, token: string) => {
  const verifiedToken = await auth.verifyIdToken(token);

  if (!verifiedToken) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }
  const schema = z.object({
    postId: z.string(),
    images: z.array(z.string())
  })

  const validation = schema.safeParse({postId, images})
  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0]?.message ?? "An error occured"
    }
  }

  await firestore.collection("posts").doc(postId).update({
    images,
  })
}