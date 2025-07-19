import { NextResponse } from "next/server";
import { getTotalViewsByCountry } from "../../../../../data/dashboard";
import { apiHandler } from "@/lib/apiHandler";

export const GET = apiHandler({
  GET: async () => {
    const data = await getTotalViewsByCountry();
    return NextResponse.json(data);
  },
});
