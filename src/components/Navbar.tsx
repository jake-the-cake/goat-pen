import { navbar } from '../data/layoutData'
export function Navbar() {
  return (
    <nav className="nav__main">
      <div className="nav__links nav__section">
        {
          navbar.links.map(function(link) {
            return <div className='nav__item'>{link.label}</div>
          })
        }
      </div>
      <div className="nav__actions nav__section">
        <div className="nav__icon btn__bold">C</div>
        <div className="nav__icon btn__subtle">S</div>
      </div>
    </nav>
  )
}