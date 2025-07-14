"use client";
import ItineraryForm from "@/components/itinerary-form";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { saveItineraryImages } from "../../action";
import { ref, uploadBytesResumable } from "firebase/storage";

import { ItineraryType } from "../../../../../type/itinerary";
import { useAuth } from "../../../../../context/auth";
import { itinerarySchema } from "../../../../../validation/itinerarySchema";
import { storage } from "../../../../../firebase/client";
import { updateItinerary } from "./action";

export default function EditItineraryForm({
  id,
  description,
  title,
  country,
  coverImage = [],
  tags = [],
  user_preference = [],
  itinerary = [],
}: ItineraryType) {
  const router = useRouter();
  const auth = useAuth();

  const handleSubmit = async (data: z.infer<typeof itinerarySchema>) => {
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      toast.error("Please sign in");
      return;
    }

    const totalSize = [
      ...data.coverImage,
      ...data.itinerary.flatMap((day) => day.images),
    ].reduce((sum, img) => sum + (img.file?.size || 0), 0);

    if (totalSize > 32 * 1024 * 1024) {
      toast.error("Images too large", {
        description: "Please keep total image size under 32MB.",
      });
      return;
    }

    const coverPaths: string[] = [];
    const coverUploadTasks = data.coverImage.map((image, index) => {
      if (!image.file) {
        coverPaths.push(image.url); // Keep existing URL
        return Promise.resolve();
      }

      const path = `itineraries/${id}/cover/${Date.now()}-${index}-${image.file.name}`;
      coverPaths.push(path);
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, image.file);

      return new Promise<void>((resolve, reject) => {
        uploadTask.on("state_changed", null, reject, resolve);
      });
    });

    const dayImagePaths: Record<number, string[]> = {};
    const dayUploadTasks: Promise<void>[] = [];

    data.itinerary.forEach((day, i) => {
      dayImagePaths[i] = [];

      day.images.forEach((image, j) => {
        if (!image.file) {
          dayImagePaths[i].push(image.url); // Keep existing
          return;
        }

        const path = `itineraries/${id}/day-${day.day}/${Date.now()}-${j}-${image.file.name}`;
        dayImagePaths[i].push(path);
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, image.file);

        const uploadPromise = new Promise<void>((resolve, reject) => {
          uploadTask.on("state_changed", null, reject, resolve);
        });

        dayUploadTasks.push(uploadPromise);
      });
    });

    await Promise.all([...coverUploadTasks, ...dayUploadTasks]);

    const formattedItinerary = data.itinerary.map((day, i) => ({
      day: day.day,
      activity: day.activity,
      images: dayImagePaths[i] || [],
    }));

    await updateItinerary(
      {
        itineraryId: id,
        title: data.title,
        description: data.description,
        country: data.country,
        tags: data.tags,
        user_preference: data.user_preference,
      },
      token
    );

    await saveItineraryImages(
      {
        itineraryId: id,
        images: {
          coverImage: coverPaths,
          itinerary: formattedItinerary,
        },
      },
      token
    );

    toast.success("Itinerary updated successfully!");
    router.push("/");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ItineraryForm
        handleSubmit={handleSubmit}
        submitButtonLabel="Update itinerary"
        defaultValues={{
          title: title || '',
          description: description || '',
          country,
          tags,
          user_preference,
          coverImage: coverImage.map((url) => ({ id: url, url: url })),
          itinerary: itinerary.map((item) => ({
            day: item.day,
            images: item.images!.map((url) => ({
            id: url,
            url: url,
          })),
            activity: item.activity,
          })),
        }}
      />
    </div>
  );
}