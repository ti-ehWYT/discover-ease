import { NextResponse } from "next/server";
import { getTopLikedPosts } from "../../../../../data/dashboard";

export async function GET() {
  const result = await getTopLikedPosts();
  
  return NextResponse.json(result.data);  
}