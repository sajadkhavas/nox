/** LAN HTTP is permitted only by the development server; public builds require HTTPS. */
export function isAllowedBackendOrigin(url: URL, development: boolean): boolean {
  if (url.protocol === "https:") return true;
  if (url.protocol !== "http:") return false;
  if (["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) return true;
  if (!development) return false;
  const parts = url.hostname.split(".");
  if (parts.length !== 4 || parts.some(part => !/^\d+$/.test(part) || Number(part) > 255)) return false;
  const [first, second] = parts.map(Number);
  return first === 10 || (first === 172 && second >= 16 && second <= 31) || (first === 192 && second === 168);
}
