import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './BlogPost.css'

const BlogPost = () => {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [comment, setComment] = useState({ name: '', email: '', content: '' })
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    fetchBlogPost()
  }, [id])

  const fetchBlogPost = async () => {
    try {
      const response = await fetch(`/api/blog-posts/${id}/`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
        // Increment views
        fetch(`/api/blog-posts/${id}/increment_views/`, { method: 'POST' })
      } else {
        setError('Blog post not found')
      }
    } catch (err) {
      setError('Failed to load blog post')
    } finally {
      setLoading(false)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    setSubmittingComment(true)

    try {
      const response = await fetch(`/api/blog-posts/${id}/add_comment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment)
      })

      if (response.ok) {
        setComment({ name: '', email: '', content: '' })
        alert('Comment submitted for approval!')
      } else {
        alert('Failed to submit comment')
      }
    } catch (err) {
      alert('Failed to submit comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="blog-loading">
        <div className="loading-spinner"></div>
        <p>Loading blog post...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="blog-error">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <article className="blog-post">
      <div className="blog-header">
        <div className="blog-meta">
          <span className="category">{post.category}</span>
          <span className="date">{formatDate(post.published_at || post.created_at)}</span>
          <span className="views">{post.views} views</span>
        </div>
        <h1 className="blog-title">{post.title}</h1>
        <div className="author-info">
          <span>By {post.author.username}</span>
        </div>
      </div>

      {post.embed_html && (
        <div 
          className="blog-video"
          dangerouslySetInnerHTML={{ __html: post.embed_html }}
        />
      )}

      <div className="blog-content">
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {post.tags && (
        <div className="blog-tags">
          <span className="tags-label">Tags:</span>
          {post.tags.split(',').map((tag, index) => (
            <span key={index} className="tag">
              {tag.trim()}
            </span>
          ))}
        </div>
      )}

      <div className="blog-comments">
        <h3>Comments ({post.comments_count})</h3>
        
        <div className="comments-list">
          {post.blog_comments && post.blog_comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <strong>{comment.name}</strong>
                <span className="comment-date">{formatDate(comment.created_at)}</span>
              </div>
              <p className="comment-content">{comment.content}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <h4>Leave a Comment</h4>
          <div className="form-row">
            <input
              type="text"
              placeholder="Your Name"
              value={comment.name}
              onChange={(e) => setComment(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={comment.email}
              onChange={(e) => setComment(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <textarea
            placeholder="Your comment"
            value={comment.content}
            onChange={(e) => setComment(prev => ({ ...prev, content: e.target.value }))}
            required
            rows="4"
          />
          <button type="submit" disabled={submittingComment}>
            {submittingComment ? 'Submitting...' : 'Submit Comment'}
          </button>
        </form>
      </div>
    </article>
  )
}

export default BlogPost