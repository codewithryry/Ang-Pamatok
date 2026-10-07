import { Link } from 'react-router-dom'
import { Brand } from './Brand'

export const PublicFooter = () => (
  <footer className="site-footer">
    <div className="container footer-grid">
      <div><Brand /><p>Independent student publishing for the people shaping our campus community.</p></div>
      <div><h2>Explore</h2><Link to="/news">News</Link><Link to="/sci-tech">Sci-Tech</Link><Link to="/opinion">Opinion</Link><Link to="/editorial">Editorial</Link><Link to="/feature">Feature</Link><Link to="/literary">Literary</Link></div>
      <div><h2>About</h2><Link to="/about">Our publication</Link><Link to="/search">Search archive</Link><Link to="/login">Editorial portal</Link></div>
      <div className="footer-copyright"><span>© 2026 ANG PAMATOK · Student Publication</span><span>Developed by <a className="footer-credit" href="https://bit.ly/4cqo0aA" target="_blank" rel="noopener noreferrer">bit.ly/4cqo0aA</a></span></div>
    </div>
  </footer>
)
