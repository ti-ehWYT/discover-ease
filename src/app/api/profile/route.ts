import { apiHandler } from "@/lib/apiHandler";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUsers } from "../../../../data/users";

export const GET = apiHandler({
  GET: async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const userID = searchParams.get("userId");
    const result = await getCurrentUsers(userID ?? '');
    return NextResponse.json(result);
  },
});