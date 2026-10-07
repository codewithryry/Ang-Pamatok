export const LoadingState = ({ count = 6, compact = false }) => (
  <div className={`skeleton-grid ${compact ? 'skeleton-grid--compact' : ''}`} aria-label="Naglo-load ng mga akda">
    {Array.from({ length: count }).map((_, index) => <div className="skeleton-card" key={index}><div className="skeleton skeleton--image" /><div className="skeleton skeleton--line short" /><div className="skeleton skeleton--line" /><div className="skeleton skeleton--line medium" /></div>)}
  </div>
)

export const PageLoader = () => <div className="page-loader" aria-label="Naglo-load ang pahina"><span /><span /><span /></div>
