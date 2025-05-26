import { useState, useEffect } from 'react'
import './CreateBlogPost.css'

const EditBlogPost = ({ post, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    content_type: 'text',
    video_url: '',
    category: 'general',
    tags: '',
    is_published: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const contentTypes = [
    { value: 'text', label: 'written piece' },
    { value: 'youtube', label: 'with youtube video' },
    { value: 'instagram', label: 'with instagram video' },
    { value: 'mixed', label: 'text with embedded video' }
  ]

  const categories = [
    'general', 'thoughts', 'innovation', 'inspiration', 'technology', 
    'environment', 'impact', 'reflection', 'observation'
  ]

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        content_type: post.content_type || 'text',
        video_url: post.video_url || '',
        category: post.category || 'general',
        tags: post.tags || '',
        is_published: post.is_published || false
      })
    }
  }, [post])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/blog-posts/${post.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updatedPost = await response.json()
        onSubmit(updatedPost)
        onClose()
      } else {
        const errorData = await response.json()
        setError(errorData.detail || 'Failed to update blog post')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const validateVideoUrl = (url) => {
    if (!url) return true
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/
    const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/(p|reel)\//
    return youtubeRegex.test(url) || instagramRegex.test(url)
  }

  return (
    <div className="modal-overlay">
      <div className="create-blog-modal">
        <div className="modal-header">
          <h2>Edit Blog Post</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="blog-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter blog post title"
            />
          </div>

          <div className="form-group">
            <label>Content Type</label>
            <select
              name="content_type"
              value={formData.content_type}
              onChange={handleChange}
            >
              {contentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {(formData.content_type === 'youtube' || 
            formData.content_type === 'instagram' || 
            formData.content_type === 'mixed') && (
            <div className="form-group">
              <label>Video URL</label>
              <input
                type="url"
                name="video_url"
                value={formData.video_url}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=... or https://instagram.com/p/..."
              />
              {formData.video_url && !validateVideoUrl(formData.video_url) && (
                <small className="error-text">Please enter a valid YouTube or Instagram URL</small>
              )}
            </div>
          )}

          <div className="form-group">
            <label>Content *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="10"
              placeholder="Write your blog post content here..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="innovation, sustainability, future (comma-separated)"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_published"
                checked={formData.is_published}
                onChange={handleChange}
              />
              Published
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading || !formData.title || !formData.content}
            >
              {loading ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditBlogPost