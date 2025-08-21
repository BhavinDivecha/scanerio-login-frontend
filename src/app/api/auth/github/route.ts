import { NextResponse } from "next/server";
import { randomState, createPkcePair } from "@/lib/crypto";
import { setCookie } from "@/lib/cookies";

export async function GET() {
  const state = randomState();
  const { verifier, challenge } = createPkcePair(); // optional but recommended

  // store short-lived anti-CSRF + pkce in cookies (could be Redis if you prefer)
  setCookie("gh_oauth_state", state, 10 * 60);
  setCookie("gh_oauth_verifier", verifier, 10 * 60);

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI!,
    state,
    scope: "read:user user:email",
    // PKCE (S256)
    // code_challenge: challenge,
    // code_challenge_method: "S256",
    // optional: "allow_signup": "false"
  });

  return NextResponse.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
}
