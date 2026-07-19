import React from 'react'
import { type RouteObject } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyOtp from './pages/VerifyOtp'

const authRoutes:RouteObject[] = [
    {
        path: '/login',
        element:<Login/>
    }, {
        path: '/signup',
        element:<Register/>
    },
    {
        path: '/verify-otp',
        element:<VerifyOtp/>
    }
]

export default authRoutes