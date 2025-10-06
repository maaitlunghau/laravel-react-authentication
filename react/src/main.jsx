import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import { ContextProvider } from './contexts/ContextProvider'
import { ToastContainer } from "react-toastify"
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={`${import.meta.env.VITE_GOOGLE_CLIENT_ID}`}>
      <ContextProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </ContextProvider>
    </GoogleOAuthProvider>
  </StrictMode >
)
