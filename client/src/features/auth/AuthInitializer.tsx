import React, { useEffect } from 'react'
import { useAppDispatch } from '../../hooks/storeHook'
import { authService } from './services/authService'
import { loginSuccess, setIsLoading } from './store/authSlice'
import { adminloginSuccess, adminSetIsLoading } from '../admin/store/adminSlice'
import { useLocation } from 'react-router-dom'
import { apiService } from '../provider/applyAsProvider/services/apiService'
import { setProvider } from '../provider/applyAsProvider/store/providerSlice'

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

                    const userData = response.data.data;
                    dispatch(loginSuccess(userData));

                    if (userData && userData.role && userData.role.includes("PROVIDER")) {
                        try {
                            const providerResponse = await apiService.getProvider(userData.id);
                            if (providerResponse?.data?.data) {
                                dispatch(setProvider(providerResponse.data.data));
                            }
                        } catch (err) {
                            console.error("Failed to fetch provider info during auth initialization", err);
                        }
                    }
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
        <>{children}</>
    )
}

export default AuthInitializer