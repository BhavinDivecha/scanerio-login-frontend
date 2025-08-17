import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from '@react-oauth/google';
const OpenSans=Open_Sans({
  variable:'--font-opensans',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: "Scanerio",
  metadataBase: new URL("https://scanerio.codexlab.in"),
  description: "Scanerio is a website auditing tool",
  openGraph: {
    images: "/images/scanerio_transparent.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${OpenSans.variable}  antialiased`}
      >
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>

        {children}
        </GoogleOAuthProvider>
        <Toaster richColors />
        {/* </GoogleOAuthProvider> */}
      </body>
    </html>
  );
}
