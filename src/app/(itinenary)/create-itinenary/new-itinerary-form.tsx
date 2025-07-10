"use client";
import React from "react";
import { z } from "zod";
import { useAuth } from "../../../../context/auth";
import { useRouter } from "next/navigation";
import ItineraryForm from "@/components/itinerary-form";
import { toast } from "sonner";
import { itinerarySchema } from "../../../../validation/itinerarySchema";
import { saveNewItinerary } from "./action";
import { ref, uploadBytesResumable } from "firebase/storage";
import { saveItineraryImages } from "../action";
import { storage, analytics } from "../../../../firebase/client";

export default function NewItineraryForm() {
  const auth = useAuth();
  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof itinerarySchema>) => {
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      toast.error("Please sign in", {
        description: "You must be logged in to submit an itinerary.",
      });
      return;
    }

    const { itinerary } = data;
    const strippedCoverImage = data.coverImage.map(({ id, url }) => ({
      id,
      url,
    }));
    const strippedItinerary = data.itinerary.map((day) => ({
      id: day.id,
      day: day.day,
      images: day.images.map(({ id, url }) => ({ id, url })),
      activity: day.activity,
    }));

    const response = await saveNewItinerary({
      title: data.title,
      description: data.description,
      country: data.country,
      tags: data.tags,
      coverImage: strippedCoverImage,
      itinerary: strippedItinerary,
      token,
    });

    if (response.error || !response.itineraryId) {
      toast.error("Error", { description: response.message });
      return;
    }

    const allImageTasks: Promise<any>[] = [];
    const dayImagePaths: Record<string, string[]> = {};

    for (let i = 0; i < itinerary.length; i++) {
      const day = itinerary[i];
      const dayPaths: string[] = [];

      for (let j = 0; j < day.images.length; j++) {
        const image = day.images[j];
        if (image.file) {
          const path = `itineraries/${response.itineraryId}/day-${
            i + 1
          }/${Date.now()}-${j}-${image.file.name}`;
          const storageRef = ref(storage, path);
          const uploadTask = uploadBytesResumable(storageRef, image.file);

          // Convert UploadTask to Promise
          const uploadPromise = new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              null,
              (error) => reject(error),
              () => resolve(null)
            );
          });

          allImageTasks.push(uploadPromise);
          dayPaths.push(path);
        }
      }

      dayImagePaths[i.toString()] = dayPaths;
    }

    await Promise.all(allImageTasks);
    await saveItineraryImages(
      { itineraryId: response.itineraryId, images: dayImagePaths },
      token
    );

    toast.success("Itinerary created", {
      description: "Your itinerary has been successfully created!",
    });

    router.push("/");
  };
  return (
    <div>
      <ItineraryForm
        handleSubmit={handleSubmit}
        submitButtonLabel="Share Itinerary"
      />
    </div>
  );
}
