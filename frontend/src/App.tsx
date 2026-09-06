import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import LandingPage from './features/landing/pages'
import BooksPage from './features/books/pages'
import AccountPage from './features/account/pages'
import LoginPage from './features/account/pages/login'
import SignUpPage from './features/account/pages/sign-up'

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
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
