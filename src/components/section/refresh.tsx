'use client';
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React,{ Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader } from "@/components/elements/loader";
import { refreshTokenApi } from "@/app/api/global-api";

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
  const [isSubmitting,setIsSubmitting] = useState(false);
  const [message,setMessage] = useState("Refreshing session");

  useEffect(() => {
    const run = async () => {
      // const token = params.get('token');
      // if (!token) {
      //   toast.error('Missing refresh token');
      //   router.replace('/');
      //   return;
      // }

      try {
        setIsSubmitting(true);
        setMessage('Refreshing session');
        const request = refreshTokenApi({});//axios.post('/v1/user/auth/refresh', {}, { withCredentials: true });
        toast.promise(request, {
          loading: 'Refreshing session…',
          success: 'Session refreshed. Redirecting…',
          error: (err)=>{
            router.replace('/logout');
            return 'Refresh failed. Redirecting to login…';
          },
        });

        const response = await request;
        if (response.status === 200) {
          setMessage('Redirecting…');
          router.replace(`${REDIRECT_URL}`);
        } else {
          router.replace('/');
        }
      } catch (error) {
        router.replace('/');
      } finally {
        setIsSubmitting(false);
      }
    };

    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex justify-center items-center h-64">
      <Loader isLoading={true} message={message} />
    </div>
  );
}
export default Refresh;
