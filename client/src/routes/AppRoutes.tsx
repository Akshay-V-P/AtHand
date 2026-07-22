import React from 'react'
import { useRoutes } from 'react-router-dom'
import AuthRoutes from "../features/auth/AuthRoutes"
import homeRoute from '../features/home/HomeRoutes'

const AppRoutes = () => {
    return useRoutes([
      ...AuthRoutes,
      ...homeRoute
  ])
}

export default AppRoutes