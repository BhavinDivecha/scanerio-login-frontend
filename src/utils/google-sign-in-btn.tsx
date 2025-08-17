import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import React from 'react'
interface GoogleBtnProps{
    title:string;
}
const GoogleSignInBtn:React.FC<GoogleBtnProps> = ({title}) => {
    const router=useRouter();
      const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
        
        console.log(tokenResponse);
        router.push(process.env.NEXT_PUBLIC_REDIRECT_URL!);
    
    },
    onError: () => console.log("Login Failed"),
  });
  return (
    <button type="button" onClick={() => login()} className="px-4 py-2 font-semibold border flex gap-2 items-center w-full justify-center border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
        <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"/>
        <span>{title}</span>
    </button>
  )
}

export default GoogleSignInBtn