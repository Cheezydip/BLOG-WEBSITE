import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import initialPosts from '../data/posts'
import PostGrid from '../components/PostGrid'
import { blogService } from '../services/api'

const BlogDetailPage = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [allPosts, setAllPosts] = useState(initialPosts)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Try getting specific post
        const res = await blogService.getPostBySlug(slug)
        if (res.data) {
          setPost(res.data)
        }

        // Also get all posts for related section
        const allRes = await blogService.getPosts()
        if (allRes.data && allRes.data.length > 0) {
          setAllPosts(allRes.data)
        }
      } catch (err) {
        console.error('Fetch detail failed:', err)
        // Local fallback
        const local = initialPosts.find(p => p.slug === slug)
        if (local) setPost(local)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  if (loading) {
    return (
      <div className="site-container">
        <section className="section-heading">
          <h2>Opening story…</h2>
        </section>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="site-container">
        <section className="section-heading">
          <h2>Post not found</h2>
          <p className="muted">We could not find that story.</p>
        </section>
        <Link className="btn ghost" to="/blog">
          Back to all posts
        </Link>
      </div>
    )
  }

  const relatedPosts = allPosts
    .filter((item) => (item._id || item.id) !== (post._id || post.id))
    .filter((item) => item.category === post.category)
    .slice(0, 3)

  const fallbackPosts = allPosts.filter((item) => (item._id || item.id) !== (post._id || post.id)).slice(0, 3)
  const visibleRelated = relatedPosts.length ? relatedPosts : fallbackPosts

  return (
    <div className="site-container">
      <article className="post-detail">
        <div className="post-detail-header">
          <p className="eyebrow">{post.category}</p>
          <h1>{post.title}</h1>
          <p className="muted">{post.excerpt}</p>
          <div className="post-meta">
            <span>{post.author}</span>
            <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}</span>
            <span>{post.readingTime}</span>
          </div>
        </div>
        <div className="post-detail-media">
          <img src={post.image} alt={post.title} />
        </div>
        <div className="post-detail-body">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={`${post._id || post.id}-p-${index}`} dangerouslySetInnerHTML={{ __html: paragraph }} />
          ))}
        </div>
      </article>
      <section className="related">
        <div>
          <p className="eyebrow">Keep reading</p>
          <h3>Related posts</h3>
        </div>
        <div className="related-actions">
          <Link className="btn ghost" to="/blog">
            Explore all
          </Link>
        </div>
      </section>
      <div className="related-grid">
        <PostGrid posts={visibleRelated} />
      </div>
    </div>
  )
}

export default BlogDetailPage
