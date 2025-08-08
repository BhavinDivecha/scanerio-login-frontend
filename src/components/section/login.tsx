'use client'

import Link from 'next/link'
import React from 'react'
// import LoginForm from './LoginForm'
import {motion} from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/motion';
import LoginForm from './login-form';
import Image from 'next/image';

const Login = () => {
  return (
    <div className='overflow-hidden'>
    <div className='main'>
        <div className='gradient'/>
      </div>
     <div className="bg-transparent relative z-40 dark:bg-gray-900">
      <div className="flex justify-center h-screen">
        <div
          className="hidden bg-cover lg:block lg:w-3/5 "
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1752867494500-9ea9322f58c9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
              height: '100vh',
          }}
        >
          <div className="flex items-center h-full px-20 bg-gray-900/10">
            <div>
              <Link href={'/'} className="text-2xl font-bold text-white sm:text-3xl">
              <div>
              <Image src="/images/scanerio_transparent.png" alt="logo" width={200} height={200} />
              {/* <h1>Scanerio</h1> */}
              </div>
              </Link>
              <p className="max-w-xl mt-1 text-gray-300">
                Professional Website Audits In Minutes.
                Get comprehensive performance reports with actionable insights to boost your website{'`'}s speed, security and user experience.
              </p>
            </div>
          </div>
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