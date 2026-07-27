import React from 'react'
import { type RouteObject } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyOtp from './pages/VerifyOtp'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import UpdatePassword from './pages/UpdatePassword'

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
    },
    {
        path: '/forgot-password',
        element:<ForgotPassword/>
    },
    {
        path: '/reset-password',
        element:<ResetPassword/>
    },
    {
        path: '/update-password',
        element:<UpdatePassword/>
    }
]

export default authRoutes