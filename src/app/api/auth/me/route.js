import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// The frontend asks "who is logged in?" (to show the right menu and buttons).
export async function GET(request) {
  const user = await getCurrentUser(request);
  return NextResponse.json({ user }); // { user: null } when logged out
}
