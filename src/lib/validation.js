// Rules from the use case specifications. Values marked "tbd" are placeholders:
// change them here once the team has decided.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const USERNAME_RE = /^[A-Za-z0-9._-]{3,30}$/; // tbd

export const MIN_PASSWORD_LENGTH = 8; // tbd (UC1: password rules)
export const MAX_TITLE_LENGTH = 100; // tbd
export const MAX_DESCRIPTION_LENGTH = 2000; // tbd
export const MAX_COMMENT_LENGTH = 500; // tbd (UC5)

export const MAX_PHOTOS = 5; // tbd (UC4)
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // tbd (UC4)

export const FEED_PAGE_SIZE = 50; // tbd (UC3: paging)

// Keep in sync with `enum Category` in prisma/schema.prisma.
export const CATEGORIES = ["SWEATERS", "HATS", "SOCKS", "SHAWLS", "BLANKETS"];

/** Standard error response: { error, fields? } */
export function errorResponse(status, message, fields) {
  const body = fields && Object.keys(fields).length ? { error: message, fields } : { error: message };
  return Response.json(body, { status });
}
