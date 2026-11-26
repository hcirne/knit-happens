// Small wrapper around fetch(). All pages talk to the Spring Boot backend through it,
// so cookies, the CSRF header and error handling are done in one place.

/** Thrown for every non-2xx response. Matches the backend error format:
 *  { "error": "message", "fields": { "email": "message" } } */
export class ApiError extends Error {
  constructor(status, message, fields = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status // HTTP status code, e.g. 400, 401, 404, 409
    this.fields = fields // per-field validation messages (may be empty)
  }
}

// Spring Security puts the CSRF token in the XSRF-TOKEN cookie. We send it back in the
// X-XSRF-TOKEN header on every request that changes data.
function readCookie(name) {
  const entry = document.cookie.split('; ').find((c) => c.startsWith(name + '='))
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : null
}

/** Sends a request and returns the parsed JSON (or null when the body is empty). */
export async function apiSend(method, path, body) {
  const headers = { Accept: 'application/json' }
  const options = { method, headers, credentials: 'include' } // include = send the session cookie

  if (method !== 'GET') {
    const token = readCookie('XSRF-TOKEN')
    if (token) headers['X-XSRF-TOKEN'] = token
  }

  if (body instanceof FormData) {
    // File upload (UC-04): do NOT set Content-Type. The browser adds
    // "multipart/form-data" together with the boundary.
    options.body = body
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }

  const response = await fetch(path, options)

  // 204 No Content (for example logout): nothing to parse.
  const data = response.status === 204 ? null : await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.error ?? 'Something went wrong. Please try again.',
      data?.fields ?? {},
    )
  }
  return data
}

export function apiGet(path) {
  return apiSend('GET', path)
}

export function apiPost(path, body) {
  return apiSend('POST', path, body)
}
