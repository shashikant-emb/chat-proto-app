import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import "./server" // Import the mock server setup

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
