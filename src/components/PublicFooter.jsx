import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BackToTop } from './BackToTop'
import { Brand } from './Brand'

const sections = [['Balita', '/balita'], ['Ag-Tek', '/ag-tek'], ['Opinyon', '/opinyon'], ['Editoryal', '/editoryal'], ['Lathalain', '/lathalain'], ['Panitikan', '/panitikan'], ['Kultura', '/kultura'], ['Investigative', '/investigative']]

export const PublicFooter = () => (
  <footer className="site-footer">
    <div className="container footer-top">
      <div className="footer-brand">
        <Brand compact />
        <p>Tinataguyod ang malayang pamamahayag.</p>
        <Link className="footer-cta" to="/about">About Ang Pamatok <ArrowRight size={15} /></Link>
      </div>
      <nav className="footer-col" aria-label="Sections"><h2>Sections</h2><div className="footer-links footer-links--two">{sections.map(([label, path]) => <Link key={path} to={path}>{label}</Link>)}</div></nav>
      <nav className="footer-col" aria-label="Publication"><h2>Publication</h2><div className="footer-links"><Link to="/about">Our publication</Link><Link to="/declaration">Declaration</Link><Link to="/search">Search archive</Link><Link to="/login">Editorial portal</Link></div></nav>
    </div>
    <div className="footer-wordmark" aria-hidden="true">PAMATOK</div>
    <div className="container footer-bottom">
      <span>© 2026 Ang Pamatok</span>
      <span className="footer-bottom__right"><Link to="/declaration">Declaration</Link><span className="footer-bottom__sep" aria-hidden="true" /><span>Developed by <a className="footer-credit" href="https://bit.ly/4cqo0aA" target="_blank" rel="noopener noreferrer">bit.ly/4cqo0aA</a></span></span>
    </div>
    <BackToTop />
  </footer>
)
