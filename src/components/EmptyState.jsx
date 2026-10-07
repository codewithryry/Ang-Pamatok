import { SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'

export const EmptyState = ({ title = 'Nothing here yet', description = 'Check back soon for new stories.', action }) => (
  <div className="empty-state"><SearchX size={32} /><h2>{title}</h2><p>{description}</p>{action && <Link className="button button--primary" to={action.to}>{action.label}</Link>}</div>
)
