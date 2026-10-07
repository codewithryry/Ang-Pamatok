import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'

// The initial theme is set by the inline script in index.html before the app loads.
export const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try { localStorage.setItem('pamatok-theme', next) } catch { /* storage unavailable */ }
    setTheme(next)
  }
  return <button type="button" className="theme-toggle" onClick={toggle} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
}
