import React from 'react'
import { useRoutes } from 'react-router-dom'
import AuthRoutes from "../features/auth/AuthRoutes"

const AppRoutes = () => {
    return useRoutes([
      ...AuthRoutes
  ])
}

export default AppRoutes