import ItineraryCard from "@/components/itinerary-card";
import { getItineraries } from "../../../data/itinerary";

export default async function itinerary() {
  const { data } = await getItineraries();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item) => {
        return (
          <ItineraryCard
            key={item.id}
            title={item.title}
            id={item.id}
            coverImages={item.coverImage}
            country={item.country}
            tags={item.tags}
          />
        );
      })}
    </div>
  );
}
