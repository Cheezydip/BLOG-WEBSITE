import React from 'react'
import PostCard from './PostCard'

const PostGrid = ({posts=[]}) => {
  return (
    <section className="posts-grid">
      {posts.map(p=> (
        <PostCard key={p._id || p.id || p.slug} post={p} />
      ))}
    </section>
  )
}

export default PostGrid
