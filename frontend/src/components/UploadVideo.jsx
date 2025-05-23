import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Upload, Film, Check } from 'lucide-react'

const UploadVideo = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_type: 'short',
    video_file: null
  })
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file')
        return
      }

      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB')
        return
      }

      setFormData(prev => ({
        ...prev,
        video_file: file
      }))
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.video_file) {
      setError('Please select a video file')
      return
    }

    if (!formData.title.trim()) {
      setError('Please enter a title')
      return
    }

    setUploading(true)
    setError('')

    try {
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('video_type', formData.video_type)
      submitData.append('video_file', formData.video_file)

      const response = await axios.post('http://localhost:8000/api/videos/', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setUploadSuccess(true)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        video_type: 'short',
        video_file: null
      })
      setPreviewUrl('')

      // Redirect to feed after 2 seconds
      setTimeout(() => {
        navigate('/')
      }, 2000)

    } catch (err) {
      setError('Failed to upload video. Please try again.')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  if (uploadSuccess) {
    return (
      <div className="upload-container">
        <div className="upload-form" style={{ textAlign: 'center' }}>
          <Check size={64} color="#4ecdc4" style={{ marginBottom: '1rem' }} />
          <h2>Video Uploaded Successfully!</h2>
          <p style={{ opacity: 0.8, marginTop: '1rem' }}>
            Redirecting to feed...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="upload-container">
      <div className="upload-form">
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <Film size={32} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
          Upload Video
        </h2>

        {error && (
          <div className="error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="video_file">Video File *</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="video_file"
                name="video_file"
                accept="video/*"
                onChange={handleFileChange}
                className="file-input"
                required
              />
              <label htmlFor="video_file" className="file-input-label">
                <Upload size={24} style={{ marginBottom: '0.5rem' }} />
                <div>
                  {formData.video_file ? formData.video_file.name : 'Click to select video file'}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.5rem' }}>
                  Max size: 50MB. Supported formats: MP4, MOV, AVI, WebM
                </div>
              </label>
            </div>
          </div>

          {previewUrl && (
            <div className="form-group">
              <label>Preview</label>
              <video
                src={previewUrl}
                controls
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  borderRadius: '8px',
                  background: '#000'
                }}
              />
            </div>
          )}

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
              placeholder="Enter video description (optional)"
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

          <button 
            type="submit" 
            className="submit-btn"
            disabled={uploading || !formData.video_file}
          >
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', opacity: 0.6, fontSize: '0.9rem' }}>
          <p>
            📱 You can upload from your phone or computer<br />
            🚀 Videos will be available for sharing to social media platforms
          </p>
        </div>
      </div>
    </div>
  )
}

export default UploadVideo