import { z } from "zod";

export const formDataSchema = z.object({
  title: z.string().min(1, "Title must be set"),
  description: z
    .string().optional(),
  country: z.string().min(1, "Country must be selected"),
});

export const postImagesSchema = z.object({
  images:  z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      file: z.instanceof(File).optional(),
    })
  )
});

export const postSchema = formDataSchema.and(postImagesSchema);