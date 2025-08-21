import { NextResponse } from "next/server";
import { getCookie, delCookie, setCookie } from "@/lib/cookies";
import { toast } from "sonner";
import axios from "axios";
type GhTokenResp = { access_token: string; scope: string; token_type: "bearer" };

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = await getCookie("gh_oauth_state");
  const verifier = await getCookie("gh_oauth_verifier");

  if (!code) {
    return NextResponse.redirect(`${process.env.LOGIN_URL}/?error=Invalid State`);
  }
      return NextResponse.redirect(`${process.env.LOGIN_URL}/?session=${code}`);


  // one-shot
  // delCookie("gh_oauth_state");

  // 1) Exchange code → token
  // const tokenResp = await fetch("https://github.com/login/oauth/access_token", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Accept": "application/json"
  //   },
  //   body: JSON.stringify({
  //     client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
  //     // If you keep PKCE, do NOT send client_secret for public clients. If you use server-secret flow, include the secret and omit PKCE.
  //     client_secret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET, // (server-side only)
  //     code,
  //     redirect_uri: process.env.GITHUB_REDIRECT_URI,
  //     // code_verifier: verifier // required if you used PKCE
  //   })
  // });

  // if (!tokenResp.ok) {
  //   // toast.error('Invalid Token');
  //   return NextResponse.redirect(`${process.env.LOGIN_URL}/?error=Invalid Token`);
  // }

  // const tokenJson = (await tokenResp.json()) as GhTokenResp;
  // const ghToken = tokenJson.access_token;
  // if (!ghToken) {
  //   // toast.error('Invalid Token');
  //   return NextResponse.redirect(`${process.env.LOGIN_URL}/?error=Invalid Token`);
  // }

  // // 2) Fetch GitHub profile
  // const [userResp, emailResp] = await Promise.all([
  //   fetch("https://api.github.com/user", {
  //     headers: { Authorization: `Bearer ${ghToken}`, "User-Agent": "Scanerio" }
  //   }),
  //   fetch("https://api.github.com/user/emails", {
  //     headers: { Authorization: `Bearer ${ghToken}`, "User-Agent": "Scanerio" }
  //   })
  // ]);

  // if (!userResp.ok) {

  //   // toast.error('User Data Not accessable');
  //   return NextResponse.redirect(`${process.env.LOGIN_URL}/?error=User Data Not accessable`);
  // }

  // const ghUser = await userResp.json();
  // const emails = emailResp.ok ? await emailResp.json() : [];
  // const primaryEmail = Array.isArray(emails)
  //   ? emails.find((e: any) => e.primary)?.email ?? emails[0]?.email
  //   : undefined;

  //   console.log({
  //       provider: "github",
  //       providerId: String(ghUser.id),
  //       login: ghUser.login,
  //       name: ghUser.name,
  //       email: primaryEmail,
  //       avatarUrl: ghUser.avatar_url,
  //     });
      //       const response = await axios.post('/v1/user/auth/github/verify', {
      //   // provider: "github",
      //   code
      //   // providerId: String(ghUser.id),
      //   // login: ghUser.login,
      //   // name: ghUser.name,
      //   // email: primaryEmail,
      //   // avatarUrl: ghUser.avatar_url
      // });
      
      // if (response.status === 200) {
      // //   toast.success('OTP sent successfully!');
      // // setShowOtpField(true);
      // return NextResponse.redirect('${process.env.LOGIN_URL}/?session='+JSON.stringify(response.data.user));
  
      // } else {
      //   // toast.error(response.data.message || 'Failed to send OTP');
      //     return NextResponse.redirect(`${process.env.LOGIN_URL}/?error=Failed to login`);

      // }
// toast.success('Github Logged in as'+ghUser.name);
  return NextResponse.redirect(`${process.env.LOGIN_URL}/`);
}
