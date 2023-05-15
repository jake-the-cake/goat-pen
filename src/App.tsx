import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Footer } from "./components/Footer"
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
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App