'use client';

import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { postAudit } from '@/app/api/global-api';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

interface GoogleBtnProps {
  title: string;
}

const GoogleSignInBtn: React.FC<GoogleBtnProps> = ({ title }) => {
  const router = useRouter();
  const params = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const redirectBase = process.env.NEXT_PUBLIC_REDIRECT_URL ?? '/';

  const handleRedirect = useCallback(
    (submitUuid?: string | null) => {
      const urlParam = params.get('url');
      if (urlParam && submitUuid) {
        router.push(`${redirectBase}/reports/${submitUuid}`);
        return;
      }
      router.push(redirectBase);
    },
    [params, redirectBase, router]
  );

  const triggerAuditIfNeeded = useCallback(
    async () => {
      const targetUrl = params.get('url');
      if (!targetUrl) return null;
      const auditResponse = await postAudit({ url: targetUrl });
      if (auditResponse?.data?.uuid) {
        return auditResponse.data.uuid as string;
      }
      return null;
    },
    [params]
  );

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error('Unable to read Google credentials. Please try again.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        '/v1/user/auth/google/verify',
        { credential: credentialResponse.credential },
        { withCredentials: true }
      );

      toast.success('Login successful!');
      const submitUuid =
        response?.data?.submitUrl?.uuid || (await triggerAuditIfNeeded());
      handleRedirect(submitUuid);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ||
          error.response?.data?.error ||
          'Google login failed'
        : 'Google login failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    setIsLoading(false);
    toast.error('Google login failed. Please try again.');
  };

  const triggerGoogleLogin = () => {
    if (isLoading) return;
    const googleBtn = googleButtonRef.current?.querySelector(
      'div[role="button"]'
    ) as HTMLElement | undefined;
    if (googleBtn) {
      googleBtn.click();
    } else {
      toast.error('Google auth is not ready yet. Please try again in a moment.');
    }
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={triggerGoogleLogin}
        disabled={isLoading}
        className="relative flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
        aria-label={`Continue with ${title}`}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google logo"
            className="h-5 w-5"
            loading="lazy"
          />
        </span>
        <span>Continue with {title}</span>
        {isLoading && (
          <span className="absolute right-4 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
      </button>

      <div
        ref={googleButtonRef}
        className="pointer-events-none absolute inset-0 -z-10 opacity-0"
        aria-hidden="true"
      >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          shape="pill"
          theme="outline"
          text="continue_with"
          width="100%"
        />
      </div>

      {isLoading && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-white/75 text-xs font-semibold text-slate-500 dark:bg-slate-900/70 dark:text-slate-100">
          Processing...
        </div>
      )}
    </div>
  );
};

export default GoogleSignInBtn;
