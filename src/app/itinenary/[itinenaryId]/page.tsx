import { firestore } from "../../../../firebase/server";
import { ItinenaryType } from "../../../../type/itinenary";
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

type Props = {
  params: {
    itinenaryId: string;
  };
};

export default async function ItinenaryDetailPage({ params }: Props) {
  const docRef = firestore.collection("itineraries").doc(params.itinenaryId);
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return <div className="p-4 text-red-500">Itinerary not found.</div>;
  }

  const itinenary = snapshot.data() as ItinenaryType;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">{itinenary.title}</h1>
      <p className="text-muted-foreground mb-6">{itinenary.description}</p>

      {Array.isArray(itinenary.coverImage) && itinenary.coverImage[0] && (
        <div className="w-full mb-8">
          <Image
            src={`https://firebasestorage.googleapis.com/v0/b/discover-ease-ee29d.firebasestorage.app/o/${encodeURIComponent(
              itinenary.coverImage[0]
            )}?alt=media`}
            alt={itinenary.title}
            className="w-full h-auto rounded-lg shadow"
            width={1200}
            height={800}
            priority
          />
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Itinerary</h2>
      {itinenary.itinenary.map((day) => (
        <div
          key={day.day}
          className="mb-8 border border-border rounded-lg p-4 shadow-sm"
        >
          <h3 className="text-xl font-semibold mb-3">Day {day.day}</h3>

          {day.images && day.images?.length > 0 && (
            <Carousel className="w-full mb-4">
              <CarouselContent>
                {day.images.map((img, index) => {
                  const imageUrl = `https://firebasestorage.googleapis.com/v0/b/discover-ease-ee29d.firebasestorage.app/o/${encodeURIComponent(
                    img
                  )}?alt=media`;

                  return (
                    <CarouselItem
                      key={index}
                      className="basis-full sm:basis-1/2 lg:basis-1/3"
                    >
                      <div className="p-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="w-full focus:outline-none">
                              <Image
                                src={imageUrl}
                                alt={`Day ${day.day} image ${index + 1}`}
                                width={600}
                                height={400}
                                className="w-full h-64 object-cover rounded-lg shadow transition-transform hover:scale-[1.02]"
                              />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-6xl p-0 bg-transparent border-none">
                            <DialogTitle className="hidden">
                              Day {day.day} Image {index + 1}
                            </DialogTitle>

                            <Image
                              src={imageUrl}
                              alt={`Day ${day.day} full image ${index + 1}`}
                              width={1600}
                              height={1000}
                              className="w-full h-auto object-contain rounded"
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              {day.images.length >= 4 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
          )}

          <ul className="list-disc list-inside text-sm pl-4">
            {day.activity.map((act, i) => (
              <li key={i}>{act}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
