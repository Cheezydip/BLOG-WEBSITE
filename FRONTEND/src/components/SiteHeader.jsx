import { Link, NavLink } from 'react-router-dom'

const SiteHeader = () => {
  return (
    <header className="site-nav">
      <div className="site-container nav-inner">
        <Link to="/" className="brand">
          Lenscraft
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Home
          </NavLink>
          <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Blog
          </NavLink>
          <NavLink to="/new" className="nav-cta">
            New Post
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default SiteHeader
