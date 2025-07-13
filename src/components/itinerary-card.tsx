import React from "react";
import Link from "next/link";
import Image from "next/image";
type Props = {
  id: string;
  title: string;
  coverImages?: string[];
};

export default function ItineraryCard({ id, title, coverImages }: Props) {
  return (
    <Link href={`/itinerary/${id}`} passHref>
      <div className="block border rounded-lg shadow-md overflow-hidden max-w-sm hover:shadow-lg transition-shadow duration-300">
        {coverImages && coverImages.length > 0 ? (
          <Image
            src={`https://firebasestorage.googleapis.com/v0/b/discover-ease-ee29d.firebasestorage.app/o/${encodeURIComponent(
                  coverImages[0]
                )}?alt=media`}
            alt={title}
            className="w-full h-48 object-cover"
            width={0}
            height={0}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
            No Cover Image
          </div>
        )}
        <div className="p-4">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
      </div>
    </Link>
  );
}