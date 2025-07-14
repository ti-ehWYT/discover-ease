import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NewItineraryForm from "./new-itinerary-form";

export default function CreateItinerary() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create itinerary</CardTitle>
      </CardHeader>
      <CardContent>
        <NewItineraryForm />
      </CardContent>
    </Card>
  );
}
