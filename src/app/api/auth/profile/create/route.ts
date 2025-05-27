/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server";
import { fetcher } from "../../../../../../utils/fetcher";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Missing authorization token" },
        { status: 401 }
      );
    }

    // Call your NestJS backend using fetcher (axios)
    const response = await fetcher.post("/profiles/create", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newProfile = response.data;
    return NextResponse.json(newProfile);
  } catch (error: any) {
    console.error("Create profile error:", error);
    return NextResponse.json(
      { error: error?.response?.data?.error || "Internal server error" },
      { status: error?.response?.status || 500 }
    );
  }
}
