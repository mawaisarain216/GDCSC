// Lightweight inline brand icons (lucide-react no longer ships trademarked
// brand/logo icons in recent versions, so these small SVGs replace them).
type IconProps = { size?: number; className?: string };

export function FacebookIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.55-1.5H16.5V4.3c-.28-.04-1.23-.13-2.35-.13-2.33 0-3.9 1.42-3.9 4.03V10.5H7.75v3H10.25V21h3.25Z" />
    </svg>
  );
}

export function InstagramIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22 12s0-3.2-.4-4.7a2.9 2.9 0 0 0-2-2.1C17.9 5 12 5 12 5s-5.9 0-7.6.2a2.9 2.9 0 0 0-2 2.1C2 8.8 2 12 2 12s0 3.2.4 4.7a2.9 2.9 0 0 0 2 2.1C6.1 19 12 19 12 19s5.9 0 7.6-.2a2.9 2.9 0 0 0 2-2.1C22 15.2 22 12 22 12Z" opacity=".15" />
      <path d="M22 12s0-3.2-.4-4.7a2.9 2.9 0 0 0-2-2.1C17.9 5 12 5 12 5s-5.9 0-7.6.2a2.9 2.9 0 0 0-2 2.1C2 8.8 2 12 2 12s0 3.2.4 4.7a2.9 2.9 0 0 0 2 2.1C6.1 19 12 19 12 19s5.9 0 7.6-.2a2.9 2.9 0 0 0 2-2.1C22 15.2 22 12 22 12Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 9.5v5l4.5-2.5L10 9.5Z" />
    </svg>
  );
}

export function TwitterIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.9 3H21l-6.5 7.4L22 21h-6.3l-4.9-6.4L5.1 21H3l7-8L2.5 3h6.4l4.4 5.9L18.9 3Zm-1.1 16h1.2L7.3 4.9H6l11.8 14.1Z" />
    </svg>
  );
}
