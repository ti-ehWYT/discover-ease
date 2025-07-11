import ItinenaryCard from "@/components/itinenary-card";
import { getItineraries } from "../../../data/itinenary";

export default async function itinenary() {
    const { data } = await getItineraries();
    return <div>
      {data.map((item) => {
        return (<ItinenaryCard key={item.id} title={item.title} id={item.id} coverImages={item.coverImage} />)
      })}
    </div>;
}