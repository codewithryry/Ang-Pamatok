import { Link } from 'react-router-dom'
import logo from '../assets/Pamatok.png'

export const Brand = ({ compact = false, hideLogo = false }) => (
  <Link className={`brand ${compact ? 'brand--compact' : ''}`} to="/" aria-label="ANG PAMATOK, tahanan">
    {!hideLogo && <img className="brand__logo" src={logo} alt="" aria-hidden="true" />}
    <span className="brand__text">
      <strong className="brand__stack"><span className="brand__kicker">ANG</span><span className="brand__name">PAMATOK</span></strong>
    </span>
  </Link>
)
