import React from 'react'
import { Link } from 'react-router-dom'

const HomeHero = () => {
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
          <Link className="btn ghost" to="/new">
            Start a draft
          </Link>
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
