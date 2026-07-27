import React from 'react'
import { useRoutes } from 'react-router-dom'
import AuthRoutes from "../features/auth/AuthRoutes"
import homeRoute from '../features/home/HomeRoutes'
import accountRoutes from '../features/profile/routes/AccountRoutes'

const AppRoutes = () => {
    return useRoutes([
      ...AuthRoutes,
      ...homeRoute,
      ...accountRoutes,
  ])
}

export default AppRoutes