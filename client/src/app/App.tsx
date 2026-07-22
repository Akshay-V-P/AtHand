import React from 'react'
import AppRoutes from '../routes/AppRoutes'
import {Toaster} from "react-hot-toast"
import AuthInitializer from '../features/auth/AuthInitializer'

const App = () => {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <AuthInitializer>
        <AppRoutes/>
      </AuthInitializer>
    </>
  )
}

export default App