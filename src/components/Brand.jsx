import { Link } from 'react-router-dom'
import logo from '../assets/Pamatok.png'

export const Brand = ({ compact = false }) => (
  <Link className={`brand ${compact ? 'brand--compact' : ''}`} to="/" aria-label="ANG PAMATOK home">
    <img className="brand__logo" src={logo} alt="" aria-hidden="true" />
    <span className="brand__text">
      <strong>ANG PAMATOK</strong>
      {!compact && <small>Student Publication</small>}
    </span>
  </Link>
)
