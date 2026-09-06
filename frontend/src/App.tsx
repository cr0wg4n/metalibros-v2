import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout'
import DashboardLayout from './components/layout/DashboardLayout'
import LandingPage from './features/landing/pages'
import BooksPage from './features/books/pages'
import AccountPage from './features/account/pages'
import LoginPage from './features/account/pages/login'
import SignUpPage from './features/account/pages/sign-up'
import DashboardPage from './features/dashboard/pages'
import DashboardBooksPage from './features/dashboard/pages/books'
import BookRegisterPage from './features/dashboard/pages/book-register'
import BookAdminPage from './features/dashboard/pages/book-admin'
import { ROUTES } from './config/routes'
import { useAuthBootstrap } from './features/account/hooks/use-auth-bootstrap'

function App() {
  useAuthBootstrap()

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface font-sans text-text">
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path={ROUTES.home} element={<LandingPage />} />
            <Route path={ROUTES.books} element={<BooksPage />} />
            <Route path={ROUTES.account} element={<AccountPage />} />
            <Route path={ROUTES.login} element={<LoginPage />} />
            <Route path={ROUTES.signup} element={<SignUpPage />} />
          </Route>

          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.dashboard} element={<DashboardPage />} />
            <Route path={ROUTES.dashboardBooks} element={<DashboardBooksPage />} />
            <Route path={ROUTES.dashboardBooksNew} element={<BookRegisterPage />} />
            <Route path={ROUTES.dashboardBooksManage} element={<BookAdminPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
