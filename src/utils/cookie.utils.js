/**
 * Get cookie options based on environment
 * Centralized cookie configuration for consistency
 */
export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production"

  return {
    httpOnly: true,
    secure: isProduction, // true in production (HTTPS required)
    sameSite: isProduction ? "None" : "Lax", // 'None' required for cross-site in production
    maxAge: 60 * 60 * 1000, // 1 hour
    domain: process.env.COOKIE_DOMAIN || undefined, // Set if using subdomains
  }
}

/**
 * Get cookie options for clearing cookies
 * Must match the options used when setting the cookie
 */
export const getClearCookieOptions = () => {
  return getCookieOptions()
}
