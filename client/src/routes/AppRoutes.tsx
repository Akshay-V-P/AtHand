import React from 'react'
import { useRoutes } from 'react-router-dom'
import AuthRoutes from "../features/auth/AuthRoutes"
import customerRoute from '../features/customer/routes/CustomerRoutes'
import ProviderRoutes from '../features/provider/routes/ProviderRoutes'

const AppRoutes = () => {
    return useRoutes([
      ...AuthRoutes,
      ...customerRoute,
      ...ProviderRoutes
  ])
}

export default AppRoutes