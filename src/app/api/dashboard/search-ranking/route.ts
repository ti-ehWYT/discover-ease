import { NextResponse } from "next/server";
import { getSearchRanking } from "../../../../../data/dashboard";

export async function GET() {
    const data = await getSearchRanking();

    return NextResponse.json(data);
}