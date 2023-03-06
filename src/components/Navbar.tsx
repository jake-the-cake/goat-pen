import React from 'react'

export function Navbar() {
  return (
    <nav className='nav-main'>
      <div className="page-title">
        Quiet Goat Labs
      </div>
      <ul className='nav-links'>
        <li className='nav-link'>Packages</li>
        <li className='nav-link'>Products</li>
        <li className='nav-link'>Services</li>
        <li className='nav-link'>Company</li>
      </ul>
    </nav>
  )
}