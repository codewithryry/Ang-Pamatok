import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export const BackToTop = () => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 500)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return <button type="button" className={`back-to-top ${visible ? 'is-visible' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Bumalik sa itaas" title="Bumalik sa itaas" tabIndex={visible ? 0 : -1}><ArrowUp size={18} /></button>
}
