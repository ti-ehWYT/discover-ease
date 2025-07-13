import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NewitineraryForm from "./new-itinerary-form";

export default function Createitinerary() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create itinerary</CardTitle>
      </CardHeader>
      <CardContent>
        <NewitineraryForm />
      </CardContent>
    </Card>
  );
}
