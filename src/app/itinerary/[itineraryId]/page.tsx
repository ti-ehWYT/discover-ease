import { firestore } from "../../../../firebase/server";
import { ItineraryType } from "../../../../type/itinerary";
import Image from "next/image";
import { format } from "date-fns";
import FavoriteButton from "@/components/favorite-button";
import EditButton from "./edit-button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatTimestamp } from "@/lib/utils";

export default async function ItineraryDetailPage({
  params,
}: {
  params: Promise<{ itineraryId: string }>;
}) {
  const { itineraryId } = await params;

  const docRef = firestore.collection("itineraries").doc(itineraryId);
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-red-600 font-semibold tracking-wide">
        Itinerary not found.
      </div>
    );
  }

  const itinerary = snapshot.data() as ItineraryType;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      <div className="flex items-center gap-4">
        <Image
          src={itinerary.avatar || "/default-avatar.png"}
          alt="Author avatar"
          width={48}
          height={48}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="text-sm text-gray-700">Created by</p>
          <p className="font-semibold text-gray-900">
            {itinerary.authorName || "Anonymous"}
          </p>
          {itinerary.created && (
            <p className="text-sm text-gray-500">
              Created on {format(itinerary.created.toDate(), "PPP")}
            </p>
          )}
        </div>
      </div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            {itinerary.title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Country: <span className="font-medium">{itinerary.country}</span> |{" "}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <FavoriteButton itineraryId={(await params).itineraryId} />
          <EditButton
            itineraryId={(await params).itineraryId}
            authorId={itinerary.authorId ?? ""}
          />
        </div>
      </div>

      {/* Tags */}
      {itinerary.tags && itinerary.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {itinerary.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-primary text-white text-sm px-3 py-1 rounded-full shadow"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Cover Image */}
      {itinerary.coverImage?.[0] && (
        <div className="rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-200">
          <Image
            src={`https://firebasestorage.googleapis.com/v0/b/discover-ease-ee29d.firebasestorage.app/o/${encodeURIComponent(
              itinerary.coverImage[0]
            )}?alt=media`}
            alt={itinerary.title}
            width={1200}
            height={700}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      )}

      {/* Description */}
      <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line max-w-3xl">
        {itinerary.description}
      </p>

      {/* Days */}
      <div className="space-y-12">
        {itinerary.itinerary.map((day) => (
          <div key={day.day} className="p-6 rounded-2xl bg-white shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Day {day.day}
            </h2>

            {/* Images Carousel */}
            {day.images && day.images?.length > 0 && (
              <Carousel className="mb-6 rounded-xl overflow-visible px-4">
                <CarouselContent>
                  {day.images.map((img, idx) => {
                    const url = `https://firebasestorage.googleapis.com/v0/b/discover-ease-ee29d.firebasestorage.app/o/${encodeURIComponent(
                      img
                    )}?alt=media`;

                    return (
                      <CarouselItem
                        key={idx}
                        className="basis-full sm:basis-1/2 lg:basis-1/3 p-2"
                      >
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="w-full focus:outline-none hover:scale-105 transition-transform duration-300 ease-in-out rounded-lg overflow-hidden shadow-md">
                              <Image
                                src={url}
                                alt={`Day ${day.day} image ${idx + 1}`}
                                width={600}
                                height={400}
                                className="object-cover w-full h-48 rounded-lg"
                              />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-5xl p-0 bg-transparent border-none">
                            <DialogTitle className="sr-only">
                              Day {day.day} Image {idx + 1}
                            </DialogTitle>
                            <Image
                              src={url}
                              alt={`Day ${day.day} full image ${idx + 1}`}
                              width={1600}
                              height={1000}
                              className="w-full h-auto object-contain rounded-3xl"
                            />
                          </DialogContent>
                        </Dialog>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                {day.images && day.images.length! >= 4 && (
                  <>
                    <CarouselPrevious className="text-gray-600 hover:text-gray-900" />
                    <CarouselNext className="text-gray-600 hover:text-gray-900" />
                  </>
                )}
              </Carousel>
            )}

            <ul className="relative pl-10 text-gray-700 space-y-8">
              {/* The vertical dotted line spanning from first dot to last */}
              <span className="absolute left-5 top-5 bottom-0 w-0.5 border-l border-dotted border-gray-300"></span>

              {day.activity.map((act, i) => (
                <li key={i} className="relative">
                  {/* Dot */}
                  <span className="absolute left-0 top-1.5 w-3 h-3 bg-white border-2 border-primary rounded-full"></span>
                  {/* Activity text */}
                  <span className="ml-6">{act}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
