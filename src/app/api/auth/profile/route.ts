/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server";
import { fetcher } from "../../../../../utils/fetcher";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!userId || !token) {
      return NextResponse.json(
        { error: "Missing userId or token" },
        { status: 400 }
      );
    }

    // Call your NestJS backend using fetcher (axios)
    const response = await fetcher.get(`/profiles?id=${userId}`);

    const profiles = response.data;
    return NextResponse.json(profiles);
  } catch (error: any) {
    console.error("Fetch profiles error:", error);
    return NextResponse.json(
      { error: error?.response?.data?.error || "Internal server error" },
      { status: error?.response?.status || 500 }
    );
  }
}
