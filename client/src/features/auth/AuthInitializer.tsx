import React, { useEffect, useRef } from 'react'
import { useAppDispatch } from '../../hooks/storeHook'
import { authService } from './services/authService'
import { setIsLoading } from './store/authSlice'
import { adminloginSuccess, adminSetIsLoading } from '../admin/store/adminSlice'
import { useLocation } from 'react-router-dom'
import { initializeAuthenticatedUser } from './utils/initializeUser'

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch()
    const location = useLocation()

    // Capture the initial path on mount to prevent re-running on route changes
    const initialPath = useRef(location.pathname)

    useEffect(() => {
        const initializeAuth = async () => {
            const path = initialPath.current;

            try {
                if (path.startsWith("/admin")) {
                    dispatch(adminSetIsLoading(true))
                    await authService.adminRefresh()
                    const response = await authService.refresh({ context: "ADMIN" })
                    dispatch(adminloginSuccess(response.data.data))
                } else {
                    dispatch(setIsLoading(true))
                    await authService.refreshTokens()
                    const response = await authService.refresh({ context: "USER" })
                    const userData = response.data.data;
                    await initializeAuthenticatedUser(dispatch, userData);
                }
            } catch (error) {
                console.error("Auth initialization failed:", error)
            } finally {
                if (path.startsWith("/admin")) {
                    dispatch(adminSetIsLoading(false))
                } else {
                    dispatch(setIsLoading(false))
                }
            }
        }

        initializeAuth()
    }, [dispatch])

    return (
        <>{children}</>
    )
}

export default AuthInitializer