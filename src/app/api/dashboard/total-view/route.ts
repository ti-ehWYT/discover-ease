import { NextResponse } from "next/server";
import { getTotalView } from "../../../../../data/dashboard";
import { apiHandler } from "@/lib/apiHandler";

export const GET = apiHandler({
  GET: async () => {
    const data= await getTotalView();
    return NextResponse.json(data);
  },
});
