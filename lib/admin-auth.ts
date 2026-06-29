import { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "kot_admin_session";

export function getExpectedAdminKey(): string | undefined {
  return process.env.STUDIO_API_KEY?.trim() || undefined;
}

export function getAdminKeyFromRequest(request: NextRequest): string | null {
  const header =
    request.headers.get("x-studio-api-key") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (header?.trim()) return header.trim();
  return request.cookies.get(ADMIN_SESSION_COOKIE)?.value ?? null;
}

export function assertAdminAuth(request: NextRequest): boolean {
  const expected = getExpectedAdminKey();
  if (!expected) return false;
  const provided = getAdminKeyFromRequest(request);
  return Boolean(provided && provided === expected);
}

export function assertAdminPassword(password: string): boolean {
  const expected = getExpectedAdminKey();
  if (!expected) return false;
  return password === expected;
}
