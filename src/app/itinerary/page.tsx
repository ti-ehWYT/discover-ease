import ItineraryCard from "@/components/itinerary-card";
import { getItineraries } from "../../../data/itinerary";

export default async function itinerary() {
    const { data } = await getItineraries();
    return <div>
      {data.map((item) => {
        return (<ItineraryCard key={item.id} title={item.title} id={item.id} coverImages={item.coverImage} />)
      })}
    </div>;
}