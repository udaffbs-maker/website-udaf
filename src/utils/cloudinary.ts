/**
 * Cloudinary URL optimization utility.
 *
 * Intercepts Cloudinary image URLs and injects automatic format/quality
 * optimization parameters (`f_auto,q_auto`) so the CDN always serves the
 * best format (AVIF → WebP → JPEG) at an optimal quality level.
 *
 * Non-Cloudinary URLs pass through unchanged.
 */

/**
 * Checks whether a URL points to a Cloudinary-hosted image.
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('res.cloudinary.com');
}

/**
 * Given any image URL, returns an optimized version if it belongs to
 * Cloudinary. If the URL already contains `f_auto` or `q_auto` those
 * segments are preserved as-is (no double-injection).
 *
 * For non-Cloudinary URLs the original string is returned untouched.
 *
 * @example
 * ```ts
 * optimizeCloudinaryUrl(
 *   'https://res.cloudinary.com/dwbckl4uz/image/upload/v1234/photo.jpg'
 * )
 * // → 'https://res.cloudinary.com/dwbckl4uz/image/upload/f_auto,q_auto/v1234/photo.jpg'
 * ```
 */
export function optimizeCloudinaryUrl(url: string): string {
  if (!isCloudinaryUrl(url)) {
    return url;
  }

  // Already optimized — skip injection
  if (url.includes('/f_auto') || url.includes('/q_auto')) {
    return url;
  }

  // Inject right after the `/upload/` segment
  return url.replace('/upload/', '/upload/f_auto,q_auto/');
}
