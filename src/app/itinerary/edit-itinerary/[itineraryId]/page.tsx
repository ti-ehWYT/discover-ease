import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditItineraryForm from "./edit-itinerary-form";
import { getItineraryById } from "../../../../../data/itinerary";

export default async function EditItinerary({
  params,
}: {
  params: Promise<any>;
}) {
  const paramsValue = await params;
  const itinerary = await getItineraryById(paramsValue.itineraryId);
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Edit itinerary</CardTitle>
      </CardHeader>
      <CardContent>
        <EditItineraryForm
          id={itinerary.id}
          title={itinerary.title}
          description={itinerary.description}
          country={itinerary.country}
          coverImage={itinerary.coverImage || []}
          tags={itinerary.tags || []}
          itinerary={itinerary.itinerary || []}
          user_preference={itinerary.user_preference || []}
        />
      </CardContent>
    </Card>
  );
}
