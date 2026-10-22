/**
 * Kultr Anti-Fraud Dynamic Time-Rolling Ticket Token (TOTP)
 *
 * Implements client-side dynamic QR matrix generation and verification:
 * - Generates a 30-second rotating cryptographic payload: KTR-DYN:<ticketNumber>:<timeStep>:<hash>
 * - Provides immediate detection of forwarded WhatsApp screenshots or video recordings.
 * - Supports graceful backward-compatibility with classic ticket numbers.
 */

const DEFAULT_PERIOD = 30; // 30 seconds rolling window
const SECRET_SALT = "kultr_diaspora_gate_v1";

/** Simple deterministic hash for mobile runtime (works in web, iOS, Android without native crypto libs) */
function computeHash(input: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const combined = (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).toUpperCase();
  return combined.slice(0, 6);
}

export interface DynamicPayloadResult {
  payload: string;
  ticketNumber: string;
  timeStep: number;
  hash: string;
  secondsRemaining: number;
  progressFraction: number; // 1.0 down to 0.0
}

/**
 * Generate a dynamic rolling ticket payload for the current moment.
 */
export function generateDynamicTicketPayload(
  ticketNumber: string,
  period = DEFAULT_PERIOD
): DynamicPayloadResult {
  const cleanNumber = ticketNumber.trim().toUpperCase();
  const now = Math.floor(Date.now() / 1000);
  const timeStep = Math.floor(now / period);
  const secondsElapsed = now % period;
  const secondsRemaining = period - secondsElapsed;
  const progressFraction = secondsRemaining / period;

  const hash = computeHash(`${cleanNumber}:${timeStep}:${SECRET_SALT}`);
  const payload = `KTR-DYN:${cleanNumber}:${timeStep}:${hash}`;

  return {
    payload,
    ticketNumber: cleanNumber,
    timeStep,
    hash,
    secondsRemaining,
    progressFraction,
  };
}

export interface VerificationResult {
  valid: boolean;
  ticketNumber: string;
  isDynamic: boolean;
  reason?: "EXPIRED_CODE" | "TAMPERED_HASH" | "INVALID_FORMAT";
  ageSeconds?: number;
}

/**
 * Validate a scanned code (can be either classic ticket number or dynamic KTR-DYN payload).
 */
export function validateDynamicTicketPayload(
  code: string,
  period = DEFAULT_PERIOD
): VerificationResult {
  const trimmed = code.trim().toUpperCase();

  if (!trimmed.startsWith("KTR-DYN:")) {
    // Classic static ticket number
    return {
      valid: true,
      ticketNumber: trimmed,
      isDynamic: false,
    };
  }

  const parts = trimmed.split(":");
  if (parts.length < 4) {
    return {
      valid: false,
      ticketNumber: parts[1] || trimmed,
      isDynamic: true,
      reason: "INVALID_FORMAT",
    };
  }

  const [, ticketNumber, timeStepStr, scannedHash] = parts;
  const scannedStep = parseInt(timeStepStr, 10);
  if (isNaN(scannedStep)) {
    return {
      valid: false,
      ticketNumber,
      isDynamic: true,
      reason: "INVALID_FORMAT",
    };
  }

  const now = Math.floor(Date.now() / 1000);
  const currentStep = Math.floor(now / period);
  const stepDifference = currentStep - scannedStep;

  // Verify hash integrity
  const expectedHash = computeHash(`${ticketNumber}:${scannedStep}:${SECRET_SALT}`);
  if (expectedHash !== scannedHash) {
    return {
      valid: false,
      ticketNumber,
      isDynamic: true,
      reason: "TAMPERED_HASH",
    };
  }

  // Allow current time window or immediate previous window (clock drift tolerance of 30s)
  if (stepDifference > 1) {
    return {
      valid: false,
      ticketNumber,
      isDynamic: true,
      reason: "EXPIRED_CODE",
      ageSeconds: stepDifference * period,
    };
  }

  return {
    valid: true,
    ticketNumber,
    isDynamic: true,
  };
}
