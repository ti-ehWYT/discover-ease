import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NewitinenaryForm from "./new-itinenary-form";

export default function Createitinenary() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create itinenary</CardTitle>
      </CardHeader>
      <CardContent>
        <NewitinenaryForm />
      </CardContent>
    </Card>
  );
}
