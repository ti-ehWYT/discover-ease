"use client";
import React from "react";
import { z } from "zod";
import { useAuth } from "../../../../context/auth";
import { useRouter } from "next/navigation";
import ItineraryForm from "@/components/itinerary-form";
import { toast } from "sonner";
import { itinerarySchema } from "../../../../validation/itinerarySchema";
import { saveNewitinerary } from "./action";
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

    // ✅ Check total file size (cover + itinerary images)
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

    // ✅ Create empty itinerary to get the ID first
    const response = await saveNewitinerary({
      title: data.title,
      description: data.description,
      country: data.country,
      tags: data.tags,
      itinerary: [],
      coverImage: [],
      token,
    });

    if (response.error || !response.itineraryId) {
      toast.error("Error", { description: response.message });
      return;
    }

    const itineraryId = response.itineraryId;

    // ----------------------
    // ✅ Upload Cover Image
    // ----------------------
    const coverPaths: string[] = [];
    const coverUploadTasks = data.coverImage.map((image, index) => {
      if (!image.file) return Promise.resolve();

      const path = `itineraries/${itineraryId}/cover/${Date.now()}-${index}-${
        image.file.name
      }`;
      coverPaths.push(path);

      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, image.file);

      return new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => reject(error),
          () => resolve()
        );
      });
    });

    // ----------------------
    // ✅ Upload Day Images
    // ----------------------
    const dayImagePaths: Record<number, string[]> = {};
    const dayUploadTasks: Promise<void>[] = [];

    data.itinerary.forEach((day, i) => {
      dayImagePaths[i] = [];

      day.images.forEach((image, j) => {
        if (!image.file) return;

        const path = `itineraries/${itineraryId}/day-${
          day.day
        }/${Date.now()}-${j}-${image.file.name}`;
        dayImagePaths[i].push(path);

        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, image.file);

        const uploadPromise = new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            () => resolve()
          );
        });

        dayUploadTasks.push(uploadPromise);
      });
    });

    // ✅ Wait for all uploads to finish
    await Promise.all([...coverUploadTasks, ...dayUploadTasks]);

    // ----------------------
    // ✅ Format itinerary with image paths
    // ----------------------
    const formatteditinerary = data.itinerary.map((day, i) => ({
      day: day.day,
      activity: day.activity,
      images: dayImagePaths[i] || [],
    }));

    // ✅ Save image paths to Firestore
    await saveItineraryImages(
      {
        itineraryId: itineraryId,
        images: {
          coverImage: coverPaths,
          itinerary: formatteditinerary,
        },
      },
      token
    );

    // ✅ Finish
    toast.success("itinerary created", {
      description: "Your itinerary has been successfully created!",
    });

    router.push("/");
  };
  return (
    <div className="w-full max-w-4xl mx-auto">
      <ItineraryForm
        handleSubmit={handleSubmit}
        submitButtonLabel="Share itinerary"
      />
    </div>
  );
}
