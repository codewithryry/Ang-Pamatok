import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/Pamatok.png'

// Team photo is served from public/team.jpg; until it exists, the logo shows in the same frame.
const TeamPhoto = () => {
  const [missing, setMissing] = useState(false)
  return <figure className="about-team">
    <div className="about-team__frame">{missing ? <img className="about-team__placeholder" src={logo} alt="" /> : <img src="/team.jpg" alt="Ang koponan ng Ang Pamatok" onError={() => setMissing(true)} />}</div>
    <figcaption>Ang koponan ng Ang Pamatok</figcaption>
  </figure>
}

export const AboutPage = () => (
  <main className="container about-page">
    <header className="about-hero"><div className="about-hero__text"><span className="eyebrow">Tungkol sa ANG PAMATOK</span><h1>Isang pahayagang pangmag-aaral para sa mapanuring isipan.</h1><p>Itinatag ang ANG PAMATOK upang magkaroon ang mga mag-aaral ng makabuluhang pook para magbasa, magsulat, at magbahagi ng kaisipan.</p></div><TeamPhoto /></header>
    <div className="about-grid"><section><span className="section-number">01</span><h2>Pagkakakilanlan</h2><p>Isa kaming pahayagang pangmag-aaral na pinagbubuklod ng pamamahayag, pamayanan, at malikhaing pagpapahayag. Nakasalig ang aming gawain sa mga tao at kaisipang humuhubog sa buhay-kampus.</p></section><section><span className="section-number">02</span><h2>Layunin</h2><p>Nais ng ANG PAMATOK na ilapit sa lahat ang mahahalagang balita, pag-ugnayin ang mga mag-aaral sa magkakatulad na karanasan, at tulungan ang mga bagong manunulat na hasain ang sariling tinig nang may malasakit at pananagutan.</p></section><section><span className="section-number">03</span><h2>Ang aming pamayanan</h2><p>Tumatanggap kami ng mga ulat, pananaw ng mag-aaral, akdang pampanitikan, at mungkahing makatutulong sa kinabukasan ng pahayagan. Sinusuri ang bawat ambag ayon sa malinaw na tuntunin ng patnugutan.</p></section></div>
    <section className="about-cta"><h2>Magbasa. Magsulat. Makibahagi.</h2><p>Tuklasin ang sinupan o pumasok sa patnugutan upang magsumite ng akda.</p><div><Link className="button button--primary" to="/search">Tuklasin ang mga akda</Link><Link className="button button--outline" to="/login">Log in sa patnugutan</Link></div></section>
  </main>
)
