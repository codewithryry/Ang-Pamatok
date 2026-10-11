import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { DashboardLayout } from './components/DashboardLayout'
import { DialogProvider } from './components/DialogProvider'
import { ProtectedRoute } from './components/ProtectedRoute'
import { FloatingAd } from './components/FloatingAd'
import { PublicFooter } from './components/PublicFooter'
import { PublicHeader } from './components/PublicHeader'
import { AboutPage } from './pages/AboutPage'
import { ArticlePage } from './pages/ArticlePage'
import { ArticlesPage } from './pages/ArticlesPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { CategoryPage } from './pages/CategoryPage'
import { ChangePasswordPage } from './pages/ChangePasswordPage'
import { DashboardPage } from './pages/DashboardPage'
import { DeclarationPage } from './pages/DeclarationPage'
import { EditorArticlePage } from './pages/EditorArticlePage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProfilePage } from './pages/ProfilePage'
import { ReviewQueuePage } from './pages/ReviewQueuePage'
import { SearchPage } from './pages/SearchPage'
import { SettingsPage } from './pages/SettingsPage'
import { UsersPage } from './pages/UsersPage'

const PublicShell = ({ children }) => { const { pathname } = useLocation(); return <><PublicHeader />{children}<PublicFooter /><FloatingAd key={pathname} /></> }
const DashboardShell = ({ children }) => <DashboardLayout>{children}</DashboardLayout>

const pageTitles = {
  '/': 'Tahanan',
  '/about': 'Tungkol sa Amin',
  '/declaration': 'Pahayag',
  '/search': 'Hanapin',
  '/login': 'Login',
  '/register': 'Register',
  '/forgot-password': 'Reset Password',
  '/change-password': 'Change Password',
  '/dashboard': 'Dashboard',
  '/dashboard/articles': 'Articles',
  '/dashboard/articles/new': 'Create Article',
  '/dashboard/review': 'Review Queue',
  '/dashboard/categories': 'Categories',
  '/dashboard/users': 'Users',
  '/dashboard/settings': 'Settings',
  '/dashboard/profile': 'My Profile',
}
const categoryTitles = { 'balita': 'Balita', 'ag-tek': 'Agham at Teknolohiya', 'opinyon': 'Pananaw', 'editoryal': 'Paninindigan', 'lathalain': 'Lathalain', 'panitikan': 'Panitikan', 'kultura': 'Kultura', 'investigative': 'Pagsisiyasat' }

// Sets the browser tab title per route and resets scroll; ArticlePage refines it with the story title once loaded.
const RouteTitle = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    const slug = pathname.slice(1)
    const title = pageTitles[pathname] || (pathname.endsWith('/edit') ? 'Edit Article' : pathname.startsWith('/article/') ? 'Akda' : categoryTitles[slug])
    document.title = pathname === '/' ? 'Ang Pamatok | Pahayagang Pangmag-aaral' : title ? `${title} | Ang Pamatok` : 'Ang Pamatok'
    // New pages start at the top instead of keeping the previous scroll position.
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return <DialogProvider><BrowserRouter><RouteTitle /><Routes>
    <Route path="/" element={<PublicShell><HomePage /></PublicShell>} />
    <Route path="/:category" element={<PublicShell><CategoryPage /></PublicShell>} />
    <Route path="/about" element={<PublicShell><AboutPage /></PublicShell>} />
    <Route path="/declaration" element={<PublicShell><DeclarationPage /></PublicShell>} />
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
    <Route path="/dashboard/categories" element={<ProtectedRoute roles={['admin']}><DashboardShell><CategoriesPage /></DashboardShell></ProtectedRoute>} />
    <Route path="/dashboard/users" element={<ProtectedRoute roles={['admin']}><DashboardShell><UsersPage /></DashboardShell></ProtectedRoute>} />
    <Route path="/dashboard/profile" element={<ProtectedRoute><DashboardShell><ProfilePage /></DashboardShell></ProtectedRoute>} />
    <Route path="/dashboard/settings" element={<ProtectedRoute roles={['admin']}><DashboardShell><SettingsPage /></DashboardShell></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter></DialogProvider>
}
