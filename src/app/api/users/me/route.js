import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, checkPassword, endSession } from "@/lib/auth";
import { EMAIL_RE, USERNAME_RE, errorResponse } from "@/lib/validation";

// User CRUD for the logged-in user: Read (GET), Update (PATCH) and Delete (DELETE).
// Create is POST /api/auth/register.

// Only these fields are ever sent back. passwordHash is never included.
const PUBLIC_FIELDS = { id: true, username: true, email: true, createdAt: true };

const NOT_LOGGED_IN = "You need to log in.";
const IN_USE_MESSAGE = "Delete your projects and comments before deleting your account.";

// Read: return the logged-in user's account details.
export async function GET(request) {
  const current = await getCurrentUser(request);
  if (!current) return errorResponse(401, NOT_LOGGED_IN);

  const user = await prisma.user.findUnique({ where: { id: current.id }, select: PUBLIC_FIELDS });
  if (!user) return errorResponse(401, NOT_LOGGED_IN); // the account vanished
  return NextResponse.json({ user });
}

// Update: change username and/or email. Fields missing from the body are left alone.
export async function PATCH(request) {
  const current = await getCurrentUser(request);
  if (!current) return errorResponse(401, NOT_LOGGED_IN);

  const body = await request.json().catch(() => ({}));
  const hasEmail = body.email !== undefined;
  const hasUsername = body.username !== undefined;
  if (!hasEmail && !hasUsername) return errorResponse(400, "Nothing to update.");

  const email = String(body.email ?? "").trim().toLowerCase();
  const username = String(body.username ?? "").trim();

  // Same rules and messages as registration.
  const fields = {};
  if (hasEmail && !EMAIL_RE.test(email)) fields.email = "Enter a valid email.";
  if (hasUsername && !USERNAME_RE.test(username))
    fields.username = "Use 3 to 30 letters, numbers, dots, dashes or underscores.";
  if (Object.keys(fields).length) return errorResponse(400, "Please check your input.", fields);

  // Is the value already used by someone else? (Our own current value is fine.)
  if (hasEmail) {
    const other = await prisma.user.findUnique({ where: { email } });
    if (other && other.id !== current.id)
      return errorResponse(409, "This email is already registered.", { email: "This email is already registered." });
  }
  if (hasUsername) {
    const other = await prisma.user.findUnique({ where: { username } });
    if (other && other.id !== current.id)
      return errorResponse(409, "This username is already taken.", { username: "Choose another username." });
  }

  // Build the update from the fields that were actually sent.
  const data = {};
  if (hasEmail) data.email = email;
  if (hasUsername) data.username = username;

  try {
    const user = await prisma.user.update({ where: { id: current.id }, data, select: PUBLIC_FIELDS });
    return NextResponse.json({ message: "Account updated.", user });
  } catch (err) {
    // Two requests at the same moment: the database's unique rule wins.
    if (err?.code === "P2002") return errorResponse(409, "This email or username is already taken.");
    throw err;
  }
}

// Delete: remove the account after the user confirms with their password.
export async function DELETE(request) {
  const current = await getCurrentUser(request);
  if (!current) return errorResponse(401, NOT_LOGGED_IN);

  const body = await request.json().catch(() => ({}));
  const password = String(body.password ?? "");
  if (!password)
    return errorResponse(400, "Enter your password to confirm.", { password: "Enter your password to confirm." });

  // passwordHash is only used here to check the password. It is never returned.
  const user = await prisma.user.findUnique({
    where: { id: current.id },
    select: { passwordHash: true },
  });
  if (!user) return errorResponse(401, NOT_LOGGED_IN);
  if (!(await checkPassword(password, user.passwordHash)))
    return errorResponse(403, "Password is incorrect.", { password: "Password is incorrect." });

  // In prisma/schema.prisma, Project.author and Comment.author use onDelete: Restrict,
  // so the database refuses to delete a user who still has projects or comments.
  // We check first to give a friendly message.
  const projects = await prisma.project.count({ where: { authorId: current.id } });
  const comments = await prisma.comment.count({ where: { authorId: current.id } });
  if (projects > 0 || comments > 0) return errorResponse(409, IN_USE_MESSAGE);

  try {
    await prisma.user.delete({ where: { id: current.id } });
  } catch (err) {
    // A project or comment was created between the check and the delete.
    if (err?.code === "P2003") return errorResponse(409, IN_USE_MESSAGE);
    throw err;
  }

  // Log the user out too: clear the session cookie.
  return endSession(NextResponse.json({ message: "Account deleted." }));
}
