import { Link } from 'react-router-dom'
import { getImageUrl } from '../utils/image'

const PostCard = ({post}) => {
  return (
    <article className="post-card">
      <Link className="post-link" to={`/blog/${post.slug}`}>
        <div className="post-video-wrap video-corners">
          <img src={getImageUrl(post.image)} alt={post.title} />
          <div className="post-overlay"></div>
          <div className="plus-ctr">
            <div className="plus-circle">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <span></span>
        </div>
        <div className="post-card-body">
          <div className="post-card-title">
            <h3 className="post-title">{post.title}</h3>
            <div className="category-badge" style={{ background: post.category_color }}>
              {post.category}
            </div>
          </div>
          <p className="post-excerpt">{post.excerpt}</p>
        </div>
      </Link>
    </article>
  )
}

export default PostCard
