import React from 'react'
import './App.css'
import { Navbar } from './components/Navbar'

function App() {

  return (
    <div className="page">
      <Navbar />
      <main>
        Main content
      </main>
      <footer>
        c. 2023
      </footer>
    </div>
  )
}

export default App
