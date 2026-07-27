import React from 'react'
import { authService } from '../../features/auth/services/authService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {GoogleLogin} from "@react-oauth/google"
import { useAppDispatch } from '../../features/auth/hooks/storeHook';
import { loginSuccess } from '../../features/auth/store/authSlice';

const GoogleAuthButton = () => {

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const handleSuccess = async (credentialResponse: any) => {
        if (!credentialResponse.credential) return;
        try {
            const res = await authService.loginWithGoogle(credentialResponse.credential)
            dispatch(loginSuccess(res.data.data.user))
            navigate('/')
        } catch (error:any) {
            console.log(error)
            toast.error(error.response?.data.message || "Something went wrong")
        }
    }

  return (
    <GoogleLogin onSuccess={handleSuccess} onError={()=>console.error("Google popup failed")}/>
  )
}

export default GoogleAuthButton