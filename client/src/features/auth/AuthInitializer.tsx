import React, { useEffect } from 'react'
import { useAppDispatch } from '../../hooks/storeHook'
import { authService } from './services/authService'
import { loginSuccess, setIsLoading } from './store/authSlice'

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(setIsLoading(true))
        authService.refresh()
            .then(response => {
                dispatch(loginSuccess(response.data.data))
            })
            .catch(error => console.log(error))
            .finally(()=>dispatch(setIsLoading(false)))

    }, [dispatch])

  return (
      <>{ children}</>
  )
}

export default AuthInitializer