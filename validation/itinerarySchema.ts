import { z } from "zod";

export const formDataSchema = z.object({
  title: z.string().min(1, "Title must be set"),
  description: z.string().optional(),
  country: z.string().min(1, "Country must be selected"),
  coverImage: z.array(
        z.object({
          id: z.string(),
          url: z.string(),
          file: z.instanceof(File).optional(),
        })
      ).max(1, "Only one images is allowed"),
  tags: z.array(z.string()).min(1, "Select at least 1 tag"),
});

export const activitySchema = z.object({
  itinerary: z.array(
    z.object({
      id: z.string(),
      day: z.number(),
      images: z.array(
        z.object({
          id: z.string(),
          url: z.string(),
          file: z.instanceof(File).optional(),
        })
      ),
      activity: z
        .array(z.string())
        .min(1, "Please plan one activity for the day"),
    })
  ),
});

export const itinerarySchema = formDataSchema.and(activitySchema)