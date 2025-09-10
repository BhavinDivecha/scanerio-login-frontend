import { NextRequest, NextResponse } from "next/server";
import { delCookie } from "@/lib/cookies";

export async function POST(req: NextRequest) {
  try {
    // Forward the incoming cookies to your auth service for revocation
    // const cookieHeader = req.headers.get("cookie") ?? "";
    // const target = `${process.env.NEXT_PUBLIC_LOGIN_URL}/api/session/logout`;

    // try {
    //   await fetch(target, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Cookie: cookieHeader,
    //     },
    //     // Don't follow redirects; we only care about revocation side effects
    //     redirect: "manual",
    //   });
    // } catch {
    //   // Ignore upstream failures; still clear local cookies
    // }

    // Clear local cookies regardless of upstream result
    await Promise.all([
      delCookie("refreshToken"),
      delCookie("accessToken"),
      delCookie("gh_oauth_state"),
      delCookie("gh_oauth_verifier"),
    ].map(p => p.catch(() => {})));

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

