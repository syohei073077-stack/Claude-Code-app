import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SleepApp from './SleepApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SleepApp />
  </StrictMode>,
)
