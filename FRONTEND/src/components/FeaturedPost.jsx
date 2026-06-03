import React from 'react'
import { Link } from 'react-router-dom'

const FeaturedPost = ({post}) => {
  return (
    <section className="featured">
      <div className="featured-left">
        <img src={post.image} alt={post.title} />
      </div>
      <div className="featured-right">
        <div className="pill">{post.badge || 'Must Read'}</div>
        <h2 className="featured-title">{post.title}</h2>
        <p className="featured-desc">{post.excerpt}</p>

        <div className="featured-footer">
          <div className="author">{post.author}</div>
          <div className="category-badge" style={{ background: post.category_color }}>
            {post.category}
          </div>
        </div>
        <Link className="btn ghost" to={`/blog/${post.slug}`}>
          Read story
        </Link>
      </div>
    </section>
  )
}

export default FeaturedPost
