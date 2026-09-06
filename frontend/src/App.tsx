import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout'
import DashboardLayout from './components/layout/DashboardLayout'
import LandingPage from './features/landing/pages'
import BooksPage from './features/books/pages'
import LoginPage from './features/account/pages/login'
import SignUpPage from './features/account/pages/sign-up'
import DashboardPage from './features/dashboard/pages'
import PublishedBooksPage from './features/books/pages/published'
import BookRegisterPage from './features/books/pages/register'
import BookEditPage from './features/books/pages/edit'
import BookAdminPage from './features/books/pages/admin'
import SalesHistoryPage from './features/sales/pages/history'
import ProfilePage from './features/account/pages/profile'
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
            <Route path={ROUTES.login} element={<LoginPage />} />
            <Route path={ROUTES.signup} element={<SignUpPage />} />
          </Route>

          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.dashboard} element={<DashboardPage />} />
            <Route path={ROUTES.booksPublished} element={<PublishedBooksPage />} />
            <Route path={ROUTES.booksNew} element={<BookRegisterPage />} />
            <Route path={ROUTES.booksEdit} element={<BookEditPage />} />
            <Route path={ROUTES.booksManage} element={<BookAdminPage />} />
            <Route path={ROUTES.sales} element={<SalesHistoryPage />} />
            <Route path={ROUTES.profile} element={<ProfilePage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
