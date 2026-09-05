import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import LandingPage from './features/landing/pages'
import BooksPage from './features/books/pages'
import AccountPage from './features/account/pages'
import LoginPage from './features/account/pages/login'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface font-sans text-text">
        <Navbar />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
