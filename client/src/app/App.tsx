import React from 'react'
import AppRoutes from '../routes/AppRoutes'
import {Toaster} from "react-hot-toast"
import AuthInitializer from '../features/auth/AuthInitializer'
import { GoogleOAuthProvider } from '@react-oauth/google'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

const App = () => {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <AuthInitializer>
        <GoogleOAuthProvider clientId={clientId}>
          <AppRoutes/>
        </GoogleOAuthProvider>
      </AuthInitializer>
    </>
  )
}

export default App