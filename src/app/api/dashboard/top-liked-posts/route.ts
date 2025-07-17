import { NextResponse } from "next/server";
import { getTopLikedPosts } from "../../../../../data/dashboard";
import { apiHandler } from "@/lib/apiHandler";

export const GET = apiHandler({
  GET: async () => {
    const result = await getTopLikedPosts();
    return NextResponse.json(result.data);
  },
});
