import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'

const storedTheme = localStorage.getItem('theme')
if (storedTheme === 'dark' || storedTheme === 'light') {
  document.documentElement.dataset.theme = storedTheme
}

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Toaster position="top-center" />
  </>,
)
