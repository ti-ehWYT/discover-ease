"use client";

import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useAuth } from "../../../../context/auth";

export default function EditButton({
  authorId,
  itineraryId,
}: {
  authorId: string;
  itineraryId: string;
}) {
  const auth = useAuth();
  if (auth?.currentUser?.uid === authorId) {
    return (
      <Link href={`/itinerary/edit-itinerary/${itineraryId}`}>
        {" "}
        <EllipsisVertical className="text-gray-500 hover:text-gray-800" />{" "}
      </Link>
    );
  }
}
