import React, { useCallback, useMemo, useState } from 'react';
import { FaGithub } from 'react-icons/fa';

interface GithubBtn {
  title: string;
}

const GithubSignIn: React.FC<GithubBtn> = ({ title }) => {
  const [isLoading, setIsLoading] = useState(false);

  const githubParams = useMemo(() => {
    return new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI!,
      scope: 'read:user user:email',
    });
  }, []);

  const handleGithubLogin = useCallback(() => {
    setIsLoading(true);
    window.location.href = `https://github.com/login/oauth/authorize?${githubParams.toString()}`;
  }, [githubParams]);

  return (
    <button
      type="button"
      onClick={handleGithubLogin}
      disabled={isLoading}
      className="relative flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
      aria-label={`Continue with ${title}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black">
        <FaGithub className="h-5 w-5" />
      </span>
      <span>Continue with {title}</span>
      {isLoading && (
        <span className="absolute right-4 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
    </button>
  );
};

export default GithubSignIn
