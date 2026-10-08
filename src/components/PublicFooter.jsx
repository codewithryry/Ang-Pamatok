import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import '../public-nav.css'
import { BackToTop } from './BackToTop'
import { Brand } from './Brand'

const sections = [['Balita', '/balita'], ['Agham at Teknolohiya', '/ag-tek'], ['Pananaw', '/opinyon'], ['Paninindigan', '/editoryal'], ['Lathalain', '/lathalain'], ['Panitikan', '/panitikan'], ['Kultura', '/kultura'], ['Pagsisiyasat', '/investigative']]

export const PublicFooter = () => (
  <footer className="site-footer">
    <div className="container footer-top">
      <div className="footer-brand">
        <Brand compact />
        <p>Tinataguyod ang malayang pamamahayag.</p>
        <Link className="footer-cta" to="/about">Tungkol sa Ang Pamatok <ArrowRight size={15} /></Link>
      </div>
      <nav className="footer-col" aria-label="Mga paksa"><h2>Mga Paksa</h2><div className="footer-links footer-links--two">{sections.map(([label, path]) => <Link key={path} to={path}>{label}</Link>)}</div></nav>
      <nav className="footer-col" aria-label="Pahayagan"><h2>Pahayagan</h2><div className="footer-links"><Link to="/about">Tungkol sa amin</Link><Link to="/declaration">Pahayag</Link><Link to="/search">Hanapin sa sinupan</Link></div></nav>
    </div>
    <div className="footer-wordmark" aria-hidden="true">PAMATOK</div>
    <div className="container footer-bottom">
      <span>© 2026 Ang Pamatok</span>
      <span className="footer-bottom__right"><Link to="/declaration">Pahayag</Link><span className="footer-bottom__sep" aria-hidden="true" /><span>Nilikha ni <a className="footer-credit" href="https://bit.ly/4dXjotg" target="_blank" rel="noopener noreferrer">bit.ly/4dXjotg</a></span></span>
    </div>
    <BackToTop />
  </footer>
)
