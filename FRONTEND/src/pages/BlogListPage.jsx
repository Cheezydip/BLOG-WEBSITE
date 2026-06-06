import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PostGrid from '../components/PostGrid'
import initialPosts from '../data/posts'
import { blogService } from '../services/api'

const BlogListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || 'All'

  const setCategory = (newCat) => {
    if (newCat === 'All') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', newCat)
    }
    setSearchParams(searchParams)
  }

  const [posts, setPosts] = useState(initialPosts)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('newest')
  const [isSortOpen, setIsSortOpen] = useState(false)
  const sortRef = useRef(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await blogService.getPosts()
        if (response.data && response.data.length > 0) {
          // Merge backend posts with static posts, backend wins on slug collision
          const publishedBackend = response.data.filter((p) => p.status !== 'draft')
          const backendSlugs = new Set(publishedBackend.map((p) => p.slug))
          const uniqueStatic = initialPosts.filter((p) => !backendSlugs.has(p.slug) && p.status !== 'draft')
          setPosts([...publishedBackend, ...uniqueStatic])
        }
      } catch (err) {
        console.error('Failed to fetch posts from backend:', err)
        // Fallback to static posts
      }
    }
    fetchPosts()
  }, [])

  const sortOptions = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'title-asc', label: 'Title A-Z' }
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const categories = useMemo(() => {
    const counts = posts.reduce((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1
      return acc
    }, {})

    return ['All', ...Object.keys(counts)].map((value) => ({
      label: value,
      count: value === 'All' ? posts.length : counts[value]
    }))
  }, [posts])

  const filtered = useMemo(() => {
    const matches = posts.filter((post) => {
      const matchesQuery = `${post.title} ${post.excerpt} ${post.tags?.join(' ')}`
        .toLowerCase()
        .includes(query.toLowerCase())
      const matchesCategory = category === 'All' || post.category === category
      return matchesQuery && matchesCategory
    })

    const sorted = [...matches].sort((a, b) => {
      if (sort === 'title-asc') {
        return a.title.localeCompare(b.title)
      }
      if (sort === 'oldest') {
        return new Date(a.publishedAt) - new Date(b.publishedAt)
      }
      return new Date(b.publishedAt) - new Date(a.publishedAt)
    })

    return sorted
  }, [posts, query, category, sort])

  return (
    <div className="site-container">
      <section className="section-heading">
        <div>
          <p className="eyebrow">Browse</p>
          <h2>All posts</h2>
        </div>
        <p className="muted">Filter by topic, search by keywords, and find your next read.</p>
      </section>

      <div className="filters">
        <div className="filter-row">
          <input
            className="input"
            type="search"
            placeholder="Search by title, excerpt, or tag"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="sort-select" ref={sortRef}>
            <button
              className={`sort-trigger ${isSortOpen ? 'open' : ''}`}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isSortOpen}
              onClick={() => setIsSortOpen((prev) => !prev)}
            >
              {sortOptions.find((option) => option.value === sort)?.label}
            </button>
            {isSortOpen && (
              <ul className="sort-menu" role="listbox">
                {sortOptions.map((option) => (
                  <li key={option.value} role="option" aria-selected={sort === option.value}>
                    <button
                      type="button"
                      className={`sort-option ${sort === option.value ? 'selected' : ''}`}
                      onClick={() => {
                        setSort(option.value)
                        setIsSortOpen(false)
                      }}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="category-row">
          {categories.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`chip ${category === item.label ? 'active' : ''}`}
              onClick={() => setCategory(item.label)}
            >
              {item.label}
              <span className="chip-count">{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      <PostGrid posts={filtered} />
    </div>
  )
}

export default BlogListPage
