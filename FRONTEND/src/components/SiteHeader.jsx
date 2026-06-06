import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const SiteHeader = () => {
  const { isAdmin, admin, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef(null)
  const mobileRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      // Ignore clicks on the hamburger button since its onClick handles the toggle
      if (e.target.closest('.nav-hamburger')) return

      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on route change
  const closeMobile = () => setMobileOpen(false)

  const handleLogout = () => {
    setDropdownOpen(false)
    setMobileOpen(false)
    logout()
    navigate('/')
  }

  return (
    <header className="site-nav">
      <div className="nav-inner-wrap">
        <Link to="/" className="brand">
          TravelHub
        </Link>

        {/* Desktop Nav */}
        <nav className="nav-links nav-links-desktop">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Home
          </NavLink>
          <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Blog
          </NavLink>

          {isAdmin ? (
            <div className="nav-admin-menu" ref={dropdownRef}>
              <button
                id="admin-avatar-btn"
                className="nav-admin-btn"
                onClick={() => setDropdownOpen(v => !v)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <span className="nav-admin-avatar">
                  {admin?.email?.[0]?.toUpperCase() || 'A'}
                </span>
                <span className="nav-admin-label">Admin</span>
                <svg
                  className={`nav-admin-chevron ${dropdownOpen ? 'open' : ''}`}
                  width="12" height="12" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">
                    <p className="nav-dropdown-email">{admin?.email}</p>
                    <p className="nav-dropdown-role">Administrator</p>
                  </div>
                  <div className="nav-dropdown-divider" />
                  <Link
                    to="/admin"
                    id="nav-dashboard-link"
                    className="nav-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    Dashboard
                  </Link>
                  <Link
                    to="/new"
                    id="nav-new-post-link"
                    className="nav-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    New Post
                  </Link>
                  <div className="nav-dropdown-divider" />
                  <button
                    id="nav-logout-btn"
                    className="nav-dropdown-item nav-dropdown-logout"
                    onClick={handleLogout}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" id="admin-login-btn" className="nav-cta nav-login-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Admin
            </Link>
          )}
        </nav>

        {/* Hamburger Button — mobile only */}
        <button
          className={`nav-hamburger ${mobileOpen ? 'open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(v => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <nav className="nav-mobile-drawer" ref={mobileRef}>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)} onClick={closeMobile}>
            Home
          </NavLink>
          <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active' : undefined)} onClick={closeMobile}>
            Blog
          </NavLink>
          {isAdmin ? (
            <>
              <Link to="/admin" className="nav-mobile-link" onClick={closeMobile}>Dashboard</Link>
              <Link to="/new" className="nav-mobile-link" onClick={closeMobile}>New Post</Link>
              <button className="nav-mobile-link nav-mobile-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="nav-mobile-link nav-mobile-cta" onClick={closeMobile}>Admin Login</Link>
          )}
        </nav>
      )}
    </header>
  )
}

export default SiteHeader
