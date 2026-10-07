import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, LogIn, Menu, Search, UserRound, UserRoundPlus, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import '../public-nav.css'
import { Brand } from './Brand'
import { SearchOverlay } from './SearchOverlay'
import { ThemeToggle } from './ThemeToggle'

const navItems = [['Tahanan', '/'], ['Balita', '/balita'], ['Agham at Teknolohiya', '/ag-tek'], ['Pananaw', '/opinyon'], ['Paninindigan', '/editoryal'], ['Lathalain', '/lathalain'], ['Panitikan', '/panitikan'], ['Kultura', '/kultura'], ['Pagsisiyasat', '/investigative'], ['Tungkol sa Amin', '/about']]

export const PublicHeader = () => {
  const [open, setOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [subscribeNoticeOpen, setSubscribeNoticeOpen] = useState(false)
  const accountMenuRef = useRef(null)
  const subscribeTimerRef = useRef(null)
  const closeSearch = useCallback(() => setSearchOpen(false), [])
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])
  useEffect(() => {
    if (!accountOpen) return
    const closeOnOutsideClick = (event) => {
      if (!accountMenuRef.current?.contains(event.target)) setAccountOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setAccountOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [accountOpen])
  useEffect(() => () => window.clearTimeout(subscribeTimerRef.current), [])
  const openSearch = () => { setOpen(false); setSearchOpen(true) }
  const showSubscribeNotice = () => {
    setSubscribeNoticeOpen(true)
    window.clearTimeout(subscribeTimerRef.current)
    subscribeTimerRef.current = window.setTimeout(() => setSubscribeNoticeOpen(false), 3000)
  }
  return (
    <header className="site-header">
      <div className="masthead container">
        <Brand compact />
        <button type="button" className="header-search" onClick={openSearch} aria-label="Search ANG PAMATOK"><Search size={17} /><span className="header-search__text">Search ANG PAMATOK...</span></button>
        <div className="header-actions">
          <div className="subscribe-cta">
            <button type="button" className="subscribe-button" onClick={showSubscribeNotice} aria-expanded={subscribeNoticeOpen}><span>SUBSCRIBE</span><ArrowRight size={16} /></button>
            {subscribeNoticeOpen && <div className="subscribe-notice" role="status">Subscriptions are still under development. Check back soon!</div>}
          </div>
          <div className="account-menu" ref={accountMenuRef}>
            <button type="button" className="account-menu__trigger" onClick={() => setAccountOpen((value) => !value)} aria-label="Account options" aria-expanded={accountOpen} aria-haspopup="true" title="Account options"><UserRound size={19} /></button>
            {accountOpen && <div className="account-menu__panel">
              <div className="account-menu__welcome"><strong>Welcome to Ang Pamatok</strong><span>Sign in to access more features</span></div>
              <Link className="account-menu__link" to="/login" onClick={() => setAccountOpen(false)}><LogIn size={18} /><span><strong>Log in</strong><small>Access your account</small></span></Link>
              <Link className="account-menu__link" to="/register" onClick={() => setAccountOpen(false)}><UserRoundPlus size={18} /><span><strong>Sign up</strong><small>Create a new account</small></span></Link>
            </div>}
          </div>
          <ThemeToggle />
          <button className="menu-button" onClick={() => setOpen(true)} aria-label="Buksan ang talaan" aria-expanded={open}><Menu size={24} /></button>
        </div>
      </div>
      <div className="header-nav"><div className="container">
        <nav className="desktop-nav" aria-label="Pangunahing talaan">
          {navItems.map(([label, path]) => <NavLink key={path} to={path} end={path === '/'} onClick={() => setOpen(false)}>{label}</NavLink>)}
        </nav>
      </div></div>
      <div className={`mobile-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="mobile-menu__top"><Brand compact /><button className="icon-button" onClick={() => setOpen(false)} aria-label="Isara ang talaan"><X /></button></div>
        <nav aria-label="Talaan sa telepono">{navItems.map(([label, path]) => <NavLink key={path} to={path} end={path === '/'} onClick={() => setOpen(false)}>{label}</NavLink>)}</nav>
        <div className="mobile-menu__footer"><button type="button" className="mobile-search" onClick={openSearch}><Search size={18} /><span>Maghanap ng mga akda...</span></button><Link className="button button--primary" to="/login" onClick={() => setOpen(false)}>Log in sa patnugutan</Link><Link className="button button--outline" to="/register" onClick={() => setOpen(false)}><UserRoundPlus size={17} /> Sign up</Link></div>
      </div>
      <div className={`menu-backdrop ${open ? 'is-visible' : ''}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
    </header>
  )
}
