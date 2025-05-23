import { useState } from 'react'
import { X, Send, User } from 'lucide-react'

const CommentsSection = ({ comments, onComment, onClose }) => {
  const [newComment, setNewComment] = useState('')
  const [username, setUsername] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      onComment(newComment.trim(), username.trim() || 'Anonymous')
      setNewComment('')
      setUsername('')
    }
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <div className="comments-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4>Comments ({comments.length})</h4>
        <button 
          onClick={onClose}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#fff', 
            cursor: 'pointer',
            padding: '0.25rem'
          }}
        >
          <X size={16} />
        </button>
      </div>

      <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem' }}>
        {comments.length === 0 ? (
          <p style={{ opacity: 0.6, textAlign: 'center', padding: '1rem' }}>
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="comment-author">@{comment.user.display_name}</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                    {formatTimeAgo(comment.created_at)}
                  </span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="comment-form">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <input
            type="text"
            placeholder="Your name (optional)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="comment-input"
            maxLength={50}
            style={{ fontSize: '0.8rem', padding: '0.4rem' }}
          />
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="comment-input"
            maxLength={1000}
          />
        </div>
        <button 
          type="submit" 
          className="comment-submit"
          disabled={!newComment.trim()}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}

export default CommentsSection