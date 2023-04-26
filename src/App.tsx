import { Header } from "./components/Header"
import { Navbar } from "./components/Navbar"

function App() {
  console.log(window.location)
  return (
    <>
      <div className="wrapper">
        <Header />
        <Navbar />
        <main className="main__container">
          <section className="section__left">
            left
          </section>
          <section className="section__right">
            right
          </section>
        </main>
        <footer className="footer__container">
          <div className="footer__section">l</div>
          <div className="footer__section">r</div>
          <div className="footer__section">c</div>
        </footer>
      </div>
    </>
  )
}

export default App