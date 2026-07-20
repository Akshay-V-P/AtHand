import React from 'react'
import { InputField } from '../../../components/common/InputField'
import { Button } from '../../../components/common/Button'
import { Divider } from '../../../components/common/Divider'
import { useForm } from "react-hook-form"
import { registerSchema, type RegisterFormData } from '../validation/registerSchema'
import { zodResolver } from "@hookform/resolvers/zod"
import { authService } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Register = () => {

  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit"
  })

  const onSubmit = async (data: RegisterFormData) => {

    try {
      const responseData = await authService.register(data)
      if(responseData.status === 200) toast(responseData.data.message, {icon:"❗"})
      if (responseData.data.success) {
        navigate('/verify-otp')
        return
      }
    } catch (error: any) {
      if (error.response.status === 400) {
        navigate("/login")
      }
      toast.error(error.response.data.message || "Something went wrong")
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-8 font-sans">

      {/* Main Card Container */}
      <div className="w-full max-w-[1100px] bg-gradient-to-b from-[#BFE7FF] via-[#e4f6fb] to-[#FEFFE8] rounded-[2.5rem] p-10 md:p-16 lg:p-20 shadow-sm flex flex-col md:flex-row gap-12 md:gap-8">

        {/* Left Section: Branding & Copy */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
              At<span className="text-red-500">.</span>Hand
            </div>

            {/* Hero Copy */}
            <div className="mt-16 md:mt-24 max-w-md">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                Never Overpay for Repairs Again
              </h1>
              <p className="mt-6 text-[1.1rem] text-gray-600 leading-relaxed font-medium">
                Compare trusted local service providers, read real reviews, and get help instantly with AI-powered troubleshooting.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Sign Up Form */}
        <div className="flex-1 flex flex-col justify-center items-center md:items-end">
          <div className="w-full max-w-md">

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
              <p className="text-gray-500 mt-1">Start for free</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              <InputField placeholder="Full name" type='text' {...register("name")} error={errors.name?.message} />

              <div className="flex flex-col sm:flex-row gap-2 justify-between">
                <InputField type="email" placeholder="Email" className="flex-1" {...register("email")} error={errors.email?.message} />
                <InputField type="tel" placeholder="Phone" className="flex-1" {...register("phone")} error={errors.phone?.message} />
              </div>

              <InputField type="password" placeholder="Password" {...register("password")} error={errors.password?.message} />
              <InputField type="password" placeholder="Confirm password" {...register("confirmPassword")} error={errors.confirmPassword?.message} />

              <div className="flex justify-center pt-4">
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Create account"}</Button>
              </div>
            </form>

            <Divider />

            {/* Social Login & Redirect */}
            <div className="flex flex-col items-center space-y-6">
              <button className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer">
                Continue with Google
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </button>

              <a onClick={(e) => { e.preventDefault(); navigate("/login") }} className="text-gray-900 font-semibold underline decoration-2 underline-offset-4 hover:text-black transition-colors cursor-pointer">
                Already have an account
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Register