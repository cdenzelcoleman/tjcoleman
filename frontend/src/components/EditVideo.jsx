import { useState } from 'react'
import api from '../utils/api'
import { Save, X } from 'lucide-react'

const EditVideo = ({ video, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: video.title,
    description: video.description,
    video_type: video.video_type,
    is_public: video.is_public
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      await api.patch(`/api/videos/${video.id}/`, formData)
      onSave()
    } catch (err) {
      setError('Failed to update video. Please try again.')
      console.error('Update error:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="upload-container">
      <div className="upload-form">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem' 
        }}>
          <h2>Edit Video</h2>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#fff',
              padding: '0.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {/* Video Preview */}
        <div className="form-group">
          <label>Current Video</label>
          <video
            src={`http://localhost:8000${video.video_file}`}
            controls
            style={{
              width: '100%',
              maxHeight: '300px',
              borderRadius: '8px',
              background: '#000'
            }}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter video title"
              maxLength={255}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter video description"
              rows={4}
              maxLength={1000}
            />
          </div>

          <div className="form-group">
            <label htmlFor="video_type">Video Type</label>
            <select
              id="video_type"
              name="video_type"
              value={formData.video_type}
              onChange={handleInputChange}
            >
              <option value="short">Short Form (&lt; 60 seconds)</option>
              <option value="long">Long Form (&gt; 60 seconds)</option>
            </select>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                name="is_public"
                checked={formData.is_public}
                onChange={handleInputChange}
                style={{ margin: 0 }}
              />
              Make video public
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={saving}
              style={{ flex: 1 }}
            >
              <Save size={16} style={{ marginRight: '0.5rem' }} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            
            <button 
              type="button"
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '1rem',
                background: 'transparent',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditVideo