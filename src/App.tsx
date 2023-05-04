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
          <div className="footer__section">l</div>
          <div className="footer__section">r</div>
          <div className="footer__section">c</div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App