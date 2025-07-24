import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ success: false, error: "Missing token" }, { status: 400 });
    }
    // Set the cookie as a session cookie
    const res = NextResponse.json({ success: true });
    res.cookies.set("authToken", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    });
    return res;
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
} 