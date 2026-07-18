/** Build a clickable profile URL from a lead's channel + contact (handle or URL). */
export function leadProfileUrl(
  channel: string | null | undefined,
  contact: string | null | undefined,
): string | null {
  const c = (contact ?? "").trim();
  if (!c) return null;

  // Contact already stored as a full URL (e.g. facebook.com/profile.php?id=…).
  if (/^https?:\/\//i.test(c)) return c;

  const handle = c.replace(/^@/, "").trim();
  // Only treat clean usernames as handles; skip messy manual contacts.
  if (!/^[A-Za-z0-9._]+$/.test(handle)) return null;

  switch (channel) {
    case "instagram":
      return `https://www.instagram.com/${handle}`;
    case "facebook":
      return `https://www.facebook.com/${handle}`;
    default:
      return null;
  }
}
