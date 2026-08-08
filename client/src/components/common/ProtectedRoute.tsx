import React from 'react'
import { useAppSelector } from '../../hooks/storeHook'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
    const { user, isAuthenticated } = useAppSelector((state) => state.auth)
    if(!user && !isAuthenticated) return <Navigate to={"/login"}/>
    return <Outlet/>
}

export default ProtectedRoute