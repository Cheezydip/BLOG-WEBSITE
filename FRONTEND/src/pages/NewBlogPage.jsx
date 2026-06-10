import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { blogService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import initialPosts from '../data/posts'

const AUTOSAVE_KEY = 'blog:currentDraft'

const NewBlogPage = () => {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [formState, setFormState] = useState(() => {
    const defaultState = {
      title: '',
      slug: '',
      excerpt: '',
      category: '',
      author: '',
      tags: '',
      content: ''
    }
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY)
      if (raw) {
        const data = JSON.parse(raw)
        return { ...defaultState, ...data }
      }
    } catch {
      // ignore
    }
    return defaultState
  })
  const [isPreview, setIsPreview] = useState(false)
  const [saveState, setSaveState] = useState('idle')
  const [errorMsg, setErrorMsg] = useState(null)
  const [lastSavedAt, setLastSavedAt] = useState(() => {
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY)
      if (raw) {
        const data = JSON.parse(raw)
        return data._savedAt || null
      }
    } catch {
      // ignore
    }
    return null
  })
  const [attachments, setAttachments] = useState([])
  const [coverImage, setCoverImage] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [coverDragActive, setCoverDragActive] = useState(false)
  const [attachDragActive, setAttachDragActive] = useState(false)
  const coverInputRef = useRef(null)
  const attachInputRef = useRef(null)

  // AI Panel States
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiTone, setAiTone] = useState('Professional')
  const [aiLength, setAiLength] = useState('Medium')
  const [aiMode, setAiMode] = useState('draft') // 'draft', 'outline', 'title'
  const [aiStatus, setAiStatus] = useState('idle') // 'idle', 'generating', 'done', 'error'
  const [aiError, setAiError] = useState(null)
  const [showAIConfirm, setShowAIConfirm] = useState(false)

  const handleConfirmApply = (applyMode) => {
    setShowAIConfirm(false)
    handleGenerate(applyMode)
  }

  const handleGenerateClick = () => {
    if (!aiPrompt.trim()) return

    const hasTextContent = formState.content.replace(/<[^>]*>/g, '').trim()
    if (hasTextContent) {
      setShowAIConfirm(true)
    } else {
      handleGenerate('replace')
    }
  }

  const handleGenerate = async (applyMode) => {
    setAiStatus('generating')
    setAiError(null)

    const shouldAppend = applyMode === 'append'
    let currentContent = shouldAppend ? formState.content + '\n\n' : ''

    setFormState((prev) => ({
      ...prev,
      content: currentContent
    }))

    try {
      const response = await blogService.generateAIStream({
        prompt: aiPrompt,
        tone: aiTone,
        length: aiLength,
        mode: aiMode
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.message || `Server error: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let buffer = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.substring(6).trim()
            if (!dataStr) continue

            try {
              const data = JSON.parse(dataStr)
              if (data.type === 'content') {
                const formattedChunk = data.text.replace(/\n/g, '<br>')
                currentContent += formattedChunk
                setFormState((prev) => ({
                  ...prev,
                  content: currentContent
                }))
              } else if (data.type === 'done') {
                setFormState((prev) => {
                  const updated = { ...prev }
                  if (data.title && !prev.title) updated.title = data.title
                  if (data.excerpt && !prev.excerpt) updated.excerpt = data.excerpt
                  if (data.tags && !prev.tags) {
                    updated.tags = Array.isArray(data.tags) ? data.tags.join(', ') : data.tags
                  }
                  if (data.category && !prev.category) updated.category = data.category

                  if (data.title && !prev.slug) {
                    updated.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                  }
                  return updated
                })
                setAiStatus('done')
              } else if (data.type === 'error') {
                throw new Error(data.message || 'AI Generation failed')
              }
            } catch (e) {
              console.error('Error parsing SSE line:', e, line)
              if (dataStr.includes('"type":"error"')) {
                throw e
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error)
      setAiStatus('error')
      setAiError(error.message || 'Failed to generate content. Please try again.')
    }
  }


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


  const handleSaveDraft = async () => {
    // basic client-side validation
    if (!formState.title || !formState.content) {
      setSaveState('error')
      setErrorMsg('Title and content are required to save draft')
      return
    }

    setSaveState('saving')

    // Auto-pick a color if possible
    const colors = {
      'Photography': '#1f3c2f',
      'Editing': '#2c3e50',
      'Gear': '#d35400',
      'Travel': '#2980b9'
    }
    const category_color = colors[formState.category] || '#1f3c2f'

    // Estimate reading time
    const wordCount = formState.content.trim().split(/\s+/).length
    const readingTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`

    const draft = {
      ...formState,
      status: 'draft',
      category_color,
      readingTime,
      image: '/src/assets/blog_pic_1.png',
      tags: formState.tags.split(',').map((t) => t.trim()).filter(Boolean)
    }

    try {
      // Always use FormData so we can attach cover image + attachments
      const fd = new FormData()
      Object.entries(draft).forEach(([k, v]) => {
        if (Array.isArray(v)) {
          fd.append(k, v.join(','))
        } else {
          fd.append(k, v === undefined || v === null ? '' : v)
        }
      })
      if (coverImage) {
        fd.append('coverImage', coverImage)
      }
      attachments.forEach((file) => fd.append('attachments', file))

      const resp = await blogService.createPost(fd, token)

      // Persist to LocalStorage for fallback
      const slug = resp?.data?.slug || draft.slug || Date.now()
      const key = `blog:published:${slug}`
      localStorage.setItem(key, JSON.stringify(resp.data || draft))

      // Clear draft locally
      localStorage.removeItem(AUTOSAVE_KEY)

      setSaveState('saved')
      setErrorMsg(null)

      // Navigate to the admin dashboard after a brief moment
      setTimeout(() => {
        navigate('/admin')
      }, 1000)
    } catch (e) {
      console.error('Save draft error:', e)
      setSaveState('error')
      setErrorMsg(e?.response?.data?.message || e.message || 'Save draft failed')
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

    setSaveState('publishing')

    // Auto-pick a color if possible
    const colors = {
      'Photography': '#1f3c2f',
      'Editing': '#2c3e50',
      'Gear': '#d35400',
      'Travel': '#2980b9'
    }
    const category_color = colors[formState.category] || '#1f3c2f'

    // Estimate reading time
    const wordCount = formState.content.trim().split(/\s+/).length
    const readingTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`

    const published = {
      ...formState,
      status: 'published',
      publishedAt: new Date().toISOString(),
      category_color,
      readingTime,
      image: '/src/assets/blog_pic_1.png',
      tags: formState.tags.split(',').map((t) => t.trim()).filter(Boolean)
    }

    try {
      // Always use FormData so we can attach cover image + attachments
      const fd = new FormData()
      Object.entries(published).forEach(([k, v]) => {
        if (Array.isArray(v)) {
          fd.append(k, v.join(','))
        } else {
          fd.append(k, v === undefined || v === null ? '' : v)
        }
      })
      if (coverImage) {
        fd.append('coverImage', coverImage)
      }
      attachments.forEach((file) => fd.append('attachments', file))

      const resp = await blogService.createPost(fd, token)

      // Persist to LocalStorage for fallback
      const slug = resp?.data?.slug || published.slug || Date.now()
      const key = `blog:published:${slug}`
      localStorage.setItem(key, JSON.stringify(resp.data || published))

      // Clear draft
      localStorage.removeItem(AUTOSAVE_KEY)

      setSaveState('published')
      setLastSavedAt(published.publishedAt)
      setErrorMsg(null)

      // Navigate to the published post after a brief moment
      setTimeout(() => {
        navigate(`/blog/${resp?.data?.slug || published.slug}`)
      }, 1200)
    } catch (e) {
      console.error('Publish error:', e)
      setSaveState('error')
      setErrorMsg(e?.response?.data?.message || e.message || 'Publish failed')
    }
  }

  const handleAttachmentsChange = (e) => {
    const files = Array.from(e.target.files || [])
    setAttachments((prev) => [...prev, ...files])
  }

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImage(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const removeCover = () => {
    setCoverImage(null)
    if (coverPreview) URL.revokeObjectURL(coverPreview)
    setCoverPreview(null)
    if (coverInputRef.current) coverInputRef.current.value = ''
  }

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  // Drag handlers for cover image
  const onCoverDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setCoverDragActive(true)
  }, [])
  const onCoverDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setCoverDragActive(false)
  }, [])
  const onCoverDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setCoverDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setCoverImage(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }, [])

  // Drag handlers for attachments
  const onAttachDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setAttachDragActive(true)
  }, [])
  const onAttachDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setAttachDragActive(false)
  }, [])
  const onAttachDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setAttachDragActive(false)
    const files = Array.from(e.dataTransfer.files || [])
    if (files.length) setAttachments((prev) => [...prev, ...files])
  }, [])

  // Build category options from static posts + backend
  const categoryOptions = useMemo(() => {
    const cats = new Set(initialPosts.map((p) => p.category).filter(Boolean))
    cats.add('Others')
    return Array.from(cats)
  }, [])

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
            <select
              className="input select-green"
              name="category"
              value={formState.category}
              onChange={handleChange}
            >
              <option value="" disabled>Select category</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
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
          {/* Cover Image Upload */}
          <div className="upload-section">
            <label className="upload-label">Cover image</label>
            {coverPreview ? (
              <div className="cover-preview">
                <img src={coverPreview} alt="Cover preview" />
                <button type="button" className="cover-remove" onClick={removeCover} aria-label="Remove cover image">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
              </div>
            ) : (
              <div
                className={`upload-zone${coverDragActive ? ' drag-active' : ''}`}
                onClick={() => coverInputRef.current?.click()}
                onDragOver={onCoverDragOver}
                onDragLeave={onCoverDragLeave}
                onDrop={onCoverDrop}
              >
                <div className="upload-zone-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <p className="upload-zone-text">Drop an image here or <span>browse</span></p>
                <p className="upload-zone-hint">JPG, PNG or WebP — max 5 MB</p>
              </div>
            )}
            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverChange} hidden />
          </div>

          {/* Attachments Upload */}
          <div className="upload-section">
            <label className="upload-label">Attachments</label>
            <div
              className={`upload-zone compact${attachDragActive ? ' drag-active' : ''}`}
              onClick={() => attachInputRef.current?.click()}
              onDragOver={onAttachDragOver}
              onDragLeave={onAttachDragLeave}
              onDrop={onAttachDrop}
            >
              <div className="upload-zone-icon small">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <p className="upload-zone-text">Drop files or <span>browse</span></p>
            </div>
            <input ref={attachInputRef} type="file" multiple onChange={handleAttachmentsChange} hidden />
            {attachments.length > 0 && (
              <ul className="attachments-list">
                {attachments.map((f, i) => (
                  <li key={i} className="attachment-item">
                    <div className="attachment-info">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span className="attachment-name">{f.name}</span>
                      <span className="attachment-size">{Math.round(f.size / 1024)} KB</span>
                    </div>
                    <button type="button" className="attachment-remove" onClick={() => removeAttachment(i)} aria-label={`Remove ${f.name}`}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="editor-container">
            <ReactQuill
              theme="snow"
              value={formState.content}
              onChange={(value) => setFormState(prev => ({ ...prev, content: value }))}
              placeholder="Start writing your story..."
              modules={{
                toolbar: [
                  [{ 'header': [2, 3, false] }],
                  ['bold', 'italic', 'underline'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'color': [] }],
                  ['clean']
                ],
              }}
            />
          </div>
          <div className="editor-actions">
            <div className="save-status">
              {saveState === 'saving' && <span className="status-saving">● Saving…</span>}
              {saveState === 'saved' && <span className="status-saved">✓ Saved {lastSavedAt ? new Date(lastSavedAt).toLocaleTimeString() : ''}</span>}
              {saveState === 'publishing' && <span className="status-publishing">◌ Publishing…</span>}
              {saveState === 'published' && <span className="status-published">✓ Published — redirecting…</span>}
              {saveState === 'error' && <span className="error">{errorMsg}</span>}
            </div>
            <button className="btn ghost" type="button" onClick={handlePreviewToggle}>
              {isPreview ? 'Edit mode' : 'Preview'}
            </button>
            <button className="btn ghost" type="button" onClick={handleSaveDraft}>
              {saveState === 'saving' ? 'Saving…' : 'Save draft'}
            </button>
            <button className="btn publish" type="button" onClick={handlePublish} disabled={saveState === 'publishing'}>
              {saveState === 'publishing' ? 'Publishing…' : 'Publish'}
            </button>
          </div>
        </form>
        <section className="preview-panel">
          <p className="eyebrow">Preview</p>
          {coverPreview && (
            <div className="preview-cover">
              <img src={coverPreview} alt="Cover" />
            </div>
          )}
          <h3>{formState.title || 'Untitled draft'}</h3>
          <p className="muted">{formState.excerpt || 'Add an excerpt to highlight the key idea.'}</p>
          <div className="preview-meta">
            <span>{formState.category || 'Uncategorized'}</span>
            <span>{formState.tags || 'No tags yet'}</span>
          </div>
          <div className="preview-body">
            {formState.content ? (
              <div className="quill-preview" dangerouslySetInnerHTML={{ __html: formState.content }} />
            ) : (
              <p>Your draft preview will appear here as you write.</p>
            )}
          </div>
        </section>
        <aside className="ai-panel">
          <p className="eyebrow">Generate with AI</p>
          <h3>Kickstart your draft</h3>
          <p className="muted">Describe the idea and choose the tone/format for a first draft.</p>

          <div className="ai-mode-btns">
            <button
              type="button"
              className={`ai-mode-btn ${aiMode === 'draft' ? 'active' : ''}`}
              onClick={() => setAiMode('draft')}
              disabled={aiStatus === 'generating'}
            >
              Full Draft
            </button>
            <button
              type="button"
              className={`ai-mode-btn ${aiMode === 'outline' ? 'active' : ''}`}
              onClick={() => setAiMode('outline')}
              disabled={aiStatus === 'generating'}
            >
              Outline
            </button>
            <button
              type="button"
              className={`ai-mode-btn ${aiMode === 'title' ? 'active' : ''}`}
              onClick={() => setAiMode('title')}
              disabled={aiStatus === 'generating'}
            >
              Titles
            </button>
          </div>

          <textarea
            className="input ai-textarea"
            placeholder="What should this blog post be about?"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            disabled={aiStatus === 'generating'}
          />

          <div className="ai-options-grid">
            <select
              className="input"
              value={aiTone}
              onChange={(e) => setAiTone(e.target.value)}
              disabled={aiStatus === 'generating'}
            >
              <option value="Professional">Professional</option>
              <option value="Casual">Casual</option>
              <option value="Educational">Educational</option>
              <option value="Opinionated">Opinionated</option>
            </select>

            {aiMode !== 'title' && (
              <select
                className="input"
                value={aiLength}
                onChange={(e) => setAiLength(e.target.value)}
                disabled={aiStatus === 'generating'}
              >
                <option value="Short">Short (~300 words)</option>
                <option value="Medium">Medium (~600 words)</option>
                <option value="Long">Long (~1000 words)</option>
              </select>
            )}
          </div>

          {showAIConfirm && (
            <div className="ai-confirm-bar">
              <p className="ai-confirm-text">Your draft already has content. Choose how to apply:</p>
              <div className="ai-confirm-actions">
                <button type="button" className="btn btn-sm" onClick={() => handleConfirmApply('append')}>
                  Append
                </button>
                <button type="button" className="btn btn-sm danger" onClick={() => handleConfirmApply('replace')}>
                  Overwrite
                </button>
                <button type="button" className="btn btn-sm ghost" onClick={() => setShowAIConfirm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          <button
            className={`btn primary ai-gen-btn ${aiStatus === 'generating' ? 'ai-generating' : ''}`}
            type="button"
            onClick={handleGenerateClick}
            disabled={!aiPrompt.trim() || aiStatus === 'generating'}
          >
            {aiStatus === 'generating' ? 'Generating...' : 'Generate with AI'}
          </button>

          {aiStatus === 'done' && (
            <div className="ai-status-msg success">
              ✓ Generation completed successfully!
            </div>
          )}

          {aiStatus === 'error' && (
            <div className="ai-status-msg error">
              ✕ {aiError}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export default NewBlogPage
