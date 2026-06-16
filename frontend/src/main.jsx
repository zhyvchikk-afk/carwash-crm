import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { registerSW } from 'virtual:pwa-register'

import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'


registerSW({
  immediate: true,
})


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toaster position='top-center' reverseOrder={false}/>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
