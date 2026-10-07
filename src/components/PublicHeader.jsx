import { useEffect, useState } from 'react'
import { Menu, Search, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { Brand } from './Brand'

const navItems = [['Home', '/'], ['News', '/news'], ['Sci-Tech', '/sci-tech'], ['Opinion', '/opinion'], ['Editorial', '/editorial'], ['Feature', '/feature'], ['Literary', '/literary'], ['About', '/about']]

export const PublicHeader = () => {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])
  return (
    <header className="site-header">
      <div className="masthead container">
        <Brand />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, path]) => <NavLink key={path} to={path} end={path === '/'} onClick={() => setOpen(false)}>{label}</NavLink>)}
        </nav>
        <div className="header-actions">
          <Link className="search-link" to="/search" aria-label="Search articles"><Search size={17} /><span className="search-link__text">Search…</span></Link>
          <Link className="button button--primary login-link" to="/login">Login</Link>
          <button className="menu-button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}><Menu size={24} /></button>
        </div>
      </div>
      <div className={`mobile-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="mobile-menu__top"><Brand /><button className="icon-button" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button></div>
        <nav aria-label="Mobile navigation">{navItems.map(([label, path]) => <NavLink key={path} to={path} end={path === '/'} onClick={() => setOpen(false)}>{label}</NavLink>)}</nav>
        <div className="mobile-menu__footer"><Link className="button button--outline" to="/search" onClick={() => setOpen(false)}><Search size={17} /> Search the archive</Link><Link className="button button--primary" to="/login" onClick={() => setOpen(false)}>Editorial login</Link></div>
      </div>
      <div className={`menu-backdrop ${open ? 'is-visible' : ''}`} onClick={() => setOpen(false)} aria-hidden="true" />
    </header>
  )
}
