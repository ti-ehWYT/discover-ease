"use client";

import { PencilIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Post } from "../../type/post";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";

export default function PostDialog({
  postItem,
  allowEdit = false,
}: {
  postItem: Post;
  allowEdit: boolean;
}) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = postItem.images?.length || 0;

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: index * carouselRef.current.clientWidth,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const scrollLeft = () => {
    const prevIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
    scrollToIndex(prevIndex);
  };

  const scrollRight = () => {
    const nextIndex = currentIndex === totalImages - 1 ? 0 : currentIndex + 1;
    scrollToIndex(nextIndex);
  };

  return (
    <Dialog key={postItem.id}>
      <DialogTrigger asChild>
        <Card className="mb-4 break-inside-avoid cursor-pointer">
          <CardHeader>
            {postItem.images?.length! > 0 ? (
              <Image
                src={`https://firebasestorage.googleapis.com/v0/b/discover-ease-ee29d.firebasestorage.app/o/${encodeURIComponent(
                  postItem.images![0]
                )}?alt=media`}
                alt="cover"
                width={0}
                height={0}
                sizes="100vw"
                className="h-auto w-auto max-w-full rounded-md"
              />
            ) : (
              "Default Image here..."
            )}
          </CardHeader>
          <CardContent>
            <h2 className="text-lg font-semibold">{postItem.title}</h2>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent
        className=" flex max-h-3/4 max-w overflow-hidden"
        style={{ minWidth: "60vw" }}
      >
        <div className="flex-1 relative">
          <div
            ref={carouselRef}
            className="flex overflow-x-auto space-x-4 snap-x snap-mandatory scroll-smooth"
          >
            {postItem.images?.map((image, index) => (
              <div
                key={image}
                className="snap-start relative min-w-full h-[70vh] rounded-md"
              >
                <Image
                  src={`https://firebasestorage.googleapis.com/v0/b/discover-ease-ee29d.firebasestorage.app/o/${encodeURIComponent(
                    image
                  )}?alt=media`}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            ))}
          </div>

          {postItem.images && postItem.images.length > 1 && (
            <>
              <button
                onClick={scrollLeft}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full z-10 hover:bg-white"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={scrollRight}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full z-10 hover:bg-white"
              >
                <ChevronRight />
              </button>
            </>
          )}

        </div>
        <div className="flex-1 ml-4 flex flex-col overflow-hidden">
          <DialogTitle className="flex justify-between">
            {postItem.title}
            {allowEdit && (
              <Link href={`/edit-post/${postItem.id}`}>
                <PencilIcon />
              </Link>
            )}
          </DialogTitle>

          <div className="text-sm text-muted-foreground">
            {postItem.country}
          </div>

          <DialogDescription
            className="mt-2 flex-1 overflow-y-auto whitespace-pre-wrap pr-2"
            style={{ scrollbarWidth: "thin" }}
          >
            {postItem.description}
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
}
