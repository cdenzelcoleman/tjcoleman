import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, Users } from 'lucide-react'
import api from '../utils/api'
import UploadVideo from './UploadVideo'
import EditVideo from './EditVideo'

const AdminPanel = ({ adminUser }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [videos, setVideos] = useState([])
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0
  })
  const [loading, setLoading] = useState(true)
  const [editingVideo, setEditingVideo] = useState(null)

  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'videos') {
      fetchVideos()
    }
  }, [activeTab])

  const fetchVideos = async () => {
    try {
      const response = await api.get('/api/videos/')
      setVideos(response.data)
      
      // Calculate stats
      const totalViews = response.data.reduce((sum, video) => sum + video.views, 0)
      const totalLikes = response.data.reduce((sum, video) => sum + video.likes_count, 0)
      const totalComments = response.data.reduce((sum, video) => sum + video.comments_count, 0)
      
      setStats({
        totalVideos: response.data.length,
        totalViews,
        totalLikes,
        totalComments
      })
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return
    }

    try {
      await api.delete(`/api/videos/${videoId}/`)
      fetchVideos() // Refresh the list
    } catch (error) {
      console.error('Error deleting video:', error)
      alert('Failed to delete video')
    }
  }

  const StatCard = ({ icon, title, value, color }) => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '1.5rem',
      borderRadius: '12px',
      border: `1px solid ${color}20`,
      textAlign: 'center'
    }}>
      <div style={{ color, marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
        {value.toLocaleString()}
      </div>
      <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>{title}</div>
    </div>
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (editingVideo) {
    return (
      <EditVideo 
        video={editingVideo}
        onSave={() => {
          setEditingVideo(null)
          fetchVideos()
        }}
        onCancel={() => setEditingVideo(null)}
      />
    )
  }

  return (
    <div className="upload-container" style={{ maxWidth: '1200px' }}>
      <div className="upload-form">
        <div style={{ marginBottom: '2rem' }}>
          <h1>Admin Panel</h1>
          <p style={{ opacity: 0.7 }}>Welcome back, {adminUser?.username}!</p>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {[
            { id: 'overview', label: 'Overview', icon: <Eye size={16} /> },
            { id: 'upload', label: 'Upload Video', icon: <Plus size={16} /> },
            { id: 'videos', label: 'Manage Videos', icon: <Edit size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4)' : 'transparent',
                color: activeTab === tab.id ? '#000' : '#fff',
                border: 'none',
                padding: '0.75rem 1rem',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Analytics Overview</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <StatCard 
                icon={<Eye size={24} />}
                title="Total Videos"
                value={stats.totalVideos}
                color="#4ecdc4"
              />
              <StatCard 
                icon={<Users size={24} />}
                title="Total Views"
                value={stats.totalViews}
                color="#ff6b6b"
              />
              <StatCard 
                icon={<span style={{ fontSize: '24px' }}>❤️</span>}
                title="Total Likes"
                value={stats.totalLikes}
                color="#e74c3c"
              />
              <StatCard 
                icon={<span style={{ fontSize: '24px' }}>💬</span>}
                title="Total Comments"
                value={stats.totalComments}
                color="#f39c12"
              />
            </div>

            <h3 style={{ marginBottom: '1rem' }}>Recent Videos</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {videos.slice(0, 5).map((video) => (
                <div key={video.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  marginBottom: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px'
                }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{video.title}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                      {formatDate(video.created_at)} • {video.views} views • {video.likes_count} likes
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                    {video.video_type === 'short' ? 'Short' : 'Long'} Form
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <UploadVideo />
        )}

        {activeTab === 'videos' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Manage Videos</h2>
            {loading ? (
              <div className="loading">Loading videos...</div>
            ) : (
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {videos.map((video) => (
                  <div key={video.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    marginBottom: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                        {video.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.5rem' }}>
                        {video.description?.substring(0, 100)}...
                      </div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                        {formatDate(video.created_at)} • {video.views} views • {video.likes_count} likes • {video.comments_count} comments
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => setEditingVideo(video)}
                        style={{
                          background: '#4ecdc4',
                          border: 'none',
                          color: '#000',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteVideo(video.id)}
                        style={{
                          background: '#e74c3c',
                          border: 'none',
                          color: '#fff',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel