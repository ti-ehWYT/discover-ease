import { NextResponse } from "next/server";
import { getMostUsedTags } from "../../../../../data/dashboard";
import { apiHandler } from "@/lib/apiHandler";

export const GET = apiHandler({
  GET: async () => {
    const data = await getMostUsedTags();
    return NextResponse.json(data);
  },
});
