'use client';

import { Button } from '@/components/ui/button';
import { Mail, Send, SendHorizonal } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/motion';
// import { useStore } from '@/store/store';
import Link from 'next/link';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import axios from 'axios';
import { postAudit } from '@/app/api/global-api';
import { Loader } from '../elements/loader';
import { FaGithub } from 'react-icons/fa';
import GoogleSignInBtn from '@/utils/google-sign-in-btn';
import GithubSignIn from '@/utils/github-sign-in-btn';
import { getCookie } from '@/lib/cookies';

interface FormData {
  email: string;
  otp: string;
}

const LoginForm=()=>{
  return(
    <Suspense fallback={<div className='flex items-center justify-center'>Loading...</div>}
     ><LoginFormModule />
    </Suspense>
  )
}

const LoginFormModule: React.FC = () => {
    const REDIRECT_URL=process.env.NEXT_PUBLIC_REDIRECT_URL
    const [_window,SetWindow]=useState<any>(null);
  const [showOtpField, setShowOtpField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
const [loadingMessage,setLoadingMessage]=useState("Starting Audit");
const [otpHint,setOtpHint]=useState('');
  const form = useForm<FormData>();
  const params = useSearchParams();
  console.log(params.get('url'))
  console.log(params.get('error'))
  const router = useRouter();  
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
    if(params.get('error')){
      toast.error(params.get('error'));
      // params.delete();
    }else if(params.get('session')){
      setLoadingMessage('Verifying Github...');

        setIsSubmitting(true);
githubLogin(params.get('session'));
    }
  }, [params]);

  const githubLogin=async(code:any)=>{
        try {
              const response = axios.post('/v1/user/auth/github/verify',{code});
              toast.promise(response,{
                loading:'Verifying Github...',
                success:(data)=>{console.log(params.get('url'),params.get('url')!==undefined,params.get('url')!==null)
      if(params.get('url')&&params.get('url')!==undefined&&params.get('url')!==null){
        setLoadingMessage("Starting Audit");
        setIsSubmitting(true);
        setTimeout(() => {
          router.push(`${REDIRECT_URL}/reports/${data?.data?.submitUrl?.uuid}`);
          
        },2000)
    }else{
      // _window.location=REDIRECT_URL;
      router.push(`${REDIRECT_URL}`);
    }
                  return'Login successful!';
                },
                error:(errors)=>{
                  setIsSubmitting(false);
                  return 'Login Failed';
                }
              })
  //              if (response.status === 200) {
  //       toast.success('Login successful!');
  //       // if (jobId !== '') {
  //       //   router.push(`/report/${jobId}`);
  //       // } else {
          
  // }
        } catch (error:any) {
          setIsSubmitting(false);
        }

  }
  
//   const jobId = useStore((state) => state.jobID);
  const { register, handleSubmit, formState: { errors }, setValue } = form;
  const emailValue = form.watch('email');

  const handleSendOtp = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/v1/user/auth/otp/send', { email });
      
      if (response.status === 200) {
        toast.success('OTP sent successfully!');
      setShowOtpField(true);
      setOtpHint(`We sent a 6-digit code to ${email.toLowerCase()}.`);
  
      } else {
        toast.error(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'An error occurred while sending OTP');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!emailValue) {
      toast.error('Please enter your email before requesting a new code.');
      return;
    }
    await handleSendOtp(emailValue.toLowerCase());
  };

  const handleEditEmail = () => {
    setShowOtpField(false);
    setValue('otp', '');
    setOtpHint('');
  };

    const submitAudit=async(audit:string)=>{
    setIsSubmitting(true);
    await postAudit({
      url:audit
    }).then(res=>{
      console.log(res)
      // setTimeout(() => {
        
      //   router.push(`${REDIRECT_URL}/reports/${res?.data?.uuid}`);
      // },5000)
    }).catch(err=>{console.log(err)});

  }

  const url =params.get('url');
  const subscriptionId=params.get('subscriptionId');
  const subscriptionType=params.get('subscriptionType');

  const onSubmit = async (data: FormData) => {
    if (!data.email) {
      toast.error('Please enter your email');
      return;
    }

    if (!showOtpField) {
      await handleSendOtp(data.email);
      return;
    }

    if (!data.otp || data.otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/v1/user/auth/otp/verify', {
        email: data.email.toLowerCase(),
        otp: data.otp.toLowerCase(),
        ...(subscriptionId&&subscriptionId!==undefined&&subscriptionId!==null&&{subscriptionId:subscriptionId}),
        ...(subscriptionType&&subscriptionType!==undefined&&subscriptionType!==null&&{subscriptionType:subscriptionType}),

        ...(url&&url!==undefined&&url!==null&&{url:url}),
      },{
        withCredentials:true
      });

      if (response.status === 200) {
        toast.success('Login successful!');
        // if (jobId !== '') {
        //   router.push(`/report/${jobId}`);
        // } else {
          console.log(params.get('url'),params.get('url')!==undefined,params.get('url')!==null)
      if(params.get('url')&&params.get('url')!==undefined&&params.get('url')!==null){
        setLoadingMessage("Starting Audit");
        setIsSubmitting(true);
        setTimeout(() => {
          router.push(`${REDIRECT_URL}/reports/${response?.data?.submitUrl?.uuid}`);
          
        },2000)
    }else{
      // _window.location=REDIRECT_URL;
      router.push(`${REDIRECT_URL}`);
    }
        // }
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Login failed');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

 if(isSubmitting){
  return (
    <div className="flex justify-center items-center h-64">
      <Loader message={loadingMessage} isLoading={isSubmitting} />
    </div>
  );
}

  return (
    <motion.div 
      className="w-full max-w-sm h-full p-6 relative top-[50%] m-auto mx-auto dark:bg-gray-800"
      variants={staggerContainer()}
      initial="hidden"
      animate="show"
    >
      <motion.form 
        onSubmit={handleSubmit(onSubmit)} 
        className="mt-6"
        variants={fadeIn('up', 'tween', 0.2, 1)}
      >
        <motion.div 
          variants={fadeIn('up', 'tween', 0.4, 1)}
          className="mt-4"
        >
          <div className="rounded-2xl border border-slate-200/70 bg-white/50 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Step 1
                </p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  Send verification code
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  We'll email a magic code to{' '}
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {emailValue || 'your inbox'}
                  </span>
                  .
                </p>
              </div>
              <span className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${showOtpField ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                {showOtpField ? 'Code sent' : 'Required'}
              </span>
            </div>
            <div className="relative mt-4 flex items-center rounded-xl border border-slate-200 bg-white/80 px-2 py-1 focus-within:ring-2 focus-within:ring-emerald-300 dark:border-slate-600 dark:bg-slate-900">
              <Mail className="ml-2 text-slate-400" />
              <input
                type="email"
                id="email"
                {...register("email", { required: true })}
                placeholder="Enter your work email"
                className="w-full bg-transparent px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-white"
                disabled={showOtpField || isLoading}
              />
            </div>
          </div>
        </motion.div>
        {errors.email && (
          <motion.span 
            className="text-red-500 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Email is required
          </motion.span>
        )}

        {showOtpField && (
          <motion.div
            className="mt-4"
            initial="hidden"
            animate="show"
          >
            <div className="rounded-2xl border border-slate-200/70 bg-white/60 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                    Step 2
                  </p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    Verify the code
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter the 6-digit code sent to your email to continue.
                  </p>
                  {otpHint && (
                    <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-300">
                      {otpHint}
                    </p>
                  )}
                </div>
                <span className="inline-flex h-7 items-center rounded-full bg-blue-50 px-3 text-xs font-semibold text-blue-600 dark:bg-blue-400/10 dark:text-blue-200">
                  Secure login
                </span>
              </div>

              <div className="mt-4">
                <InputOTP 
                  maxLength={6} 
                  {...register('otp', { required: true, minLength: 6 })}
                  onChange={(value) => setValue('otp', value)}
                  disabled={isLoading}
                  className='border-none'
                >
                  <InputOTPGroup className='gap-3 *:data-[slot=input-otp-slot]:rounded-2xl *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:border-slate-200 *:data-[slot=input-otp-slot]:bg-white/80 *:data-[slot=input-otp-slot]:text-lg *:data-[slot=input-otp-slot]:font-semibold dark:*:data-[slot=input-otp-slot]:border-slate-600 dark:*:data-[slot=input-otp-slot]:bg-slate-900/70'>
                    {[...Array(6)].map((_, index) => (
                      <InputOTPSlot key={index} index={index} className='h-12 w-12 text-center text-slate-900 dark:text-white' />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {errors.otp && (
                <motion.span 
                  className="text-red-500 text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Please enter a valid 6-digit OTP
                </motion.span>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="rounded-full border border-slate-200 px-4 py-1 font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500"
                >
                  Resend code
                </button>
                <span className="hidden text-slate-300 sm:inline">•</span>
                <button
                  type="button"
                  onClick={handleEditEmail}
                  className="font-semibold text-slate-600 underline-offset-4 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Change email
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div 
          className="mt-6"
          variants={fadeIn('up', 'tween', 0.8, 1)}
        >
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#058296] px-6 py-2.5 text-sm flex items-center justify-center font-medium tracking-wide text-white capitalize transition-colors duration-300 transform rounded-lg hover:bg-green-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : showOtpField ? (
                'Verify OTP'
            ) : (
              'Send OTP'
            )}
            {!isLoading&& <SendHorizonal className="ml-2 h-5 w-5" />}
           
          </motion.button>

        </motion.div>
                <motion.div
                variants={fadeIn('up', 'tween', 0.8, 1)}
                className="flex items-center justify-between mt-4">
            <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>

            <p className="text-xs text-gray-500 uppercase dark:text-gray-400">or Continue with</p>

            <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
        </motion.div>
        <motion.div
        variants={fadeIn('up', 'tween', 0.8, 1)}
        className="grid grid-cols-1 mt-5 gap-5 dark:bg-gray-800">
   <GoogleSignInBtn title='Google'/>
    <GithubSignIn title='Github'/>
</motion.div>
      </motion.form>
    </motion.div>
  ); 
};

export default LoginForm;
