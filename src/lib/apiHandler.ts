import { NextRequest, NextResponse } from "next/server";

type Handler = (req: NextRequest) => Promise<NextResponse>;

type Handlers = {
  GET?: Handler;
  POST?: Handler;
  PUT?: Handler;
  DELETE?: Handler;
  [key: string]: Handler | undefined;
};

export function apiHandler(handlers: Handlers) {
  return async function (req: NextRequest) {
    const method = req.method?.toUpperCase();

    const handler = handlers[method!];
    if (!handler) {
      return NextResponse.json(
        { error: `Method ${method} Not Allowed` },
        { status: 405 }
      );
    }

    try {
      return await handler(req);
    } catch (error: any) {
      console.error(`[API Error] ${method} ${req.url}:`, error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}