import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { EMAIL_RE, USERNAME_RE, MIN_PASSWORD_LENGTH, errorResponse } from "@/lib/validation";

// UC1: Create account
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const username = String(body.username ?? "").trim();
  const password = String(body.password ?? "");

  // A1 / A2: invalid data or weak password. Nothing is saved.
  const fields = {};
  if (!EMAIL_RE.test(email)) fields.email = "Enter a valid email.";
  if (!USERNAME_RE.test(username))
    fields.username = "Use 3 to 30 letters, numbers, dots, dashes or underscores.";
  if (password.length < MIN_PASSWORD_LENGTH)
    fields.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (Object.keys(fields).length) return errorResponse(400, "Please check your input.", fields);

  // A3: email (or username) already registered.
  if (await prisma.user.findUnique({ where: { email } }))
    return errorResponse(409, "This email is already registered. Try logging in.");
  if (await prisma.user.findUnique({ where: { username } }))
    return errorResponse(409, "This username is already taken.", { username: "Choose another username." });

  try {
    const user = await prisma.user.create({
      data: { email, username, passwordHash: await hashPassword(password) },
    });
    return NextResponse.json(
      { message: "Account created successfully.", user: { id: user.id, username: user.username } },
      { status: 201 },
    );
  } catch (err) {
    // Two people registering at the same moment: the database's unique rule wins.
    if (err?.code === "P2002") return errorResponse(409, "This email or username is already taken.");
    throw err;
  }
}
