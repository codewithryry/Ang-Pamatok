import { Link } from 'react-router-dom'
import logo from '../assets/Pamatok.png'

export const Brand = ({ compact = false }) => (
  <Link className={`brand ${compact ? 'brand--compact' : ''}`} to="/" aria-label="ANG PAMATOK home">
    <img className="brand__logo" src={logo} alt="" aria-hidden="true" />
    <span className="brand__text">
      {compact
        ? <strong className="brand__stack"><span className="brand__kicker">ANG</span><span className="brand__name">PAMATOK</span></strong>
        : <strong>ANG PAMATOK</strong>}
      {!compact && <small>Student Publication</small>}
    </span>
  </Link>
)
