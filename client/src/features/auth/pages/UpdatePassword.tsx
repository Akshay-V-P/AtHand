import React from 'react'
import { InputField } from '../../../components/common/InputField'
import { Button } from '../../../components/common/Button'
import { updatePasswordSchema, type UpdateFormData } from '../validation/updatePasswordSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { authService } from '../services/authService'
import { useForm } from 'react-hook-form'
import { useAppSelector } from '../../../hooks/storeHook'
import type { VerifyPasswordDto } from '../dtos/VerifyPasswordDto'
import { Form } from '../../../components/common/Form'
import { useNavigate } from 'react-router-dom'

const UpdatePassword = () => {

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UpdateFormData>({
        resolver: zodResolver(updatePasswordSchema),
        mode:'onSubmit'
    })
    const { user, isAuthenticated } = useAppSelector((state) => state.auth)
    const navigate = useNavigate()

    const onSubmit = async (data:UpdateFormData) => {
        try {
            const payload:VerifyPasswordDto = {email:user?.email!, password:data.password}
            await authService.verifyPassword(payload)
            toast.success("Reset link has been sent to your email")
            navigate(-1)
        } catch (error:any) {
            console.log(error)
            toast.error(error.response?.data.message || "Something went wrong")
        }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-8">
            <div className="w-full max-w-[98%] md:max-w-[40%] bg-gradient-to-b from-[#BFE7FF] via-[#e4f6fb] to-[#FEFFE8] rounded-[2.5rem] p-6 md:p-10 shadow-sm flex flex-col gap-12 md:gap-8">
                <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    At<span className="text-red-500">.</span>Hand
                    </div>
                    <div>
    
                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-900">Change Password</h2>
                        <p className="text-gray-500 mt-1">Enter your current password.</p>
                    </div>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                                <InputField placeholder='Password' type='password' label={errors.password?.message} {...register('password')} />
                        <div className='w-full flex justify-end'>
    
                            <Button disabled={isSubmitting}>{ isSubmitting ? "Submitting..." : "Submit" }</Button>
                        </div>
                    </Form>
                    </div>
    
            </div>
            </div >
  )
}

export default UpdatePassword