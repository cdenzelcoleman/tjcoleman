import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const WrittenSection = () => {
  const [posts, setPosts] = useState([])
  const [quoteOfTheDay, setQuoteOfTheDay] = useState('')

  useEffect(() => {
    // This will be connected to backend API later
    setPosts([])
    setQuoteOfTheDay("Success is not final, failure is not fatal: it is the courage to continue that counts.")
  }, [])

  return (
    <div className="written-section">
      <div className="container">
        <div className="quote-of-day">
          <h2>Quote of the Day</h2>
          <blockquote>"{quoteOfTheDay}"</blockquote>
        </div>
        
        <div className="blog-posts">
          <h2>Latest Writings</h2>
          {posts.length === 0 ? (
            <p>No posts available yet.</p>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <article key={post.id} className="post-card">
                  <h3>
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p>{post.excerpt}</p>
                  <time>{new Date(post.created_at).toLocaleDateString()}</time>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WrittenSection