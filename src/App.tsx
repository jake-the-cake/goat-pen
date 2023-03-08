import React from 'react'
import './App.css'
import { Navbar } from './components/Navbar'

function App() {

  return (
    <div className="page">
      <Navbar />
      <main>
        <div className="page-alert">
          <span className="page-alert-title">Special Message</span>
          <span className="page-alert-blob">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam nam laborum omnis, fuga consectetur adipisci facilis at doloremque unde vel, quam quis mollitia officia inventore fugiat. Vitae odio obcaecati tenetur?</span>
        </div>
        <div className="content-container two-col-stack">
          <article className='flex-1'>
            <h2 className="content-header">Main Header</h2>
            <p>Main content</p>
          </article>
          <section>
            <h3 className='card-header'>Card Header</h3>
            <p>Card content</p>
          </section>
        </div>
      </main>
      <footer>
        c. 2023
      </footer>
    </div>
  )
}

export default App
