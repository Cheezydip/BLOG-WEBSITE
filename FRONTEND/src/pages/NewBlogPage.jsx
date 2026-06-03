import React, { useEffect, useMemo, useState } from 'react'
import { blogService } from '../services/api'

const NewBlogPage = () => {
  const [formState, setFormState] = useState({
    title: '',
    slug: '',
    excerpt: '',
    category: '',
    author: '',
    tags: '',
    content: ''
  })
  const [isPreview, setIsPreview] = useState(false)
  const [saveState, setSaveState] = useState('idle')
  const [errorMsg, setErrorMsg] = useState(null)
  const [lastSavedAt, setLastSavedAt] = useState(null)
  const AUTOSAVE_KEY = 'blog:currentDraft'
  const [attachments, setAttachments] = useState([])

  // load saved draft from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY)
      if (raw) {
        const data = JSON.parse(raw)
        setFormState((prev) => ({ ...prev, ...data }))
        if (data._savedAt) setLastSavedAt(data._savedAt)
      }
    } catch (e) {
      // ignore parse errors
    }
  }, [])

  const previewParagraphs = useMemo(() => {
    if (!formState.content.trim()) {
      return ['Your draft preview will appear here as you write.']
    }

    return formState.content.split('\n').filter((line) => line.trim().length)
  }, [formState.content])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => {
      const next = { ...prev, [name]: value }
      if (name === 'title' && !prev.slug) {
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }
      return next
    })
  }

  const handlePreviewToggle = () => {
    setIsPreview((prev) => !prev)
  }

  const handleSaveDraft = () => {
    setSaveState('saving')
    const payload = { ...formState, _savedAt: new Date().toISOString() }
    try {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(payload))
      setTimeout(() => {
        setSaveState('saved')
        setLastSavedAt(payload._savedAt)
        setErrorMsg(null)
      }, 600)
    } catch (e) {
      setSaveState('error')
      setErrorMsg(e.message || 'Failed to save draft locally')
    }
  }

  // autosave debounced
  useEffect(() => {
    const id = setTimeout(() => {
      // only autosave if there is some content
      if (formState.title || formState.content) {
        const payload = { ...formState, _savedAt: new Date().toISOString() }
        try {
          localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(payload))
          setLastSavedAt(payload._savedAt)
          setSaveState('saved')
          setErrorMsg(null)
        } catch (e) {
          setSaveState('error')
          setErrorMsg(e.message || 'Autosave failed')
        }
      }
    }, 1200)

    return () => clearTimeout(id)
  }, [formState])

  const handlePublish = async () => {
    // basic client-side validation
    if (!formState.title || !formState.content) {
      setSaveState('error')
      setErrorMsg('Title and content are required to publish')
      return
    }

    // simulated publish: save under a published key with timestamp
    setSaveState('publishing')
    
    // Auto-pick a color if possible
    const colors = {
      'Photography': '#1f3c2f',
      'Editing': '#2c3e50',
      'Gear': '#d35400',
      'Travel': '#2980b9'
    }
    const category_color = colors[formState.category] || '#1f3c2f'

    const published = {
      ...formState,
      status: 'published',
      publishedAt: new Date().toISOString(),
      category_color,
      image: '/src/assets/blog_pic_1.png', // Default image
      tags: formState.tags.split(',').map((t) => t.trim()).filter(Boolean)
    }

    try {
      // 1. Persist to Backend (support files)
      let resp
      if (attachments && attachments.length) {
        const fd = new FormData()
        Object.entries(published).forEach(([k, v]) => {
          if (Array.isArray(v)) {
            fd.append(k, v.join(','))
          } else {
            fd.append(k, v === undefined || v === null ? '' : v)
          }
        })
        attachments.forEach((file) => fd.append('attachments', file))
        resp = await blogService.createPost(fd)
      } else {
        resp = await blogService.createPost(published)
      }

      // 2. Persist to LocalStorage for fallback
      const key = `blog:published:${(resp && resp.data && (resp.data.slug || resp.data._id)) || published.slug || Date.now()}`
      localStorage.setItem(key, JSON.stringify(resp.data || published))

      // 3. Clear draft
      localStorage.removeItem(AUTOSAVE_KEY)

      setTimeout(() => {
        setSaveState('published')
        setLastSavedAt(published.publishedAt)
        setErrorMsg(null)
      }, 800)
    } catch (e) {
      console.error('Publish error:', e)
      setSaveState('error')
      setErrorMsg(e?.response?.data?.message || e.message || 'Publish failed')
    }
  }

  const handleAttachmentsChange = (e) => {
    const files = Array.from(e.target.files || [])
    setAttachments(files)
  }

  return (
    <div className="site-container">
      <section className="section-heading">
        <div>
          <p className="eyebrow">New story</p>
          <h2>Draft a new post</h2>
        </div>
        <p className="muted">Start writing manually and tap into AI help when you need it.</p>
      </section>

      <div className="editor-shell">
        <form className="editor-form">
          <input
            className="input"
            name="title"
            value={formState.title}
            onChange={handleChange}
            placeholder="Post title"
          />
          <input
            className="input"
            name="slug"
            value={formState.slug}
            onChange={handleChange}
            placeholder="Slug"
          />
          <input
            className="input"
            name="excerpt"
            value={formState.excerpt}
            onChange={handleChange}
            placeholder="Excerpt"
          />
          <div className="editor-grid">
            <input
              className="input"
              name="category"
              value={formState.category}
              onChange={handleChange}
              placeholder="Category"
            />
            <input
              className="input"
              name="author"
              value={formState.author}
              onChange={handleChange}
              placeholder="Author"
            />
            <input
              className="input"
              name="tags"
              value={formState.tags}
              onChange={handleChange}
              placeholder="Tags"
            />
          </div>
          <div className="form-group">
            <label>Attachments</label>
            <input type="file" multiple onChange={handleAttachmentsChange} />
            {attachments.length > 0 && (
              <div className="attachments-list">
                {attachments.map((f, i) => (
                  <div key={i}>{f.name} ({Math.round(f.size/1024)} KB)</div>
                ))}
              </div>
            )}
          </div>
          <textarea
            className="textarea"
            name="content"
            value={formState.content}
            onChange={handleChange}
            placeholder="Start writing your story..."
          ></textarea>
          <div className="editor-actions">
            <div className="save-status">
              {saveState === 'saving' && <span>Saving…</span>}
              {saveState === 'saved' && <span>Saved {lastSavedAt ? new Date(lastSavedAt).toLocaleTimeString() : ''}</span>}
              {saveState === 'publishing' && <span>Publishing…</span>}
              {saveState === 'published' && <span>Published</span>}
              {saveState === 'error' && <span className="error">Save error: {errorMsg}</span>}
            </div>
            <button className="btn ghost" type="button" onClick={handlePreviewToggle}>
              {isPreview ? 'Edit mode' : 'Preview'}
            </button>
            <button className="btn primary" type="button" onClick={handleSaveDraft}>
              {saveState === 'saving' ? 'Saving...' : saveState === 'saved' ? 'Save again' : 'Save draft'}
            </button>
            <button className="btn primary" type="button" onClick={handlePublish}>
              Publish
            </button>
          </div>
        </form>
        <section className="preview-panel">
          <p className="eyebrow">Preview</p>
          <h3>{formState.title || 'Untitled draft'}</h3>
          <p className="muted">{formState.excerpt || 'Add an excerpt to highlight the key idea.'}</p>
          <div className="preview-meta">
            <span>{formState.category || 'Uncategorized'}</span>
            <span>{formState.tags || 'No tags yet'}</span>
          </div>
          <div className="preview-body">
            {previewParagraphs.map((paragraph, index) => (
              <p key={`preview-${index}`}>{paragraph}</p>
            ))}
          </div>
        </section>
        <aside className="ai-panel">
          <p className="eyebrow">Generate with AI</p>
          <h3>Kickstart your draft</h3>
          <p className="muted">Describe the idea and choose the tone for a first draft.</p>
          <input className="input" placeholder="Topic or prompt" />
          <select className="input">
            <option>Professional</option>
            <option>Casual</option>
            <option>Educational</option>
            <option>Opinionated</option>
          </select>
          <select className="input">
            <option>Short</option>
            <option>Medium</option>
            <option>Long</option>
          </select>
          <button className="btn primary" type="button">Generate draft</button>
        </aside>
      </div>
    </div>
  )
}

export default NewBlogPage
