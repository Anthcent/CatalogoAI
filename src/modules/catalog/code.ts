const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generatePublicCode(random = Math.random): string {
  return `EXP-${Array.from({ length: 6 }, () => ALPHABET[Math.floor(random() * ALPHABET.length)]).join("")}`;
}
