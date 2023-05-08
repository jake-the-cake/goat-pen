import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Header } from "./components/Header"
import { Navbar } from "./components/Navbar"
import { Home } from "./pages/Home"

function App() {
  console.log(window.location)
  return (
    <BrowserRouter>
      <div className="wrapper">
        <Header />
        <Navbar />
          <Routes>
            <Route path="/" element={ <Home /> } />
          </Routes>
        <footer className="footer__container">
          <div className="footer__section">r</div>
          <div className="footer__section">c. 2023 </div>
          <div className="footer__section">Quiet Goat Labs is a web development company based in New Jersey, USA.
          <hr className="footer__hr" />
          c. 2023 - All Rights Reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App