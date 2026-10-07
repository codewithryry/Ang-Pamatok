import { BookOpen, Clock3, LogOut, FileText, LayoutDashboard, Menu, Settings, ShieldCheck, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Brand } from './Brand'

const nav = {
  admin: [['Dashboard', '/dashboard', LayoutDashboard], ['Articles', '/dashboard/articles', FileText], ['Review Queue', '/dashboard/review', ShieldCheck], ['Categories', '/dashboard/categories', BookOpen], ['Users', '/dashboard/users', Users], ['Settings', '/dashboard/settings', Settings]],
  editor: [['Dashboard', '/dashboard', LayoutDashboard], ['Articles', '/dashboard/articles', FileText], ['Review Queue', '/dashboard/review', ShieldCheck], ['Categories', '/dashboard/categories', BookOpen]],
}

export const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])
  const location = useLocation()
  const navigate = useNavigate()
  const items = nav[user?.role] || nav.editor
  const name = user?.full_name || user?.display_name || user?.email || ''
  const parts = (user?.full_name || user?.display_name || user?.email?.split('@')[0] || '').split(/\s+/).filter(Boolean)
  const initials = (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] || '').slice(0, 2)).toUpperCase()
  const change = async () => { await logout(); navigate('/login', { replace: true }) }
  return <div className="dashboard-shell"><aside className={`dashboard-sidebar ${open ? 'is-open' : ''}`}><Brand compact /><nav aria-label="Dashboard navigation">{items.map(([label, path, Icon]) => <NavLink key={path} to={path} end={path === '/dashboard' || path === '/dashboard/articles'} onClick={() => setOpen(false)}><Icon size={18} />{label}</NavLink>)}</nav><div className="sidebar-footer"><span className="user-chip">{initials}</span><div className="sidebar-footer__user"><strong title={name}>{name}</strong><small><span className="sidebar-footer__role">{user?.role}</span><span className="sidebar-footer__email">{user?.email}</span></small></div><button onClick={change}><LogOut size={15} /> Sign out</button></div></aside><div className={`dashboard-overlay ${open ? 'is-visible' : ''}`} onClick={() => setOpen(false)} /><main className="dashboard-main"><header className="dashboard-topbar"><button className="menu-button dashboard-menu" onClick={() => setOpen(true)} aria-label="Open dashboard menu"><Menu /></button><div><span className="eyebrow">Editorial workspace</span><h1>{items.find(([, path]) => path === location.pathname)?.[0] || (location.pathname.endsWith('/edit') ? 'Edit Article' : location.pathname.endsWith('/new') ? 'Create Article' : location.pathname.startsWith('/dashboard/articles') ? 'Articles' : 'Dashboard')}</h1></div><div className="dashboard-topbar__meta"><Clock3 size={18} /><span>{now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} · {now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</span></div></header><div className="dashboard-content">{children}</div></main></div>
}
