import { NextResponse } from "next/server";
import { getMostUsedUserPreference } from "../../../../../data/dashboard";
import { apiHandler } from "@/lib/apiHandler";

export const GET = apiHandler({
  GET: async () => {
    const data = await getMostUsedUserPreference();
    return NextResponse.json(data);
  },
});