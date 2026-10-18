import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Tu archivo CSS corregido
import './assets/styles.css'
import './assets/admin.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)