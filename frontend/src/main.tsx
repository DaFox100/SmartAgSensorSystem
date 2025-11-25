import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { DateRangeProvider } from "../src/context/DataRangeContext.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DateRangeProvider>
    <App />
    </DateRangeProvider>
   
  </StrictMode>,
)

// ...
