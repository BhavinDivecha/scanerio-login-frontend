"use client";

import React from "react";
import { motion } from "framer-motion";
import LoginForm from "./login-form";
import ExplosiveBurstAnimation from "@/components/ExplosiveBurstAnimation";

const Login = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row lg:items-stretch lg:py-8">
        {/* LEFT: Branding + Video */}
        <div className="relative flex w-full items-stretch justify-center px-4 pt-6 pb-4 sm:px-6 lg:w-1/2 lg:px-8 lg:pt-8">
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl">
            {/* Gradient overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-900/90" />

            {/* Video */}
            <video
              src="/scan.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />

            {/* Top brand */}
            <div className="pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-start px-6 py-5 sm:px-8">
              <motion.a
                href="https://scanerio.com/"
                className="pointer-events-auto inline-flex items-center gap-2 text-sm font-semibold sm:text-base lg:text-lg"
                animate={{ y: [0, -2, 0] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="origin-left scale-[1.15] sm:scale-[1.25] lg:scale-[1.35]">
                  <ExplosiveBurstAnimation />
                </div>
              </motion.a>
              <span className="ml-auto hidden text-[11px] font-medium text-slate-200/90 sm:inline-flex">
                Web Audit · Performance · Accessibility
              </span>
            </div>

            {/* Bottom content */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-6 pt-6 sm:px-8 sm:pb-8">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
                  Website Intelligence
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-[11px] sm:text-xs">
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-emerald-200">
                    Lighthouse-powered audits
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-slate-100">
                    Security &amp; SEO checks
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-slate-100">
                    Shareable reports
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* RIGHT: Login Card */}
        <div className="flex w-full items-center justify-center px-4 py-6 sm:px-6 lg:w-1/2 lg:px-8 lg:py-8">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
