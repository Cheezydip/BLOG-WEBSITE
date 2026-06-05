import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const HomeHero = () => {
  const { isAdmin } = useAuth()

  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="hero-badge">Editorial Studio</span>
        <h1 className="hero-title">Behind the lens, beyond the routine.</h1>
        <p className="hero-sub">
          Stories, gear notes, and creative workflows from photographers pushing their craft.
        </p>
        <div className="hero-actions">
          <Link className="btn primary" to="/blog">
            Explore posts
          </Link>
          {isAdmin ? (
            <Link className="btn ghost" to="/new">
              Start a draft
            </Link>
          ) : (
            <a className="btn ghost" href="mailto:admin@bloghub.com">
              Contact Admin
            </a>
          )}
        </div>
      </div>
      <div className="hero-panel">
        <div className="hero-card">
          <p className="hero-card-title">Featured Issue</p>
          <p className="hero-card-copy">Inside the new wave of light, texture, and slow storytelling.</p>
        </div>
      </div>
    </section>
  )
}

export default HomeHero
