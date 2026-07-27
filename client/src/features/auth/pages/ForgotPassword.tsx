import React, { useState } from 'react'
import {Form} from '../../../components/common/Form'
import { InputField } from '../../../components/common/InputField'
import { Button } from '../../../components/common/Button'
import { useForm } from 'react-hook-form'
import { forgotSchema, type ForgotFormData } from '../validation/forgotSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '../api/authApi'
import toast from 'react-hot-toast'

const ForgotPassword = () => {

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotFormData>({
        resolver: zodResolver(forgotSchema),
        mode:'onSubmit'
    })

    const [isSend, setIsSend] = useState(false)
    const [email, setEmail] = useState("")

    const onSubmit = async (data: ForgotFormData) => {
        try {
            setEmail(data.email)
            await authApi.forgotPassword(data)
            setIsSend(true)
        } catch (error:any) {
            console.log(error)
            toast.error(error.response?.data.message || "Something went wrong")
        }
    }


    return (isSend ? (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-8">
      
      {/* Main Card Container */}
      <div className="w-full max-w-[98%] md:max-w-[40%] bg-gradient-to-b from-[#BFE7FF] via-[#e4f6fb] to-[#FEFFE8] rounded-[2.5rem] p-6 md:p-10 shadow-sm flex flex-col gap-6 md:gap-8">
        
        {/* Logo */}
        <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
          At<span className="text-red-500">.</span>Hand
        </div>
        
        {/* Content Section */}
        <div className="flex flex-col items-center text-center mt-2 mb-4">
          
          {/* Email Icon Illustration */}
          <div className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center shadow-sm mb-6">
            <svg 
              className="w-10 h-10 text-gray-800" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Check your email
          </h2>
          
          <p className="text-gray-600 font-medium text-[1.05rem] leading-relaxed max-w-sm">
            If an account exists for <span className="font-bold text-gray-900">{email.slice(0,2)+"....."+email.split('@')[1]}</span>, we have sent a password reset link.
          </p>
          
          <div className="mt-8 text-sm text-gray-500">
            Didn't receive the email?{' '}
            <button className="text-gray-900 font-semibold underline decoration-2 underline-offset-4 hover:text-black transition-colors">
              Click to resend
            </button>
          </div>
          
        </div>

        {/* Action Button */}
        <div className="flex justify-center pb-2">
          <a 
            href="/login" 
            className="w-full sm:w-auto px-10 py-3 rounded-xl font-medium transition-colors duration-200 text-sm bg-[#2A2A2A] hover:bg-black text-white shadow-md text-center"
          >
            Back to login
          </a>
        </div>

      </div>
    </div>
    ) : (
      <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-8">
        <div className="w-full max-w-[98%] md:max-w-[40%] bg-gradient-to-b from-[#BFE7FF] via-[#e4f6fb] to-[#FEFFE8] rounded-[2.5rem] p-6 md:p-10 shadow-sm flex flex-col gap-12 md:gap-8">
            <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                At<span className="text-red-500">.</span>Hand
                </div>
                <div>

                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">Recover Password</h2>
                    <p className="text-gray-500 mt-1">Enter email linked to your account.</p>
                </div>
                <Form onSubmit={handleSubmit(onSubmit)}>
                            <InputField placeholder='Email' label={errors.email?.message} {...register('email')} />
                    <div className='w-full flex justify-end'>

                                <Button disabled={isSubmitting}>{ isSubmitting ? "Submitting..." : "Submit" }</Button>
                    </div>
                </Form>
                </div>

        </div>
        </div >
    
    ))
}

export default ForgotPassword