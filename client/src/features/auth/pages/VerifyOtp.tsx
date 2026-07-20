import React, { useEffect, useState } from 'react'
import { InputField } from '../../../components/common/InputField'
import { Button } from '../../../components/common/Button'
import { authService } from '../services/authService'
import { useForm } from 'react-hook-form';
import { verifyOtpSchema, type VerifyOtpFormData } from '../validation/verifyOtpSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import type { VerifyOtpDto } from '../dtos/VerifyOtpDto';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface OtpStatusResponse{
  canResend: boolean;
  remainingTime: number;
}

const VerifyOtp = () => {
  const [data, setData] = useState<OtpStatusResponse>({ canResend: false, remainingTime: 0 })
  const { register, handleSubmit, formState: { errors } } = useForm<VerifyOtpFormData>({
    resolver:zodResolver(verifyOtpSchema)
  })
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const onSubmit = async(data:VerifyOtpFormData) => {
    try {
      setLoading(true)
      await authService.verifyOtp(data)

      toast.success("Account verified")
      navigate("/login")
    } catch (error:any) {
      if (error.response?.status === 401) {
        toast.error("Session expired")
        navigate('/signup')
        return
      }

      toast.error(error.response?.data.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      setLoading(true)
      const response = await authService.resendOtp()
      console.log(response.data)

      setData({
        canResend: false,
        remainingTime:response.data.data.remainingTime
      })
    } catch (error: any) {
      console.log(error.response)
      if (error.response?.status === 401) {
        toast.error("Session expired")
        navigate('/signup')
        return
      }

      toast.error(error.response?.data.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    authService
      .otpStatus()
      .then(response => setData(response.data))
      .catch(error => console.error(error));
    
  }, [])

  useEffect(() => {
    if (data.remainingTime <= 0) {
      setData(prev => ({
        ...prev,
        canResend: true,
      }));
      return;
    }

    const timer = setInterval(() => {
      setData(prev => ({
        ...prev,
        remainingTime: prev.remainingTime - 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [data.remainingTime]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      
      {/* Centered Card Container (Smaller width for OTP page) */}
      <div className="w-full max-w-md bg-gradient-to-b from-[#d4f0ff] via-[#e4f6fb] to-[#f6fbe3] rounded-[2.5rem] p-10 md:p-12 shadow-sm flex flex-col">
        
        {/* Logo */}
        <div className="text-3xl font-extrabold text-gray-900 tracking-tight mb-10">
          At<span className="text-red-500">.</span>Hand
        </div>
        
        {/* Main Content Area */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Enter OTP</h2>
          <p className="text-gray-600 mt-2 text-[1.05rem] font-medium">
            We have send you an OTP to your email
          </p>
        </div>

        {/* OTP Input and Actions */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <InputField 
            type="text"
            placeholder="OTP"
            {...register("otp")}
            maxLength={6}
            label={errors.otp?.message}
          />
          
          <div className="flex justify-end gap-3">
            {/* Timer Block - Styled to match the submit button from the design */}
            <div className="rounded-xl font-medium text-sm  text-black flex items-center justify-center ">
              <p className={data.canResend?"hidden transition duration-300 ease-in-out":"flex transition duration-300 ease-in-out"}>Resend OTP in { data.remainingTime}s</p>
              <Button type='button' hidden={!data.canResend} disabled={loading} className='transition duration-300 ease-in-out' onClick={handleResend}>{ loading? "Resending...":"Resend"}</Button>
            </div>
            
            <Button type="submit" hidden={data.canResend} disabled={loading} className='transition duration-300 ease-in-out' >Submit</Button>
          </div>
        </form>
        
      </div>
    </div>
  )
}

export default VerifyOtp