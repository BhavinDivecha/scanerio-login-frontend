'use client';
import { getCookie } from "@/lib/cookies";
import axios from "axios";
// import { useSearchParams } from "next/navigation";
import { useRouter, useSearchParams } from "next/navigation";
import React,{ Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

const Refresh=()=>{
  return(
    <Suspense fallback={<div className='flex items-center justify-center'>Loading...</div>}
     ><RefreshModule />
    </Suspense>
  )
}
const RefreshModule:React.FC=()=>{
                    const REDIRECT_URL=process.env.NEXT_PUBLIC_REDIRECT_URL;
      const params = useSearchParams();
      const router = useRouter();  
      const [loading,setIsLoading] = useState(false);
          const [_window,SetWindow]=useState<any>(null);
      
        useEffect(() => {
          // const checkLoggedIn=async ()=>{
          //   const tokenExist = getCookie('accessToken');
          //   console.log('tokenExist',tokenExist);
          // }
          // checkLoggedIn();
          if(window!=undefined){
            SetWindow(window??null);
          }
        }, [])
    useEffect(() => {
      const Refresh=async ()=>{
         try {
      const response = await axios.post('/v1/user/auth/refresh', {refresh:params.get('token')},{});

      if (response.status === 200) {
        toast.success('Login successful!');
        // if (jobId !== '') {
        //   router.push(`/report/${jobId}`);
        // } else {
         router.push(`${REDIRECT_URL}`);
        // }
      } else {
        router.push('/login');
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Login failed');
      } else {
        toast.error('An unexpected error occurred');
      }
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
      
    };
    if(params.get('token')){
      Refresh();
    }
},[]);
    
    return <>redirecting....</>;
}
export default Refresh;