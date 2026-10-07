import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { DashboardLayout } from './components/DashboardLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PublicFooter } from './components/PublicFooter'
import { PublicHeader } from './components/PublicHeader'
import { AboutPage } from './pages/AboutPage'
import { ArticlePage } from './pages/ArticlePage'
import { ArticlesPage } from './pages/ArticlesPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { CategoryPage } from './pages/CategoryPage'
import { ChangePasswordPage } from './pages/ChangePasswordPage'
import { DashboardPage } from './pages/DashboardPage'
import { EditorArticlePage } from './pages/EditorArticlePage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ReviewQueuePage } from './pages/ReviewQueuePage'
import { SearchPage } from './pages/SearchPage'
import { SettingsPage } from './pages/SettingsPage'
import { UsersPage } from './pages/UsersPage'

const PublicShell = ({ children }) => <><PublicHeader />{children}<PublicFooter /></>
const DashboardShell = ({ children }) => <DashboardLayout>{children}</DashboardLayout>

const pageTitles = {
  '/': 'Home',
  '/about': 'About',
  '/search': 'Search',
  '/login': 'Sign in',
  '/register': 'Register',
  '/forgot-password': 'Reset password',
  '/change-password': 'Change password',
  '/dashboard': 'Dashboard',
  '/dashboard/articles': 'Articles',
  '/dashboard/articles/new': 'Create Article',
  '/dashboard/review': 'Review Queue',
  '/dashboard/categories': 'Categories',
  '/dashboard/users': 'Users',
  '/dashboard/settings': 'Settings',
}
const categoryTitles = { news: 'News', 'sci-tech': 'Sci-Tech', opinion: 'Opinion', editorial: 'Editorial', feature: 'Feature', literary: 'Literary' }

// Sets the browser tab title per route; ArticlePage refines it with the story title once loaded.
const RouteTitle = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    const slug = pathname.slice(1)
    const title = pageTitles[pathname] || (pathname.endsWith('/edit') ? 'Edit Article' : pathname.startsWith('/article/') ? 'Story' : categoryTitles[slug])
    document.title = title ? `${title} | ANG PAMATOK` : 'ANG PAMATOK'
  }, [pathname])
  return null
}

export default function App() {
  return <BrowserRouter><RouteTitle /><Routes>
    <Route path="/" element={<PublicShell><HomePage /></PublicShell>} />
    <Route path="/:category" element={<PublicShell><CategoryPage /></PublicShell>} />
    <Route path="/about" element={<PublicShell><AboutPage /></PublicShell>} />
    <Route path="/search" element={<PublicShell><SearchPage /></PublicShell>} />
    <Route path="/article/:slug" element={<PublicShell><ArticlePage /></PublicShell>} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute><DashboardShell><DashboardPage /></DashboardShell></ProtectedRoute>} />
    <Route path="/dashboard/articles" element={<ProtectedRoute><DashboardShell><ArticlesPage /></DashboardShell></ProtectedRoute>} />
    <Route path="/dashboard/articles/new" element={<ProtectedRoute roles={['editor', 'admin']}><DashboardShell><EditorArticlePage /></DashboardShell></ProtectedRoute>} />
    <Route path="/dashboard/articles/:id/edit" element={<ProtectedRoute roles={['editor', 'admin']}><DashboardShell><EditorArticlePage /></DashboardShell></ProtectedRoute>} />
    <Route path="/dashboard/review" element={<ProtectedRoute roles={['editor', 'admin']}><DashboardShell><ReviewQueuePage /></DashboardShell></ProtectedRoute>} />
    <Route path="/dashboard/categories" element={<ProtectedRoute roles={['editor', 'admin']}><DashboardShell><CategoriesPage /></DashboardShell></ProtectedRoute>} />
    <Route path="/dashboard/users" element={<ProtectedRoute roles={['admin']}><DashboardShell><UsersPage /></DashboardShell></ProtectedRoute>} />
    <Route path="/dashboard/settings" element={<ProtectedRoute roles={['admin']}><DashboardShell><SettingsPage /></DashboardShell></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter>
}
