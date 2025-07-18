import { apiHandler } from "@/lib/apiHandler";
import { NextRequest, NextResponse } from "next/server";
import { getAuthorPosts } from "../../../../../data/posts";
import { getAuthorItineraries, getUserFavoriteItineraries } from "../../../../../data/itinerary";

export const GET = apiHandler({
  GET: async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
    }
    if (!type) {
      return NextResponse.json({ error: "Missing type parameter" }, { status: 400 });
    }

    let data;

    switch (type) {
      case "posts":
        data = await getAuthorPosts(userId);
        break;

      case "itineraries":
        data = await getAuthorItineraries(userId);
        break;

      case "favourite":
        data = await getUserFavoriteItineraries(userId);
        break;

      default:
        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
    }

    return NextResponse.json(data);
  },
});