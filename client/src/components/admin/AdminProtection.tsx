import React from 'react'
import { useAppSelector } from '../../hooks/storeHook'
import { Navigate, Outlet } from 'react-router-dom'

const AdminProtection = () => {
    const { admin, isAuthenticated, isLoading } = useAppSelector((state) => state.admin)
    
    if (isLoading) return <div>Loading...</div>
    
    if (!admin && !isAuthenticated) return <Navigate to={"/admin/login"} />

    return <Outlet/>
}

export default AdminProtection