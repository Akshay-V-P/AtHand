import React from 'react'
import { useRoutes } from 'react-router-dom'
import AuthRoutes from "../features/auth/AuthRoutes"
import customerRoute from '../features/customer/routes/CustomerRoutes'
import ProviderRoutes from '../features/provider/routes/ProviderRoutes'
import adminRoutes from '../features/admin/routes/adminRoutes'

const combinedRoutes = [
  ...AuthRoutes,
  ...customerRoute,
  ...ProviderRoutes,
  ...adminRoutes
]

const AppRoutes = () => {
    return useRoutes(combinedRoutes)
}

export default AppRoutes