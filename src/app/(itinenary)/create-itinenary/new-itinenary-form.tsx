"use client";
import React from "react";
import { z } from "zod";
import { useAuth } from "../../../../context/auth";
import { useRouter } from "next/navigation";
import ItinenaryForm from "@/components/itinenary-form";
import { toast } from "sonner";
import { itinenarySchema } from "../../../../validation/itinenarySchema";
import { saveNewitinenary } from "./action";
import { ref, uploadBytesResumable } from "firebase/storage";
import { saveItinenaryImages } from "../action";
import { storage, analytics } from "../../../../firebase/client";

export default function NewitinenaryForm() {
  const auth = useAuth();
  const router = useRouter();
  const handleSubmit = async (data: z.infer<typeof itinenarySchema>) => {
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      toast.error("Please sign in", {
        description: "You must be logged in to submit an itinenary.",
      });
      return;
    }

    // ✅ Check total file size (cover + itinenary images)
    const totalSize = [
      ...data.coverImage,
      ...data.itinenary.flatMap((day) => day.images),
    ].reduce((sum, img) => sum + (img.file?.size || 0), 0);

    if (totalSize > 5 * 1024 * 1024) {
      toast.error("Images too large", {
        description: "Please keep total image size under 5MB.",
      });
      return;
    }

    // ✅ Create empty itinenary to get the ID first
    const response = await saveNewitinenary({
      title: data.title,
      description: data.description,
      country: data.country,
      tags: data.tags,
      itinenary: [],
      coverImage: [],
      token,
    });

    if (response.error || !response.itinenaryId) {
      toast.error("Error", { description: response.message });
      return;
    }

    const itinenaryId = response.itinenaryId;

    // ----------------------
    // ✅ Upload Cover Image
    // ----------------------
    const coverPaths: string[] = [];
    const coverUploadTasks = data.coverImage.map((image, index) => {
      if (!image.file) return Promise.resolve();

      const path = `itineraries/${itinenaryId}/cover/${Date.now()}-${index}-${
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

    data.itinenary.forEach((day, i) => {
      dayImagePaths[i] = [];

      day.images.forEach((image, j) => {
        if (!image.file) return;

        const path = `itineraries/${itinenaryId}/day-${
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
    // ✅ Format itinenary with image paths
    // ----------------------
    const formatteditinenary = data.itinenary.map((day, i) => ({
      day: day.day,
      activity: day.activity,
      images: dayImagePaths[i] || [],
    }));

    // ✅ Save image paths to Firestore
    await saveItinenaryImages(
      {
        itinenaryId: itinenaryId,
        images: {
          coverImage: coverPaths,
          itinenary: formatteditinenary,
        },
      },
      token
    );

    // ✅ Finish
    toast.success("itinenary created", {
      description: "Your itinenary has been successfully created!",
    });

    router.push("/");
  };
  return (
    <div className="w-full max-w-4xl mx-auto">
      <ItinenaryForm
        handleSubmit={handleSubmit}
        submitButtonLabel="Share itinenary"
      />
    </div>
  );
}
