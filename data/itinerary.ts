import "server-only";
import { firestore, auth } from "../firebase/server";
import { ItineraryType } from "../type/itinerary";
export const getItineraries = async () => {
  const itinerariesQuery = firestore
    .collection("itineraries")
    .orderBy("created", "desc");
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
      user_preference: Array.isArray(data.user_preference) ? data.user_preference : [],
      authorId: data.authorId ?? "",
    };
  });

  return { data: itineraries };
};

export const getAuthorItineraries = async (uid: string) => {
  const query = firestore
    .collection("itineraries")
    .where("authorId", "==", uid)
    .orderBy("created", "desc");

  const snap = await query.get();
  const itineraries: ItineraryType[] = snap.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      title: data.title ?? "",
      description: data.description ?? "",
      country: data.country ?? "",
      coverImage: Array.isArray(data.coverImage) ? data.coverImage : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      user_preference: Array.isArray(data.user_preference) ? data.user_preference : [],
      itinerary: Array.isArray(data.itinerary) ? data.itinerary : [],
      authorId: data.authorId ?? "",
    };
  });
  return { data: itineraries };
};


export const getItineraryById = async (itineraryId: string) => {
  const snap = await firestore.collection("itineraries").doc(itineraryId).get();
  const itineraryData = {
    id: itineraryId,
    ...snap.data(),
  } as ItineraryType;
  return itineraryData;
};