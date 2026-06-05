import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { blogService } from '../services/api'
import { useAuth } from '../context/AuthContext'

const STATUS_COLORS = {
  published: { bg: '#e6f4ea', text: '#1e7e34', dot: '#2ecc71' },
  draft:     { bg: '#fff3cd', text: '#856404', dot: '#f1c40f' },
}

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { token, admin, logout } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null) // slug to confirm
  const [actionMsg, setActionMsg] = useState(null)
  const [filter, setFilter] = useState('all') // 'all' | 'published' | 'draft'
  const [search, setSearch] = useState('')

  const fetchPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await blogService.getPosts()
      setPosts(res.data)
    } catch (err) {
      setError('Failed to load posts. ' + (err?.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPosts() }, [])

  const showMsg = (msg, isError = false) => {
    setActionMsg({ msg, isError })
    setTimeout(() => setActionMsg(null), 3500)
  }

  const handleDelete = async (slug) => {
    try {
      await blogService.deletePost(slug, token)
      setPosts(prev => prev.filter(p => p.slug !== slug))
      showMsg('Post deleted successfully.')
    } catch (err) {
      showMsg(err?.response?.data?.message || 'Delete failed.', true)
    } finally {
      setDeleteConfirm(null)
    }
  }

  const handleToggleStatus = async (post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published'
    try {
      const res = await blogService.updateStatus(post.slug, newStatus, token)
      setPosts(prev => prev.map(p => p.slug === post.slug ? res.data : p))
      showMsg(`Post ${newStatus === 'published' ? 'published' : 'moved to draft'}.`)
    } catch (err) {
      showMsg(err?.response?.data?.message || 'Status update failed.', true)
    }
  }

  const filteredPosts = posts.filter(p => {
    const matchesFilter = filter === 'all' || p.status === filter
    const matchesSearch = !search.trim() ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const counts = {
    all: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
  }

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-inner site-container">
          <div className="admin-header-left">
            <Link to="/" className="admin-brand">Lenscraft</Link>
            <span className="admin-breadcrumb">/ Admin</span>
          </div>
          <div className="admin-header-right">
            <span className="admin-greeting">
              <span className="admin-avatar">{admin?.email?.[0]?.toUpperCase() || 'A'}</span>
              {admin?.email}
            </span>
            <button
              id="admin-logout-btn"
              className="btn ghost admin-logout-btn"
              onClick={() => { logout(); navigate('/') }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="site-container admin-content">
        {/* Page Title */}
        <div className="admin-title-row">
          <div>
            <p className="eyebrow">Content Management</p>
            <h1 className="admin-title">Admin Dashboard</h1>
          </div>
          <Link to="/new" id="admin-new-post-btn" className="btn primary admin-new-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Post
          </Link>
        </div>

        {/* Stats Row */}
        <div className="admin-stats">
          {[
            { label: 'Total Posts', value: counts.all, icon: '📄' },
            { label: 'Published', value: counts.published, icon: '✅' },
            { label: 'Drafts', value: counts.draft, icon: '✏️' },
          ].map(s => (
            <div key={s.label} className="admin-stat-card">
              <span className="admin-stat-icon">{s.icon}</span>
              <div>
                <p className="admin-stat-value">{s.value}</p>
                <p className="admin-stat-label">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Message */}
        {actionMsg && (
          <div className={`admin-action-msg ${actionMsg.isError ? 'error' : 'success'}`}>
            {actionMsg.isError ? '✕' : '✓'} {actionMsg.msg}
          </div>
        )}

        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="admin-filter-tabs">
            {['all', 'published', 'draft'].map(f => (
              <button
                key={f}
                className={`admin-filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span className="admin-filter-count">{counts[f]}</span>
              </button>
            ))}
          </div>
          <input
            type="search"
            className="input admin-search"
            placeholder="Search posts…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Posts Table */}
        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner" />
            <p>Loading posts…</p>
          </div>
        ) : error ? (
          <div className="admin-error-msg">{error}</div>
        ) : filteredPosts.length === 0 ? (
          <div className="admin-empty">
            <p>No posts found.</p>
            <Link to="/new" className="btn primary">Create your first post</Link>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map(post => {
                  const statusStyle = STATUS_COLORS[post.status] || STATUS_COLORS.draft
                  const date = post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

                  return (
                    <tr key={post._id} className="admin-table-row">
                      <td className="admin-post-title-cell">
                        <Link to={`/blog/${post.slug}`} className="admin-post-link" target="_blank">
                          {post.title}
                        </Link>
                        <span className="admin-post-author">{post.author || 'Anonymous'}</span>
                      </td>
                      <td>
                        {post.category && (
                          <span className="admin-category-chip">{post.category}</span>
                        )}
                      </td>
                      <td>
                        <span
                          className="admin-status-badge"
                          style={{ background: statusStyle.bg, color: statusStyle.text }}
                        >
                          <span className="admin-status-dot" style={{ background: statusStyle.dot }} />
                          {post.status}
                        </span>
                      </td>
                      <td className="admin-date-cell">{date}</td>
                      <td>
                        <div className="admin-actions">
                          {/* Toggle publish/draft */}
                          <button
                            className={`admin-action-btn ${post.status === 'published' ? 'draft-btn' : 'publish-btn'}`}
                            title={post.status === 'published' ? 'Move to Draft' : 'Publish'}
                            onClick={() => handleToggleStatus(post)}
                          >
                            {post.status === 'published' ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                              </svg>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            )}
                            {post.status === 'published' ? 'Unpublish' : 'Publish'}
                          </button>
                          {/* Edit */}
                          <button
                            className="admin-action-btn edit-btn"
                            title="Edit post"
                            onClick={() => navigate(`/admin/edit/${post.slug}`)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Edit
                          </button>
                          {/* Delete */}
                          <button
                            className="admin-action-btn delete-btn"
                            title="Delete post"
                            onClick={() => setDeleteConfirm(post.slug)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
            <h3 className="admin-modal-title">Delete Post?</h3>
            <p className="admin-modal-sub">This action cannot be undone. The post will be permanently removed.</p>
            <div className="admin-modal-actions">
              <button className="btn ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn admin-delete-confirm-btn" onClick={() => handleDelete(deleteConfirm)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
