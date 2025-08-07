'use client';

import { Button } from '@/components/ui/button';
import { Mail, Send, SendHorizonal } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/motion';
// import { useStore } from '@/store/store';
import Link from 'next/link';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import axios from 'axios';
import { postAudit } from '@/api/global-api';
import { Loader } from '../elements/loader';

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
  const [showOtpField, setShowOtpField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormData>();
  const params = useSearchParams();
  console.log(params.get('url'))
  const router = useRouter();  
//   const jobId = useStore((state) => state.jobID);
  const { register, handleSubmit, formState: { errors }, setValue } = form;

  const handleSendOtp = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/v1/user/auth/send/otp', { email });
      
      if (response.status === 200) {
        toast.success('OTP sent successfully!');
      setShowOtpField(true);
  
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
      const response = await axios.post('/v1/user/auth/otp-login', {
        email: data.email.toLowerCase(),
        otp: data.otp.toLowerCase(),
      });

      if (response.status === 200) {
        toast.success('Login successful!');
        // if (jobId !== '') {
        //   router.push(`/report/${jobId}`);
        // } else {
          console.log(params.get('url'),params.get('url')!==undefined,params.get('url')!==null)
      if(params.get('url')&&params.get('url')!==undefined&&params.get('url')!==null){
        setIsSubmitting(true);
      setTimeout(() => {
        
        submitAudit(String(params.get('url')))
      },2000)
    }else{
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
      <Loader message="Starting Audit" isLoading={isSubmitting} />
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
          className='relative group flex items-center text-gray-700 bg-transparent border-2 rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-800 focus:border-green-400 dark:focus:border-green-300 focus:ring-green-300 focus:outline-none focus:ring focus:ring-opacity-40'
          variants={fadeIn('up', 'tween', 0.4, 1)}
        >
          <Mail className="relative left-3 text-gray-400" />
          <input
            type="email"
            id="email"
            {...register("email", { required: true })}
            placeholder="Enter your email"
            className="w-full px-4 py-2 ml-1 focus:outline-none group-focus:ring-2 group-focus:ring-green-400"
            disabled={showOtpField || isLoading}
          />
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
            // variants={fadeIn('up', 'tween', 0.6, 1)}
            initial="hidden"
            animate="show"
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter OTP
            </label>
            <InputOTP 
              maxLength={6} 
              {...register('otp', { required: true, minLength: 6 })}
              onChange={(value) => setValue('otp', value)}
              disabled={isLoading}
              className='border-gray-400 '
            >
              <InputOTPGroup className='border-gray-300 gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border'>
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot key={index} index={index} className='border-gray-400' />
                ))}
              </InputOTPGroup>
            </InputOTP>
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
          </motion.div>
        )}

        <motion.div 
          className="mt-6"
          variants={fadeIn('up', 'tween', 0.8, 1)}
        >
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-700 px-6 py-2.5 text-sm flex items-center justify-center font-medium tracking-wide text-white capitalize transition-colors duration-300 transform rounded-lg hover:bg-green-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
      </motion.form>
    </motion.div>
  ); 
};

export default LoginForm;