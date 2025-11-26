'use client';

import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { postAudit } from '@/app/api/global-api';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface GoogleBtnProps {
  title: string;
}

const GoogleSignInBtn: React.FC<GoogleBtnProps> = ({ title }) => {
  const router = useRouter();
  const params = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <div className="group relative w-full">
      <div className="pointer-events-none relative flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition duration-200 group-hover:-translate-y-0.5 group-hover:border-slate-300 group-hover:shadow-md dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google logo"
            className="h-5 w-5"
            loading="lazy"
          />
        </span>
        <span>Continue with {title}</span>
      </div>

      <div
        className="absolute inset-0"
        style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
      >
        <div className="h-full w-full opacity-0" aria-hidden="true">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            shape="pill"
            theme="outline"
            text="continue_with"
            width="100%"
          />
        </div>
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
