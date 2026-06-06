import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import HomeHero from '../components/HomeHero'
import FeaturedPost from '../components/FeaturedPost'
import PostGrid from '../components/PostGrid'
import initialPosts from '../data/posts'
import { blogService } from '../services/api'
import { useAuth } from '../context/AuthContext'

const HomePage = () => {
  const { isAdmin } = useAuth()
  const [posts, setPosts] = useState(initialPosts)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await blogService.getPosts()
        if (res.data && res.data.length > 0) {
          const publishedBackend = res.data.filter(p => p.status !== 'draft')
          const backendSlugs = new Set(publishedBackend.map((p) => p.slug))
          const uniqueStatic = initialPosts.filter((p) => !backendSlugs.has(p.slug) && p.status !== 'draft')
          setPosts([...publishedBackend, ...uniqueStatic])
        }
      } catch (err) {
        console.error('Home fetch failed:', err)
      }
    }
    fetchPosts()
  }, [])

  const sorted = useMemo(() => {
    return [...posts].sort((a, b) => (a.display_order || 99) - (b.display_order || 99))
  }, [posts])

  const featured = sorted.find((post) => post.type === 'featured' || post.display_order === 1) || sorted[0]
  const grid = sorted.filter((post) => (post._id || post.id) !== (featured?._id || featured?.id))

  const categories = useMemo(() => {
    const unique = posts.reduce((acc, post) => {
      if (!acc.find((item) => item.label === post.category)) {
        acc.push({
          label: post.category,
          count: 1,
          image: post.image
        })
      } else {
        const idx = acc.findIndex(i => i.label === post.category)
        acc[idx].count += 1
      }
      return acc
    }, [])
    return unique
  }, [posts])

  return (
    <div className="site-container">
      <HomeHero />
      {featured && <FeaturedPost post={featured} />}
      <section className="category-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Topics</p>
            <h2>Browse by category</h2>
          </div>
          <p className="muted">Jump into the areas your creativity is calling for right now.</p>
        </div>
        <div className="category-grid">
          {categories.map((item) => (
            <Link 
              key={item.label} 
              to={`/blog?category=${encodeURIComponent(item.label)}`} 
              className="category-card"
            >
              <img src={item.image} alt={item.label} />
              <div className="category-card-body">
                <h3>{item.label}</h3>
                <p className="muted">{item.count} stories</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="section-heading">
        <div>
          <p className="eyebrow">Latest</p>
          <h2>Recent stories</h2>
        </div>
        <p className="muted">Fresh ideas on shooting, editing, and building a creative business.</p>
      </section>
      <PostGrid posts={grid} />
      <section className="cta-section">
        <div className="cta-card">
          <p className="eyebrow">Want to Create?</p>
          <h3>Share your next story with us.</h3>
          <p className="muted">Let us draft, preview, and publish with a calm, editorial workspace.</p>
          {isAdmin ? (
            <Link className="btn primary" to="/new">Start a draft</Link>
          ) : (
            <a className="btn primary" href="mailto:admin@bloghub.com">Contact Admin</a>
          )}
        </div>
        <div className="cta-card alt">
          <p className="eyebrow">Subscribe</p>
          <h3>Get the weekly edit</h3>
          <p className="muted">Notes on trekking, trail guides, and the explorer's mindset.</p>
          <button className="btn ghost" type="button">Join newsletter</button>
        </div>
      </section>
    </div>
  )
}

export default HomePage
