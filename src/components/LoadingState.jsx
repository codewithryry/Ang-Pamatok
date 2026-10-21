import logo from '../assets/Pamatok.png'

export const LoadingState = ({ count = 6, compact = false }) => (
  <div className={`skeleton-grid ${compact ? 'skeleton-grid--compact' : ''}`} aria-label="Naglo-load ng mga akda">
    {Array.from({ length: count }).map((_, index) => <div className="skeleton-card" key={index}><div className="skeleton skeleton--image" /><div className="skeleton skeleton--line short" /><div className="skeleton skeleton--line" /><div className="skeleton skeleton--line medium" /></div>)}
  </div>
)

// Logo inside a rotating ring; CSS delays the fade-in so quick loads never flash it.
export const PageLoader = ({ fullscreen = false }) => (
  <div className={`page-loader ${fullscreen ? 'page-loader--fullscreen' : ''}`} role="status" aria-label="Naglo-load ang pahina">
    <span className="page-loader__mark"><img src={logo} alt="" /></span>
  </div>
)
