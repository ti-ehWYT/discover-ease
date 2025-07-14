import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";

type Props = {
  id: string;
  title: string;
  country?: string;
  tags?: string[];
  coverImages?: string[];
  favoriteCount?: number;
};

export default function ItineraryCard({
  id,
  title,
  country,
  tags = [],
  coverImages,
  favoriteCount = 0,
}: Props) {
  const coverUrl =
    coverImages && coverImages.length > 0
      ? `https://firebasestorage.googleapis.com/v0/b/discover-ease-ee29d.firebasestorage.app/o/${encodeURIComponent(
          coverImages[0]
        )}?alt=media`
      : null;

  return (
    <Link href={`/itinerary/${id}`} passHref>
      <div className="group rounded-2xl overflow-hidden border bg-white hover:shadow-xl shadow-md transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
        {/* Cover Image */}
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title}
            width={400}
            height={250}
            className="w-full h-56 object-cover group-hover:brightness-95 transition duration-300"
          />
        ) : (
          <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-400 text-sm italic">
            No Cover Image
          </div>
        )}

        {/* Content */}
        <div className="p-4 space-y-2">
          <h2 className="text-xl font-semibold text-gray-800 group-hover:text-primary transition">
            {title}
          </h2>

          {country && (
            <p className="text-sm text-muted-foreground">📍 {country}</p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="text-xs bg-primary text-white rounded-full px-2 py-0.5"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Favorite Count */}
          {favoriteCount > 0 && (
            <div className="flex items-center gap-1 text-sm text-pink-600 mt-2">
              <FaHeart className="w-4 h-4" />
              {favoriteCount}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
