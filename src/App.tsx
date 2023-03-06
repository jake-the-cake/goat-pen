import React from 'react'
import './App.css'
import { Navbar } from './components/Navbar'

function App() {

  return (
    <div className="page">
      <Navbar />
      <main>
        <div className="content-container">
          <h1 className="content-header">Header</h1>
          Main content
        </div>
      </main>
      <footer>
        c. 2023
      </footer>
    </div>
  )
}

export default App
