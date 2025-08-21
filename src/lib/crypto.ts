import { randomBytes, createHash } from "crypto";

export function randomState(length = 32) {
  return randomBytes(length).toString("hex");
}

// Simple (optional) PKCE support. GitHub supports PKCE for OAuth Apps.
export function createPkcePair() {
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}
