import React, { useEffect } from 'react'
import { useAppDispatch } from '../../hooks/storeHook'
import { authService } from './services/authService'
import { loginSuccess } from './store/authSlice'

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {

    const dispatch = useAppDispatch()

    useEffect(() => {
        authService.refresh()
            .then(response => {
                dispatch(loginSuccess(response.data.data))
            })
            .catch(error => console.log(error));
    }, [dispatch])

  return (
      <>{ children}</>
  )
}

export default AuthInitializer