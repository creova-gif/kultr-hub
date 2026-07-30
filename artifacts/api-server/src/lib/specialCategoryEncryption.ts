/**
 * Field-level encryption for "special category" personal data — health,
 * dietary, and accessibility information a ticket buyer voluntarily
 * discloses for event catering/accommodation purposes. POPIA (South
 * Africa) Section 26 restricts processing this class of data; storing it
 * as plaintext in the same row as everything else would fail the "adequate
 * technical measures" bar even with consent on file.
 *
 * This is NOT a general-purpose encryption utility — it exists only for
 * this one column. Fails closed: with no key configured, encrypt/decrypt
 * both throw rather than silently falling back to plaintext, unlike the
 * simulated-mode pattern used elsewhere (lib/simulation.ts) for payment
 * providers. A missing payment credential just means "can't charge a card
 * yet"; a missing encryption key here would mean storing health data
 * unencrypted, which is a real security regression, not a benign
 * degradation — so submission is refused instead (see routes/tickets.ts).
 *
 * Env var:
 *   SPECIAL_CATEGORY_ENCRYPTION_KEY — base64-encoded 32 random bytes,
 *   e.g. `openssl rand -base64 32`. Rotating this key makes every
 *   previously-stored value undecryptable — treat it like any other secret
 *   that must never be lost or casually regenerated.
 */
import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function loadKey(): Buffer | null {
  const raw = process.env.SPECIAL_CATEGORY_ENCRYPTION_KEY;
  if (!raw) return null;
  const key = Buffer.from(raw, "base64");
  return key.length === 32 ? key : null;
}

export function isSpecialCategoryEncryptionConfigured(): boolean {
  return loadKey() !== null;
}

/** Encrypts `plaintext`. Throws if SPECIAL_CATEGORY_ENCRYPTION_KEY is unset or invalid. */
export function encryptSpecialCategoryData(plaintext: string): string {
  const key = loadKey();
  if (!key) {
    throw new Error(
      "SPECIAL_CATEGORY_ENCRYPTION_KEY is not configured — refusing to store special-category data unencrypted.",
    );
  }
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, ciphertext]).toString("base64");
}

/** Decrypts a value produced by {@link encryptSpecialCategoryData}. */
export function decryptSpecialCategoryData(blob: string): string {
  const key = loadKey();
  if (!key) {
    throw new Error("SPECIAL_CATEGORY_ENCRYPTION_KEY is not configured — cannot decrypt.");
  }
  const raw = Buffer.from(blob, "base64");
  const iv = raw.subarray(0, IV_LENGTH);
  const authTag = raw.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = raw.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}
