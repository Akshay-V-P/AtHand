import React from 'react'
import { useRoutes } from 'react-router-dom'
import AuthRoutes from "../features/auth/AuthRoutes"
import customerRoute from '../features/customer/routes/CustomerRoutes'

const AppRoutes = () => {
    return useRoutes([
      ...AuthRoutes,
      ...customerRoute
  ])
}

export default AppRoutes