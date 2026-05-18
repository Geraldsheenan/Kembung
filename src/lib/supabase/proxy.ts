import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicEnv } from "./env";

function clearSupabaseAuthCookies(
  request: NextRequest,
  response: NextResponse,
  supabaseUrl: string,
) {
  const projectRef = new URL(supabaseUrl).hostname.split(".")[0];
  const authCookiePrefix = `sb-${projectRef}-auth-token`;

  request.cookies
    .getAll()
    .filter((cookie) => cookie.name.startsWith(authCookiePrefix))
    .forEach((cookie) => {
      request.cookies.delete(cookie.name);
      response.cookies.delete(cookie.name);
    });
}

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const { url, anonKey } = getSupabasePublicEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.getClaims();

  if (
    error &&
    (error.code === "refresh_token_not_found" ||
      error.message.toLowerCase().includes("invalid refresh token"))
  ) {
    clearSupabaseAuthCookies(request, response, url);
  }

  return response;
}
