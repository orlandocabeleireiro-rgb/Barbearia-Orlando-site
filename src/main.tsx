import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { MotionProvider } from './context/MotionContext'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MotionProvider>
      <App />
    </MotionProvider>
  </React.StrictMode>,
)
