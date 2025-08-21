'use client'

import Link from 'next/link'
import React, { useEffect } from 'react'
// import LoginForm from './LoginForm'
import {motion} from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/motion';
import LoginForm from './login-form';
const Login = () => {    

  return (
    <div className='overflow-hidden'>
    {/* <div className='main'>
        <div className='gradient'/>
      </div> */}
     <div className="bg-transparent relative z-40 dark:bg-gray-900">
      <div className="flex justify-center items-center h-screen rounded-xl">
        <div
          className="hidden bg-cover lg:block lg:w-3/5 rounded-xl h-full"
          
        >
           <div className="flex items-end  h-fit px-10 py-10 bg-gray-900/10">
            <div>
              <Link href={'/'} className=" font-bold text- text-white sm:text-3xl">
              <div>
              {/* <Image src="/images/scanerio_transparent.png" alt="logo" width={200} height={200} /> */}
              <h1 className='pb-2 text-sm text-black'>Scanerio</h1>
              </div>
              </Link>
              <p className=" text-2xl font-bold mt-1 text-black ">
                {/* Professional Website Audits In Minutes. */}
                Get comprehensive performance reports with actionable insights to boost your website{'`'}s speed, security and user experience.
              </p>
            </div>
          </div>
          <video src={'/scan.mp4'} autoPlay loop muted className='h-[80%] w-full object-cover
          '>
            {/* <source src="/scan.mp4" type="video/mp4" /> */}
          </video>
         
        </div>

        <motion.div variants={staggerContainer()} initial="hidden"
      animate="show" className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <motion.div  className="flex-1">
            <div className="text-center">
              <motion.div
              variants={fadeIn('up', 'tween', 0.1, 1)}
              className="flex justify-center mx-auto">
                <Link href='/' className="text-2xl cursor-pointer font-bold sm:text-3xl">
                <h1>

                Scanerio
                </h1>
                
                </Link>
                
              </motion.div>

              <motion.p variants={fadeIn('up', 'tween', 0.2, 1)} className="mt-3 text-gray-500 dark:text-gray-300">Login to access your account</motion.p>
            </div>
              {/* <> */}
              
            <div className="mt-0">
                <LoginForm />

              {/* <p className="mt-6 text-sm text-center text-gray-400">
                Already have an account?{' '}
                <a href="#" className="text-green-500 focus:outline-none focus:underline hover:underline">
                  Log In
                </a>
                .
              </p> */}
            </div>
              {/* </> */}
          </motion.div>
        </motion.div>
      </div>
    </div>
    </div>
  )
}

export default Login