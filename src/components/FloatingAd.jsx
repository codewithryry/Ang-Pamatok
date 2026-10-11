import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { adConfig } from '../config/ads'

const pickPlacement = () => {
  const width = window.innerWidth
  return adConfig.floating.find((item) => item.enabled && width >= item.minViewport && width <= item.maxViewport) || null
}

export const FloatingAd = () => {
  const [placement, setPlacement] = useState(null)
  const [scrolled, setScrolled] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  useEffect(() => {
    const update = () => { setPlacement(pickPlacement()); setScrolled(window.scrollY) }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])
  if (!placement || dismissed) return null
  const visible = scrolled >= placement.showAfterScroll
  const Render = adConfig.provider?.render
  return (
    <aside
      className={`floating-ad floating-ad--${placement.id} ${visible ? 'is-visible' : ''}`}
      aria-label="Patalastas"
      aria-hidden={!visible}
      data-ad-placement={placement.id}
      style={{ '--ad-w': placement.width ? `${placement.width}px` : 'auto', '--ad-h': `${placement.height}px` }}
    >
      <div className="ad-slot__unit floating-ad__unit">{Render ? <Render placement={placement.id} /> : <span className="ad-slot__label">Ad space</span>}</div>
      <button type="button" className="floating-ad__close" onClick={() => setDismissed(true)} aria-label="Isara ang patalastas" title="Isara" tabIndex={visible ? 0 : -1}><X size={14} /></button>
    </aside>
  )
}
