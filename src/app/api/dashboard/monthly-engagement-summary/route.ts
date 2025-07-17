import { apiHandler } from "@/lib/apiHandler";
import { getMonthlyEngagement } from "../../../../../data/dashboard";
import { NextRequest, NextResponse } from "next/server";

export const GET = apiHandler({
  GET: async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const yearMonth = searchParams.get("yearMonth") || undefined;
    const result = await getMonthlyEngagement(yearMonth);
    return NextResponse.json(result);
  },
});