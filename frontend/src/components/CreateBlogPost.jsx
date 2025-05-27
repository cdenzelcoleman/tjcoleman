import { useState } from 'react'
import './CreateBlogPost.css'

const CreateBlogPost = ({ onClose, onSubmit }) => {
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
    { value: 'substack', label: 'substack link' },
    { value: 'mixed', label: 'text with embedded video' }
  ]

  const categories = [
    'general', 'thoughts', 'innovation', 'inspiration', 'technology', 
    'environment', 'impact', 'reflection', 'observation'
  ]

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
      const response = await fetch('/api/blog-posts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const newPost = await response.json()
        onSubmit(newPost)
        onClose()
      } else {
        const errorData = await response.json()
        setError(errorData.detail || 'Failed to create blog post')
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
    const substackRegex = /^(https?:\/\/)?([a-zA-Z0-9_-]+\.)?substack\.com/
    return youtubeRegex.test(url) || instagramRegex.test(url) || substackRegex.test(url)
  }

  return (
    <div className="modal-overlay">
      <div className="create-blog-modal">
        <div className="modal-header">
          <h2>Create New Blog Post</h2>
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
            formData.content_type === 'substack' ||
            formData.content_type === 'mixed') && (
            <div className="form-group">
              <label>{formData.content_type === 'substack' ? 'Substack URL' : 'Video URL'}</label>
              <input
                type="url"
                name="video_url"
                value={formData.video_url}
                onChange={handleChange}
                placeholder={formData.content_type === 'substack' 
                  ? "https://yourname.substack.com/p/post-title" 
                  : "https://youtube.com/watch?v=... or https://instagram.com/p/..."}
              />
              {formData.video_url && !validateVideoUrl(formData.video_url) && (
                <small className="error-text">Please enter a valid {formData.content_type === 'substack' ? 'Substack' : 'YouTube or Instagram'} URL</small>
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
              Publish immediately
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
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateBlogPost