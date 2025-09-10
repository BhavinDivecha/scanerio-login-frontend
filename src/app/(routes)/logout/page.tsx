import { delCookie } from "@/lib/cookies";
import LogoutClient from "@/components/section/logout";

// Server component: clears cookies, renders a client UI that calls API to revoke and then navigates
export default async function LogoutPage() {
//   await Promise.all([
//     delCookie("refreshToken"),
//     delCookie("accessToken"),
//     delCookie("gh_oauth_state"),
//     delCookie("gh_oauth_verifier"),
//   ].map(p => p.catch(() => {})));

  return <LogoutClient />;
}
