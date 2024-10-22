// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import axios from "axios";

axios.defaults.baseURL = 'http://127.0.0.1:5103';
axios.defaults.headers.post['Content-Type'] = 'application/json';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
