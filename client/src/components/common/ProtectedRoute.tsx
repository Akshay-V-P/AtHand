import React from 'react'
import { useAppSelector } from '../../hooks/storeHook'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
    const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth)
    if(isLoading) return <div>Loading...</div>
    if(!user && !isAuthenticated) return <Navigate to={"/login"}/>
    return <Outlet/>
}

export default ProtectedRoute