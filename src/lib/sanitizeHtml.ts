/** Lightweight server-side sanitization for admin-authored rich text. */
export function sanitizeHtml(input: string) {
  return (input || "")
    .replace(/<\s*(script|iframe|object|embed|form|base|meta|link)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|iframe|object|embed|form|base|meta|link)\b[^>]*\/?\s*>/gi, "")
    .replace(/\s+on[a-z0-9_-]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*(?:javascript|vbscript):[\s\S]*?\2/gi, '$1="#"')
    .replace(/(href|src)\s*=\s*("|')\s*data:text\/html[\s\S]*?\2/gi, '$1="#"');
}
