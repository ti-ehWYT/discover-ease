import { firestore } from "../../../../firebase/server";
import { ItineraryType } from "../../../../type/itinerary";
import Image from "next/image";

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
import FavoriteButton from "@/components/favorite-button";

type Props = {
  params: {
    itineraryId: string;
  };
};

export default async function ItineraryDetailPage({ params }: Props) {
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
    <div className="max-w-4xl mx-auto px-8 py-12 bg-cream-50 rounded-3xl shadow-lg">
      {/* Title & Favorites */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 gap-6">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 leading-tight drop-shadow-sm">
          {itinerary.title}
        </h1>
        <div className="flex items-center gap-5 text-gray-700">
          <p className="text-lg font-semibold">
            Favorites: <span className="text-gray-900">{itinerary.favoriteCount ?? 0}</span>
          </p>
          <FavoriteButton itineraryId={itineraryId} />
        </div>
      </header>

      {/* Cover Image */}
      {Array.isArray(itinerary.coverImage) && itinerary.coverImage[0] && (
        <div className="mb-12 rounded-2xl overflow-hidden shadow-xl ring-1 ring-gray-200">
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
      <p className="mb-16 max-w-3xl mx-auto text-gray-700 text-lg leading-relaxed tracking-wide whitespace-pre-line">
        {itinerary.description}
      </p>

      {/* Itinerary Days */}
      <section>
        <h2 className="text-4xl font-semibold mb-10 border-b border-gray-300 pb-3 text-gray-800">
          Itinerary Details
        </h2>

        {itinerary.itinerary.map((day) => (
          <article
            key={day.day}
            className="mb-14 rounded-3xl border border-gray-200 p-8 shadow-md bg-gradient-to-br from-gray-50 to-cream-100 transition-transform hover:scale-[1.02] hover:shadow-lg"
          >
            <h3 className="text-3xl font-semibold mb-6 text-gray-900 tracking-wide drop-shadow-sm">
              Day {day.day}
            </h3>

            {/* Carousel */}
            {day.images && day.images.length > 0 && (
              <Carousel className="mb-8 rounded-xl overflow-hidden shadow ring-1 ring-gray-200">
                <CarouselContent>
                  {day.images.map((img, idx) => {
                    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/discover-ease-ee29d.firebasestorage.app/o/${encodeURIComponent(
                      img
                    )}?alt=media`;

                    return (
                      <CarouselItem
                        key={idx}
                        className="basis-full sm:basis-1/2 lg:basis-1/3 p-3"
                      >
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="w-full focus:outline-none rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-300 ease-in-out">
                              <Image
                                src={imageUrl}
                                alt={`Day ${day.day} image ${idx + 1}`}
                                width={600}
                                height={400}
                                className="object-cover w-full h-48 sm:h-56 rounded-xl"
                              />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-7xl p-0 bg-transparent border-none">
                            <DialogTitle className="sr-only">
                              Day {day.day} Image {idx + 1}
                            </DialogTitle>

                            <Image
                              src={imageUrl}
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
                {day.images.length >= 4 && (
                  <>
                    <CarouselPrevious className="text-gray-600 hover:text-gray-900" />
                    <CarouselNext className="text-gray-600 hover:text-gray-900" />
                  </>
                )}
              </Carousel>
            )}

            {/* Activities list */}
            <ul className="list-disc list-inside text-gray-800 text-lg leading-loose space-y-2 pl-6">
              {day.activity.map((act, i) => (
                <li key={i} className="hover:text-gray-900 transition-colors cursor-default">
                  {act}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  );
}