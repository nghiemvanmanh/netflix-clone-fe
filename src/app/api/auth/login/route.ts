import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Replace this with your actual authentication logic
    // This is just a demo implementation
    if (email && password) {
      // Simulate successful login
      return NextResponse.json({
        success: true,
        token: "demo-jwt-token",
        user: {
          id: 1,
          email: email,
          name: "Demo User",
        },
      });
    } else {
      return NextResponse.json(
        { error: "Email và mật khẩu là bắt buộc" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Đã xảy ra lỗi server" + error },
      { status: 500 }
    );
  }
}
