import "server-only";
import { firestore, auth } from "../firebase/server";
import { ItineraryType } from "../type/itinerary";
;

export const getItineraries = async () => {
  const itinerariesQuery = firestore.collection("itineraries").orderBy("created", "desc");
  const snap = await itinerariesQuery.get();

  const itineraries: ItineraryType[] = snap.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      title: data.title ?? "",
      description: data.description ?? "",
      country: data.country ?? "",
      coverImage: Array.isArray(data.coverImage) ? data.coverImage : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      itinerary: Array.isArray(data.itinerary) ? data.itinerary : [],
      authorId: data.authorId ?? "",
    };
  });

  return { data: itineraries };
};