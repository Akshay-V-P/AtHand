import React, { useEffect } from 'react'
import { InputField } from '../../../components/common/InputField'
import { Form } from '../../../components/common/Form'
import { useForm } from 'react-hook-form'
import { loginSchema, type LoginFormData } from '../../auth/validation/loginSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { authApi } from '../../auth/api/authApi'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { adminloginSuccess } from '../store/adminSlice'
import { useAppSelector } from '../../../hooks/storeHook'

const AdminLogin = () => {

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode:"onSubmit"
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {admin, isAuthenticated, isLoading} = useAppSelector((state)=>state.admin)

  useEffect(() => {
    if(admin && isAuthenticated && !isLoading) navigate("/admin/dashboard")
  },[admin, isAuthenticated, isLoading])


  const onSubmit = async(data:LoginFormData) => {
    try {
      const loginData = {
        ...data,
        context:"ADMIN" as const
      }
      const response = await authApi.login(loginData)
      console.log(response)
      if (response.data.data.user.role.includes("ADMIN")) {
        dispatch(adminloginSuccess(response.data.data.user))
        navigate("/admin/dashboard")
      } else {
        navigate("/")
      }
    } catch (error:any) {
      console.log(error)
      toast.error(error.response.data.message || "Something went wrong")
    }
  }

  return (
    <div className="min-h-screen flex bg-[#f8f9fb] font-sans">
      
      {/* --- Left Column: Branding (Hidden on mobile) --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-900 overflow-hidden">
        {/* Background Image Setup */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("Admin-Login.jpg")' }}
        ></div>
        
        {/* Color Overlays to match the blue/purple gradient look */}
        <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a378b]/90 to-[#4744b8]/80"></div>

        {/* Branding Content */}
        <div className="relative z-10 flex flex-col justify-center p-16 xl:p-24 text-white w-full h-full">
           <div className="mb-8">
             <h2 className="text-2xl font-semibold tracking-wide flex items-center">
                At<span className="text-red-500 mx-[1px]">.</span>Hand Admin Suite
             </h2>
             {/* Green underline accent */}
             <div className="w-12 h-[3px] bg-[#4ade80] mt-3"></div>
           </div>
           
           <h1 className="text-5xl xl:text-6xl font-bold leading-tight mb-4 tracking-tight">
             Precision in every<br/>repair.
           </h1>
        </div>
      </div>

      {/* --- Right Column: Login Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="max-w-[420px] w-full">
          
          {/* Form Header */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h2>
          <p className="text-gray-500 mb-8 text-sm">
            Enter your credentials to manage your workshop.
          </p>

          {/* Login Form */}
          <Form onSubmit={handleSubmit(onSubmit)}>
            
            <InputField
              label={errors.email?.message}
              inputLabel='Email Address'
              {...register('email')}
            />
            

            <InputField
              label={errors.password?.message}
              inputLabel='Password'
              {...register('password')}
            />

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full mt-2 flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-all duration-200"
            >
              {isSubmitting? "Loading...": "Sign In"}
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            
          </Form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin