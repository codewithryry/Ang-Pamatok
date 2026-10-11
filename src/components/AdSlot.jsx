import { adConfig, getPlacement } from '../config/ads'

export const AdSlot = ({ placement, className = '' }) => {
  const config = getPlacement(placement)
  if (!config) return null
  const Render = adConfig.provider?.render
  return (
    <aside
      className={`ad-slot ad-slot--${placement} ${config.desktopOnly ? 'ad-slot--desktop-only' : ''} ${className}`.trim()}
      aria-label="Patalastas"
      data-ad-placement={placement}
      style={{ '--ad-min-h': `${config.minHeight.mobile}px`, '--ad-min-h-desktop': `${config.minHeight.desktop}px`, '--ad-max-w': `${config.maxWidth}px` }}
    >
      <div className="ad-slot__unit">{Render ? <Render placement={placement} /> : <span className="ad-slot__label">Advertisement</span>}</div>
    </aside>
  )
}

