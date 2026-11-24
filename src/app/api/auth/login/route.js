import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkPassword, startSession, DUMMY_HASH } from "@/lib/auth";
import { errorResponse } from "@/lib/validation";

// UC2: Log in
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  // A1: a field is empty
  const fields = {};
  if (!email) fields.email = "Enter your email.";
  if (!password) fields.password = "Enter your password.";
  if (Object.keys(fields).length) return errorResponse(400, "Please fill in all fields.", fields);

  // A2: wrong credentials. The message never says which part was wrong.
  const user = await prisma.user.findUnique({ where: { email } });
  const ok = await checkPassword(password, user ? user.passwordHash : DUMMY_HASH);
  if (!user || !ok) return errorResponse(401, "Email or password is incorrect.");

  const response = NextResponse.json({ user: { id: user.id, username: user.username } });
  return startSession(response, user.id);
}
