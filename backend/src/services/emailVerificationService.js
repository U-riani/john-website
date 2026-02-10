// backend/src/services/emailVerificationService.js
const store = new Map();
const verifiedEmails = new Set();

/**
 * email -> { code, expiresAt }
 */

export function generateEmailCode(email) {
  const code = Math.floor(1000 + Math.random() * 9000).toString();

  store.set(email, {
    code,
    expiresAt: Date.now() + 60_000, // 1 minute
  });

  return code;
}

export function verifyEmailCode(email, code) {
  const entry = store.get(email);
  if (!entry) return false;

  if (Date.now() > entry.expiresAt) {
    store.delete(email);
    return false;
  }

  if (entry.code !== code) return false;

  store.delete(email);
  verifiedEmails.add(email);

  // auto-expire verification after 5 minutes
  setTimeout(() => verifiedEmails.delete(email), 5 * 60_000);

  return true;
}

export function isEmailVerified(email) {
  return verifiedEmails.has(email);
}
