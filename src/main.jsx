import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Load Hero2 styles from the entry bundle so they are present before
// the route's dynamically imported React component renders.
import './hero2/hero2.css'

const path = window.location.pathname.replace(/\/+$/, '')
const page = path === '/hero2' ? import('./Hero2.jsx') : import('./App.jsx')

page.then(({ default: Page }) => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Page />
    </StrictMode>
  )
})
