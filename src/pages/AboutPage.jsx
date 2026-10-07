import { Link } from 'react-router-dom'

export const AboutPage = () => (
  <main className="container about-page">
    <header className="about-hero"><span className="eyebrow">About ANG PAMATOK</span><h1>A student publication for curious minds.</h1><p>ANG PAMATOK is a digital publication created to give students a clear, thoughtful space to read, write, and share ideas.</p></header>
    <div className="about-grid"><section><span className="section-number">01</span><h2>Our identity</h2><p>We are a student publication built around the practices of journalism, community, and creative expression. Our work is grounded in the people and ideas that shape campus life.</p></section><section><span className="section-number">02</span><h2>Our purpose</h2><p>ANG PAMATOK aims to make important stories accessible, connect students with shared experiences, and help emerging writers develop their voice with care and responsibility.</p></section><section><span className="section-number">03</span><h2>Our community</h2><p>We welcome reporting, student perspectives, literary work, and ideas for the future of the publication. Every contribution is reviewed through a clear editorial process.</p></section></div>
    <section className="about-cta"><h2>Read. Write. Participate.</h2><p>Explore the archive or enter the editorial portal to submit a story.</p><div><Link className="button button--primary" to="/search">Explore stories</Link><Link className="button button--outline" to="/login">Editorial login</Link></div></section>
  </main>
)
