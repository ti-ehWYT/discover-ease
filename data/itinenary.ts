import "server-only";
import { firestore, auth } from "../firebase/server";
import { ItinenaryType } from "../type/itinenary";
;

export const getItineraries = async () => {
  const itinerariesQuery = firestore.collection("itineraries").orderBy("created", "desc");
  const snap = await itinerariesQuery.get();

  const itineraries: ItinenaryType[] = snap.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      title: data.title ?? "",
      description: data.description ?? "",
      country: data.country ?? "",
      coverImage: Array.isArray(data.coverImage) ? data.coverImage : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      itinenary: Array.isArray(data.itinenary) ? data.itinenary : [],
      authorId: data.authorId ?? "",
    };
  });

  return { data: itineraries };
};