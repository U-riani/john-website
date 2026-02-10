import crypto from "crypto";

export function verifyUnipaySignature({
  rawBody,
  signature,
  secret,
}) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  );
}
