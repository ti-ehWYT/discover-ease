import { NextResponse } from "next/server";
import { getLikesOverTimeByCountry } from "../../../../../data/dashboard";

export async function GET() {
  const data = await getLikesOverTimeByCountry();
  return NextResponse.json(data);
}
