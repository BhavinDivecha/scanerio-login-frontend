import { signIn } from 'next-auth/react';
import React from 'react'
import { FaGithub } from 'react-icons/fa'

interface GithubBtn{
    title:string;
}
const GithubSignIn:React.FC<GithubBtn> = ({title}) => {
//       const REDIRECT_URI = process.env.NODE_ENV === 'production' 
// ? `${process.env.GITHUB_REDIRECT_URI}`
// : 'http://localhost:3000';
  const handleGithubLogin = () => {
    const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI!,
    // state,
    scope: "read:user user:email",
    // PKCE (S256)
    // code_challenge: challenge,
    // code_challenge_method: "S256",
    // optional: "allow_signup": "false"
  });
  console.log({
    client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI!,
    // state,
    scope: "read:user user:email",
    // PKCE (S256)
    // code_challenge: challenge,
    // code_challenge_method: "S256",
    // optional: "allow_signup": "false"
  })
  const githubAuthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
  window.location.href = githubAuthUrl;
};
  return (
    <button type="button" onClick={() => handleGithubLogin()} className="px-4 font-semibold py-2 bg-black border flex gap-2 items-center w-full justify-center border-slate-200 dark:border-slate-700 rounded-lg text-white dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500  dark:hover:text-slate-300 hover:shadow transition duration-150">
        {/* <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"/> */}
        <FaGithub />
        <span>{title}</span>
    </button>
  )
}

export default GithubSignIn