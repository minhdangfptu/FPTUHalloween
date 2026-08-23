import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'

const toastOptions = {
  style: {
    color: 'var(--color-toast-text)',
    background: 'var(--color-toast-background)',
    border: '1px solid var(--color-toast-border)',
    boxShadow: 'var(--color-toast-shadow)',
  },
  success: {
    iconTheme: {
      primary: 'var(--color-toast-success)',
      secondary: 'var(--color-toast-background)',
    },
  },
  error: {
    iconTheme: {
      primary: 'var(--color-toast-error)',
      secondary: 'var(--color-toast-background)',
    },
  },
  loading: {
    iconTheme: {
      primary: 'var(--color-toast-loading)',
      secondary: 'var(--color-toast-loading-track)',
    },
  },
}

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Toaster position="top-center" toastOptions={toastOptions} />
  </>,
)
