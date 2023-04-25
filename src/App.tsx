function App() {
  console.log(window.location)
  return (
    <>
      <div className="wrapper">
        <header className="header__title">
          <span className="header__title--text">
            Quiet Goat Labs
          </span>
        </header>
        <nav className="nav__main">
          <div className="nav__links">
            link
          </div>
          <div className="nav__actions">
            actions
          </div>
        </nav>
        <main className="main__container">
          <section className="section__left">
            left
          </section>
          <section className="section__right">
            right
          </section>
        </main>
      </div>
      {/* <div className="top-triangle"></div>
      <div className="left-triangle"></div>
      <div className="top-bar"></div> */}
    </>
  )
}

export default App