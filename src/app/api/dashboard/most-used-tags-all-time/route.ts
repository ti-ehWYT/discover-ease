import { NextResponse } from "next/server";
import { getMostUsedTags } from "../../../../../data/dashboard";

export async function GET() {
    const data = await getMostUsedTags();

    return NextResponse.json(data);
}