import { cookies } from "next/headers";

export async function setCookie(name: string, value: string, maxAgeSec: number) {
  (await cookies()).set({
    name,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSec
  });
}

export async function getCookie(name: string) {
  return (await cookies()).get(name)?.value ?? null;
}

export async function delCookie(name: string) {
  (await cookies()).set(name, "", { path: "/", maxAge: 0 });
}
