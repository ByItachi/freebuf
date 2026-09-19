/**
 * Wraps a third-party CDN image URL through the same-origin /api/img proxy
 * so images load everywhere (no hotlink/bot friction) and stay cacheable.
 */
export function px(src: string): string {
  return `/api/img?src=${encodeURIComponent(src)}`;
}
