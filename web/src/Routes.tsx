import { Router, Route, Set, PrivateSet } from '@redwoodjs/router'

import AdminLayout from 'src/layouts/AdminLayout/AdminLayout'
import { AuthLayout } from 'src/layouts/AuthLayout/AuthLayout'
import MainLayout from 'src/layouts/MainLayout/MainLayout'
import AdminDashboardPage from 'src/pages/AdminDashboardPage/AdminDashboardPage'
import AdminReportsPage from 'src/pages/AdminReportsPage/AdminReportsPage'
import ForgotPasswordPage from 'src/pages/ForgotPasswordPage'
import HomePage from 'src/pages/HomePage'
import LoginPage from 'src/pages/LoginPage'
import NotFoundPage from 'src/pages/NotFoundPage'
import NotificationsPage from 'src/pages/NotificationsPage'
import PostPage from 'src/pages/PostPage'
import ProfilePage from 'src/pages/ProfilePage'
import ResetPasswordPage from 'src/pages/ResetPasswordPage'
import SignupPage from 'src/pages/SignupPage'

import { useAuth } from './auth'
import AdminUsersPage from './pages/AdminUsersPage/AdminUsersPage'
import SearchPage from './pages/SearchPage/SearchPage'

const Routes = () => {
  const { loading } = useAuth()

  if (loading) return null

  return (
    <Router useAuth={useAuth}>
      <PrivateSet unauthenticated="home">
        <Set wrap={AdminLayout}>
          <Route path="/admin" page={AdminDashboardPage} name="adminDashboard" />
          <Route path="/admin/dashboard" page={AdminDashboardPage} name="adminDashboardAlt" />
          <Route path="/admin/reports" page={AdminReportsPage} name="adminReports" />
          <Route path="/admin/users" page={AdminUsersPage} name="adminUsers" />
        </Set>
      </PrivateSet>
      {/* ===========================
                AUTH ROUTES
          =========================== */}
      <Set wrap={AuthLayout}>
        <Route path="/login" page={LoginPage} name="login" />
        <Route path="/signup" page={SignupPage} name="signup" />
        <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
        <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
      </Set>
      {/* ===========================
                MAIN APP ROUTES
          =========================== */}
      <Set wrap={MainLayout}>
        <Route path="/" page={HomePage} name="home" />
        <Route path="/post/{id:Int}" page={PostPage} name="post" />
        <Route path="/profile/{id:Int}" page={ProfilePage} name="profile" />
        <Route path="/notifications" page={NotificationsPage} name="notifications" />
        <Route path="/search" page={SearchPage} name="search" />
      </Set>

      {/* ===========================
                 NOT FOUND
          =========================== */}
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
