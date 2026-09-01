import React, { useEffect } from 'react'
import { useAppDispatch } from '../../hooks/storeHook'
import { authService } from './services/authService'
import { loginSuccess, setIsLoading } from './store/authSlice'
import { adminloginSuccess, adminSetIsLoading } from '../admin/store/adminSlice'
import { useLocation } from 'react-router-dom'

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {

    const dispatch = useAppDispatch()
    const location = useLocation()

    

    useEffect(() => {
        const initializeAuth = async () => {
            dispatch(setIsLoading(true))
            dispatch(adminSetIsLoading(true))
            try {
                
                if (location.pathname.startsWith("/admin")) {
                    await authService.adminRefresh()
                    const response = await authService.refresh({ context: "ADMIN" })


                    dispatch(adminloginSuccess(response.data.data))
                } else {
                    await authService.refreshTokens()
                    const response = await authService.refresh({ context: "USER" })
                    console.log(response.data.data)

                    dispatch(loginSuccess(response.data.data))
                }

            } catch (error) {
                console.log(error)
            } finally {
                dispatch(setIsLoading(false))
                dispatch(adminSetIsLoading(false))
            }
        }

        initializeAuth()

    }, [dispatch])

  return (
      <>{ children}</>
  )
}

export default AuthInitializer