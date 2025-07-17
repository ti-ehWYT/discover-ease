import { apiHandler } from "@/lib/apiHandler";
import { NextResponse } from "next/server";
import { getSearchRanking } from "../../../../../data/dashboard";

export const GET = apiHandler({
  GET: async () => {
    const data = await getSearchRanking();
    return NextResponse.json(data);
  },
});
