import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const SiteHeader = () => {
  const { isAdmin, admin, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    setDropdownOpen(false)
    logout()
    navigate('/')
  }

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

          {isAdmin ? (
            /* ── Admin logged-in state ── */
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
            /* ── Guest state ── */
            <Link to="/login" id="admin-login-btn" className="nav-cta nav-login-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default SiteHeader
