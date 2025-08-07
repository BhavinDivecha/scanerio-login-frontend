import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/v1/user/:path*",
        destination:
          (process.env.NODE_ENV == "development"
            ? `${process.env.NEXT_PUBLIC_LOGIN_URL}/api`
            : `${process.env.NEXT_PUBLIC_LOGIN_URL}/api`) + "/:path*",
      },
      {
        source: "/v1/audit",
        destination:
          (process.env.NODE_ENV == "development"
            ? `${process.env.NEXT_PUBLIC_API_URL}/api`
            : `${process.env.NEXT_PUBLIC_API_URL}/api`) + "/:path",
      }
    ];
  },
};

export default nextConfig;
