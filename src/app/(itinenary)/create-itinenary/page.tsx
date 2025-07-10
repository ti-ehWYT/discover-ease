import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NewItineraryForm from "./new-itinerary-form";

export default function CreateItinerary() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create Itinerary</CardTitle>
      </CardHeader>
      <CardContent>
        <NewItineraryForm />
      </CardContent>
      <CardFooter className="flex-col gap-2"></CardFooter>
    </Card>
  );
}
