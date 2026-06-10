import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { blogService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import initialPosts from '../data/posts'
import { getImageUrl } from '../utils/image'

const EditBlogPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()

  const [formState, setFormState] = useState({
    title: '',
    slug: '',
    excerpt: '',
    category: '',
    author: '',
    tags: '',
    content: '',
    status: 'draft',
  })
  const [loadingPost, setLoadingPost] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved | error
  const [errorMsg, setErrorMsg] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [coverDragActive, setCoverDragActive] = useState(false)
  const [attachDragActive, setAttachDragActive] = useState(false)
  const coverInputRef = useRef(null)

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

  // Load existing post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoadingPost(true)
        const res = await blogService.getPostBySlug(slug)
        const post = res.data
        setFormState({
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          category: post.category || '',
          author: post.author || '',
          tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
          content: post.content || '',
          status: post.status || 'draft',
        })
        if (post.image) setCoverPreview(post.image)
      } catch (err) {
        setLoadError('Failed to load post: ' + (err?.response?.data?.message || err.message))
      } finally {
        setLoadingPost(false)
      }
    }
    fetchPost()
  }, [slug])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
  }


  const handleCoverChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImage(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const removeCover = (e) => {
    try {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      setCoverImage(null)
      if (coverPreview && typeof coverPreview === 'string' && coverPreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverPreview)
      }
      setCoverPreview(null)
      if (coverInputRef.current) coverInputRef.current.value = ''
    } catch (err) {
      alert("Error in removeCover: " + err.message + "\n" + err.stack)
    }
  }

  const onCoverDragOver = useCallback((e) => { e.preventDefault(); setCoverDragActive(true) }, [])
  const onCoverDragLeave = useCallback((e) => { e.preventDefault(); setCoverDragActive(false) }, [])
  const onCoverDrop = useCallback((e) => {
    e.preventDefault(); setCoverDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setCoverImage(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }, [])



  const categoryOptions = useMemo(() => {
    const cats = new Set(initialPosts.map(p => p.category).filter(Boolean))
    cats.add('Others')
    return Array.from(cats)
  }, [])

  const handleSave = async (newStatus) => {
    if (!formState.title || !formState.content) {
      setSaveState('error')
      setErrorMsg('Title and content are required.')
      return
    }

    setSaveState('saving')
    setErrorMsg(null)

    const colors = { 'Photography': '#1f3c2f', 'Editing': '#2c3e50', 'Gear': '#d35400', 'Travel': '#2980b9' }
    const category_color = colors[formState.category] || '#1f3c2f'
    const wordCount = formState.content.trim().split(/\s+/).length
    const readingTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`

    const fd = new FormData()
    const data = {
      ...formState,
      status: newStatus || formState.status,
      category_color,
      readingTime,
      image: coverImage ? '' : (coverPreview || ''),
      tags: formState.tags.split(',').map(t => t.trim()).filter(Boolean).join(',')
    }
    if (data.status === 'published' && !data.publishedAt) {
      data.publishedAt = new Date().toISOString()
    }
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, v)
    })
    if (coverImage) fd.append('coverImage', coverImage)

    try {
      await blogService.updatePost(slug, fd, token)
      setSaveState('saved')
      setTimeout(() => {
        navigate('/admin')
      }, 1000)
    } catch (err) {
      setSaveState('error')
      setErrorMsg(err?.response?.data?.message || 'Save failed. Please try again.')
    }
  }

  if (loadingPost) {
    return (
      <div className="site-container" style={{ paddingTop: 80, textAlign: 'center' }}>
        <div className="admin-spinner" style={{ margin: '0 auto 16px' }} />
        <p className="muted">Loading post…</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="site-container" style={{ paddingTop: 80 }}>
        <div className="admin-error-msg">{loadError}</div>
      </div>
    )
  }

  return (
    <div className="site-container">
      <section className="section-heading">
        <div>
          <p className="eyebrow">Editing</p>
          <h2>Edit Post</h2>
        </div>
        <p className="muted">Make changes and save or publish when ready.</p>
      </section>

      <div className="editor-shell">
        <form className="editor-form">
          <input className="input" name="title" value={formState.title} onChange={handleChange} placeholder="Post title" />
          <input className="input" name="slug" value={formState.slug} onChange={handleChange} placeholder="Slug" />
          <input className="input" name="excerpt" value={formState.excerpt} onChange={handleChange} placeholder="Excerpt" />
          <div className="editor-grid">
            <select className="input select-green" name="category" value={formState.category} onChange={handleChange}>
              <option value="" disabled>Select category</option>
              {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <input className="input" name="author" value={formState.author} onChange={handleChange} placeholder="Author" />
            <input className="input" name="tags" value={formState.tags} onChange={handleChange} placeholder="Tags (comma-separated)" />
          </div>

          {/* Cover Image */}
          <div className="upload-section">
            <label className="upload-label">Cover image</label>
            {coverPreview ? (
              <div className="cover-preview">
                <img src={getImageUrl(coverPreview)} alt="Cover preview" />
                <button type="button" className="cover-remove" onClick={removeCover} aria-label="Remove cover image">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
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
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p className="upload-zone-text">Drop an image here or <span>browse</span></p>
                <p className="upload-zone-hint">JPG, PNG or WebP — max 5 MB</p>
              </div>
            )}
            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverChange} hidden />
          </div>

          {/* Toolbar & Editor */}
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
              {saveState === 'saved' && <span className="status-saved">✓ Saved — redirecting…</span>}
              {saveState === 'error' && <span className="error">{errorMsg}</span>}
            </div>
            <button className="btn ghost" type="button" onClick={() => navigate('/admin')}>Cancel</button>
            <button className="btn ghost" type="button" onClick={() => handleSave('draft')} disabled={saveState === 'saving'}>Save as Draft</button>
            <button className="btn publish" type="button" onClick={() => handleSave('published')} disabled={saveState === 'saving'}>
              {saveState === 'saving' ? 'Saving…' : 'Save & Publish'}
            </button>
          </div>
        </form>

        {/* Preview */}
        <section className="preview-panel">
          <p className="eyebrow">Preview</p>
          {coverPreview && (
            <div className="preview-cover">
              <img src={getImageUrl(coverPreview)} alt="Cover" />
            </div>
          )}
          <h3>{formState.title || 'Untitled draft'}</h3>
          <p className="muted">{formState.excerpt || 'Add an excerpt…'}</p>
          <div className="preview-meta">
            <span>{formState.category || 'Uncategorized'}</span>
            <span>{formState.tags || 'No tags'}</span>
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

export default EditBlogPage
