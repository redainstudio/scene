import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const path = window.location.pathname.replace(/\/+$/, '')
const page = path === '/hero2' ? import('./Hero2.jsx') : import('./App.jsx')

page.then(({ default: Page }) => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Page />
    </StrictMode>
  )
})
