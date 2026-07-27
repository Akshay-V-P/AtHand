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
import { useTogglePassword } from '../hooks/useTogglePassword'
import GoogleAuthButton from '../../../components/auth/GoogleAuthButton'

const Register = () => {

  const navigate = useNavigate()
  const [inputType, toggelVisibility] = useTogglePassword()

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

              <InputField type={inputType} placeholder="Password" {...register("password")} error={errors.password?.message} />
              <InputField type={inputType} placeholder="Confirm password" {...register("confirmPassword")} error={errors.confirmPassword?.message} />
              <div className='flex gap-2 px-4'>
                                <input type="checkbox" name="Show password" id="" className='cursor-pointer' onChange={toggelVisibility}/>
                                <p className='text-[12px] text-gray-500'> Show password</p>
                            </div>

              <div className="flex justify-center pt-4">
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Create account"}</Button>
              </div>
            </form>

            <Divider />

            {/* Social Login & Redirect */}
            <div className="flex flex-col items-center space-y-6">
              <GoogleAuthButton/>

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