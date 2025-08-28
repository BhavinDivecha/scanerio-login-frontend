"use client"
import LoginForm from "@/components/section/login-form";
import * as React from "react";

// Brand palette (from instructions)
const BRAND = {
  name: "Scanerio",
  primary: "#00B86B",
  primaryStrong: "#4D32EF",
  surface: "#0D1B2A",
  surfaceMuted: "#11172B",
  text: "#E6EAF6",
  textMuted: "#9AA4C1",
  accent: "#00D3B7",
  warning: "#FFC857",
  good: "#31C48D",
  bad: "#F05252",
};

// Lightweight inline logo to satisfy: "Always use logo in any UI page"
function ScanerioLogo({ size = 36 }: { size?: number }) {
  const s = size;
  return (
    <div className="flex items-center gap-3" aria-label="Scanerio logo">
      <svg width={s} height={s} viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={BRAND.primary} />
            <stop offset="100%" stopColor={BRAND.accent} />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="64" height="64" rx="14" fill="url(#g)" />
        <path
          d="M18 38c4 6 10 10 14 10 10 0 18-8 18-18 0-4-2-8-5-11l-5 5c2 2 3 4 3 6a11 11 0 1 1-22 0c0-6 5-11 11-11 2 0 4 1 6 2l5-5c-3-2-6-3-11-3-11 0-20 9-20 20 0 4 1 8 3 11z"
          fill={BRAND.surface}
          opacity={0.2}
        />
        <path
          d="M22 32a10 10 0 0 0 20 0 10 10 0 0 0-20 0zm6 0a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"
          fill={BRAND.surface}
          opacity={0.6}
        />
      </svg>
      <span className="font-semibold tracking-tight" style={{ color: BRAND.text, fontSize: 18 }}>
        {BRAND.name}
      </span>
    </div>
  );
}

// Minimal, dependency-free icons
const Icon = {
  Google: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.8-5.4 3.8-3.2 0-5.9-2.7-5.9-5.9S8.8 6.1 12 6.1c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.8 3.7 14.6 2.8 12 2.8 6.9 2.8 2.8 6.9 2.8 12S6.9 21.2 12 21.2c6.4 0 8.9-4.5 8.9-6.8 0-.5-.1-.8-.1-1.1H12z"/>
    </svg>
  ),
  GitHub: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.1 3.3 9.4 7.8 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.3-3.9-1.3-.6-1.6-1.4-2-1.4-2-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1 .1.8-.8 2.4-1.4-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.4 1.2a11.6 11.6 0 0 1 6.1 0C16.9 3.8 18 4.1 18 4.1c.6 1.7.2 3 .1 3.3.8.9 1.2 2 1.2 3.3 0 4.5-2.7 5.5-5.3 5.8.9.7 1.6 2 1.6 4.1v3c0 .3.2.7.8.6A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"/>
    </svg>
  ),
  LinkedIn: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#0A66C2" d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8 8.5h3.8v2h.1c.5-1 1.9-2.1 3.9-2.1 4.2 0 5 2.8 5 6.4V23h-4v-5.9c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V23H8V8.5z"/>
    </svg>
  ),
};

// Lightweight utility: validate email
function isValidEmail(email: string) {
  return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
}

// OTP input component (6 digits) with auto-advance and accessible labels
function OtpInput({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled?: boolean; }) {
  const inputs = React.useRef<Array<HTMLInputElement | null>>([]);

  const setChar = (idx: number, ch: string) => {
    const next = (value.substring(0, idx) + ch.replace(/\D/g, "").slice(-1) + value.substring(idx + 1)).slice(0, 6);
    onChange(next);
    if (ch && inputs.current[idx + 1]) inputs.current[idx + 1]?.focus();
  };
  const setInputRef = (i: number): React.RefCallback<HTMLInputElement> =>
  (el) => { inputs.current[i] = el; };

  return (
    <div className="flex gap-2" role="group" aria-label="Enter 6-digit verification code">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={setInputRef(i)}
          inputMode="numeric"
          aria-label={`Digit ${i + 1}`}
          className="w-12 h-12 rounded-2xl text-center text-xl font-semibold bg-transparent border outline-none focus:ring-2"
          style={{
            borderColor: BRAND.textMuted,
            color: BRAND.text,
            boxShadow: "none",
          }}
          value={value[i] ?? ""}
          onChange={(e) => setChar(i, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i] && inputs.current[i - 1]) inputs.current[i - 1]?.focus();
          }}
          disabled={disabled}
          maxLength={1}
        />
      ))}
    </div>
  );
}

// Button primitive (shadcn-inspired)
function Button({ children, onClick, variant = "default", disabled, type = "button", icon }: { children: React.ReactNode; onClick?: () => void; variant?: "default" | "outline" | "muted"; disabled?: boolean; type?: "button" | "submit"; icon?: React.ReactNode; }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition outline-none focus-visible:ring-2";
  const styles = {
    default: {
      background: BRAND.primary,
      color: BRAND.surface,
      border: `1px solid ${BRAND.primary}`,
    },
    outline: {
      background: "transparent",
      color: BRAND.text,
      border: `1px solid ${BRAND.textMuted}`,
    },
    muted: {
      background: BRAND.surfaceMuted,
      color: BRAND.textMuted,
      border: `1px solid ${BRAND.surfaceMuted}`,
    },
  }[variant];

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={base} style={{ ...styles, opacity: disabled ? 0.6 : 1 }}>
      {icon}
      <span>{children}</span>
    </button>
  );
}

// Social auth button
function SocialButton({ provider, label, href, icon }: { provider: "google" | "github" | "linkedin"; label: string; href: string; icon: React.ReactNode; }) {
  return (
    <a
      href={href}
      className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium border transition focus-visible:ring-2"
      style={{ borderColor: BRAND.textMuted, color: BRAND.text, background: "transparent" }}
      aria-label={`Continue with ${label}`}
    >
      {icon}
      <span>Continue with {label}</span>
    </a>
  );
}

// Fake client to hit your backend routes (replace endpoints with your URLs)
async function requestOtp(email: string) {
  const res = await fetch("/api/auth/otp/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function verifyOtp(email: string, code: string) {
  const res = await fetch("/api/auth/otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [step, setStep] = React.useState<"email" | "otp">("email");
  const [otp, setOtp] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<{ kind: "info" | "error" | "success"; text: string } | null>(null);

  const sendCode = async () => {
    setMessage(null);
    if (!isValidEmail(email)) {
      setMessage({ kind: "error", text: "Please enter a valid email address." });
      return;
    }
    try {
      setBusy(true);
      await requestOtp(email);
      setStep("otp");
      setMessage({ kind: "success", text: "We’ve sent a 6‑digit code to your email." });
    } catch (e: any) {
      setMessage({ kind: "error", text: e?.message || "Couldn’t send code." });
    } finally {
      setBusy(false);
    }
  };

  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (otp.length !== 6) {
      setMessage({ kind: "error", text: "Enter the 6‑digit code." });
      return;
    }
    try {
      setBusy(true);
      await verifyOtp(email, otp);
      setMessage({ kind: "success", text: "Signed in! Redirecting…" });
      // Example: window.location.href = "/app";
    } catch (e: any) {
      setMessage({ kind: "error", text: e?.message || "Invalid code." });
    } finally {
      setBusy(false);
    }
  };

  return (
     <LoginForm />
  );
}