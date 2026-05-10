type ClaimsLike = Record<string, unknown> | null;

export function getRoleFromClaims(claims: ClaimsLike) {
  if (!claims) {
    return null;
  }

  const appMetadata =
    "app_metadata" in claims && typeof claims.app_metadata === "object"
      ? (claims.app_metadata as Record<string, unknown>)
      : null;
  const userMetadata =
    "user_metadata" in claims && typeof claims.user_metadata === "object"
      ? (claims.user_metadata as Record<string, unknown>)
      : null;

  const appRole = typeof appMetadata?.role === "string" ? appMetadata.role : null;
  const userRole = typeof userMetadata?.role === "string" ? userMetadata.role : null;

  return appRole ?? userRole;
}

