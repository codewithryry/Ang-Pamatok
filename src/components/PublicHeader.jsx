import { useCallback, useEffect, useState } from 'react'
import { Menu, Search, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { Brand } from './Brand'
import { SearchOverlay } from './SearchOverlay'
import { ThemeToggle } from './ThemeToggle'

const navItems = [['Home', '/'], ['Balita', '/balita'], ['Ag-Tek', '/ag-tek'], ['Opinyon', '/opinyon'], ['Editoryal', '/editoryal'], ['Lathalain', '/lathalain'], ['Panitikan', '/panitikan'], ['Kultura', '/kultura'], ['Investigative', '/investigative'], ['About', '/about']]

export const PublicHeader = () => {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const closeSearch = useCallback(() => setSearchOpen(false), [])
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])
  const openSearch = () => { setOpen(false); setSearchOpen(true) }
  return (
    <header className="site-header">
      <div className="masthead container">
        <Brand compact />
        <button type="button" className="header-search" onClick={openSearch} aria-label="Search stories"><Search size={17} /><span className="header-search__text">Search ANG PAMATOK…</span></button>
        <div className="header-actions">
          <Link className="button button--primary login-link" to="/login">Login</Link>
          <ThemeToggle />
          <button className="menu-button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}><Menu size={24} /></button>
        </div>
      </div>
      <div className="header-nav"><div className="container">
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, path]) => <NavLink key={path} to={path} end={path === '/'} onClick={() => setOpen(false)}>{label}</NavLink>)}
        </nav>
      </div></div>
      <div className={`mobile-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="mobile-menu__top"><Brand compact /><button className="icon-button" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button></div>
        <nav aria-label="Mobile navigation">{navItems.map(([label, path]) => <NavLink key={path} to={path} end={path === '/'} onClick={() => setOpen(false)}>{label}</NavLink>)}</nav>
        <div className="mobile-menu__footer"><button type="button" className="button button--outline" onClick={openSearch}><Search size={17} /> Search the archive</button><Link className="button button--primary" to="/login" onClick={() => setOpen(false)}>Editorial login</Link></div>
      </div>
      <div className={`menu-backdrop ${open ? 'is-visible' : ''}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
    </header>
  )
}
