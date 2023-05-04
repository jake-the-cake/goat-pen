import { navbar } from '../data/layoutData'

export function Navbar() {
  return (
    <nav className="nav__main">
      <div className="nav__links nav__section">
        {
          navbar.links.map(function(link, i) {
            return (
              <div key={ 'navlink' + i} className='nav__item'>
                <a href={ link.url ?? '/404' }>
                  {link.label}
                </a>
              </div>
            )
          })
        }
      </div>
      <div className="nav__actions nav__section">
        <div className="nav__icon btn__bold">
          <img src="./mail-light.png" alt="" />
        </div>
        <div className="nav__icon btn__subtle">
          <img src="./search-light.png" alt="" />
        </div>
      </div>
    </nav>
  )
}