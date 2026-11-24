import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";

// Login state is a signed cookie ("userId.expiry.signature"), so no extra table is
// needed. The cookie is httpOnly: JavaScript in the browser cannot read it.

export const SESSION_COOKIE = "kh_session";
const SESSION_DAYS = 7; // tbd (UC2: session lifetime)

function secret() {
  const value = process.env.SESSION_SECRET;
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set in production.");
  }
  return "dev-only-secret-change-me"; // local development 0nly
}

const sign = (text) => crypto.createHmac("sha256", secret()).update(text).digest("base64url");

export const hashPassword = (password) => bcrypt.hash(password, 10);
export const checkPassword = (password, hash) => bcrypt.compare(password, hash);

// Used to compare against when the email is unknown, so a wrong email and a
// wrong password take about the same time (the error message is the same, too).
export const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

/** Adds the session cookie to a NextResponse. */
export function startSession(response, userId) {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${userId}.${expires}`;
  response.cookies.set(SESSION_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return response;
}

export function endSession(response) {
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}

/** Returns { id, username } for the logged-in user, or null. */
export async function getCurrentUser(request) {
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  if (!cookie) return null;
  const [userId, expires, signature] = cookie.split(".");
  if (!userId || !expires || !signature) return null;

  const expected = sign(`${userId}.${expires}`);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  if (Number(expires) < Date.now()) return null;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user ? { id: user.id, username: user.username } : null;
}
