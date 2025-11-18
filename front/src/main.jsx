import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Importa el tema y los estilos base de PrimeReact
import "primereact/resources/themes/lara-light-blue/theme.css"; // 👈 o cualquier otro tema
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";



import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
