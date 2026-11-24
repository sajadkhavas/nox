/** Show server-provided test codes only in development on the local computer. */
export function localOtpTestCode(value: unknown, hostname = typeof window === "undefined" ? "" : window.location.hostname): string | null {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(hostname)) return null;
  return typeof value === "string" && /^\d{4,8}$/.test(value) ? value : null;
}
