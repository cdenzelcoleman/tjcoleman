import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, Users, FileText, Mail, Link, Quote, Image, Palette, UserPlus, Key } from 'lucide-react'
import api from '../utils/api'
import UploadVideo from './UploadVideo'
import EditVideo from './EditVideo'
import CreateBlogPost from './CreateBlogPost'
import EditBlogPost from './EditBlogPost'

const AdminPanel = ({ adminUser }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [videos, setVideos] = useState([])
  const [blogPosts, setBlogPosts] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalBlogPosts: 0,
    totalSubscribers: 0
  })
  const [loading, setLoading] = useState(true)
  const [editingVideo, setEditingVideo] = useState(null)
  const [showCreateBlog, setShowCreateBlog] = useState(false)
  const [linkedVideos, setLinkedVideos] = useState([])
  const [quotes, setQuotes] = useState([])
  const [quoteOfTheDay, setQuoteOfTheDay] = useState('')
  const [newQuote, setNewQuote] = useState('')
  const [editingQuote, setEditingQuote] = useState(null)
  const [newVideoLink, setNewVideoLink] = useState({
    title: '',
    url: '',
    platform: 'youtube'
  })
  const [backgroundSettings, setBackgroundSettings] = useState({
    color: '#fefcf7',
    image: ''
  })
  const [adminUsers, setAdminUsers] = useState([])
  const [editingBlogPost, setEditingBlogPost] = useState(null)
  const [newAdminUser, setNewAdminUser] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)

  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'videos') {
      fetchVideos()
    }
    if (activeTab === 'overview' || activeTab === 'blog-posts') {
      fetchBlogPosts()
    }
    if (activeTab === 'overview' || activeTab === 'subscribers') {
      fetchSubscribers()
    }
    if (activeTab === 'admin-users') {
      fetchAdminUsers()
    }
    if (activeTab === 'quotes') {
      fetchQuotes()
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
      
      setStats(prev => ({
        ...prev,
        totalVideos: response.data.length,
        totalViews,
        totalLikes,
        totalComments
      }))
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBlogPosts = async () => {
    try {
      const response = await api.get('/api/blog-posts/')
      setBlogPosts(response.data)
      setStats(prev => ({
        ...prev,
        totalBlogPosts: response.data.length
      }))
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    }
  }

  const fetchSubscribers = async () => {
    try {
      // This would need to be implemented in the backend
      setStats(prev => ({
        ...prev,
        totalSubscribers: 0 // Placeholder
      }))
    } catch (error) {
      console.error('Error fetching subscribers:', error)
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

  const deleteBlogPost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return
    }

    try {
      await api.delete(`/api/blog-posts/${postId}/`)
      fetchBlogPosts() // Refresh the list
    } catch (error) {
      console.error('Error deleting blog post:', error)
      alert('Failed to delete blog post')
    }
  }

  const handleBlogPostCreated = (newPost) => {
    fetchBlogPosts()
    setShowCreateBlog(false)
  }

  const addLinkedVideo = async () => {
    if (!newVideoLink.title || !newVideoLink.url) return
    
    try {
      // This would be an API call to save linked video
      setLinkedVideos([...linkedVideos, { ...newVideoLink, id: Date.now() }])
      setNewVideoLink({ title: '', url: '', platform: 'youtube' })
    } catch (error) {
      console.error('Error adding linked video:', error)
    }
  }

  const fetchQuotes = async () => {
    try {
      // const response = await api.get('/api/quotes/')
      // setQuotes(response.data)
      // Mock data for now
      setQuotes([
        { id: 1, content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", is_active: true, created_at: new Date().toISOString() },
        { id: 2, content: "The only way to do great work is to love what you do.", author: "Steve Jobs", is_active: false, created_at: new Date().toISOString() }
      ])
      const activeQuote = quotes.find(q => q.is_active)
      if (activeQuote) {
        setQuoteOfTheDay(activeQuote.content)
      }
    } catch (error) {
      console.error('Error fetching quotes:', error)
    }
  }

  const createQuote = async () => {
    if (!newQuote.trim()) return
    
    try {
      const newQuoteObj = {
        id: Date.now(),
        content: newQuote,
        author: '',
        is_active: false,
        created_at: new Date().toISOString()
      }
      setQuotes([...quotes, newQuoteObj])
      setNewQuote('')
      alert('Quote created successfully!')
    } catch (error) {
      console.error('Error creating quote:', error)
    }
  }

  const updateQuote = async (updatedQuote) => {
    try {
      setQuotes(quotes.map(quote => quote.id === updatedQuote.id ? updatedQuote : quote))
      setEditingQuote(null)
      alert('Quote updated successfully!')
    } catch (error) {
      console.error('Error updating quote:', error)
    }
  }

  const deleteQuote = async (quoteId) => {
    if (!window.confirm('Are you sure you want to delete this quote?')) {
      return
    }

    try {
      setQuotes(quotes.filter(quote => quote.id !== quoteId))
      alert('Quote deleted successfully!')
    } catch (error) {
      console.error('Error deleting quote:', error)
    }
  }

  const setAsQuoteOfTheDay = async (quote) => {
    try {
      setQuotes(quotes.map(q => ({ ...q, is_active: q.id === quote.id })))
      setQuoteOfTheDay(quote.content)
      alert('Quote of the day updated!')
    } catch (error) {
      console.error('Error setting quote of the day:', error)
    }
  }

  const updateBackground = async () => {
    try {
      // This would update CSS variables or background settings
      document.documentElement.style.setProperty('--cream', backgroundSettings.color)
      if (backgroundSettings.image) {
        document.body.style.backgroundImage = `url(${backgroundSettings.image})`
        document.body.style.backgroundSize = 'cover'
        document.body.style.backgroundAttachment = 'fixed'
      }
      alert('Background updated!')
    } catch (error) {
      console.error('Error updating background:', error)
    }
  }

  const removeLinkedVideo = (id) => {
    setLinkedVideos(linkedVideos.filter(video => video.id !== id))
  }

  const createAdminUser = async () => {
    if (!newAdminUser.username || !newAdminUser.password || newAdminUser.password !== newAdminUser.confirmPassword) {
      alert('Please fill all fields and ensure passwords match')
      return
    }

    try {
      const response = await api.post('/api/admin/users/', {
        username: newAdminUser.username,
        email: newAdminUser.email,
        password: newAdminUser.password
      })
      setAdminUsers([...adminUsers, response.data])
      setNewAdminUser({ username: '', email: '', password: '', confirmPassword: '' })
      setShowCreateAdmin(false)
      alert('Admin user created successfully!')
    } catch (error) {
      console.error('Error creating admin user:', error)
      alert('Failed to create admin user')
    }
  }

  const updateAdminUser = async () => {
    if (!editingAdmin.username) {
      alert('Username is required')
      return
    }

    try {
      const updateData = {
        username: editingAdmin.username,
        email: editingAdmin.email
      }
      if (editingAdmin.password) {
        updateData.password = editingAdmin.password
      }

      const response = await api.put(`/api/admin/users/${editingAdmin.id}/`, updateData)
      setAdminUsers(adminUsers.map(user => user.id === editingAdmin.id ? response.data : user))
      setEditingAdmin(null)
      alert('Admin user updated successfully!')
    } catch (error) {
      console.error('Error updating admin user:', error)
      alert('Failed to update admin user')
    }
  }

  const deleteAdminUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this admin user?')) {
      return
    }

    try {
      await api.delete(`/api/admin/users/${userId}/`)
      setAdminUsers(adminUsers.filter(user => user.id !== userId))
      alert('Admin user deleted successfully!')
    } catch (error) {
      console.error('Error deleting admin user:', error)
      alert('Failed to delete admin user')
    }
  }

  const fetchAdminUsers = async () => {
    try {
      const response = await api.get('/api/admin/users/')
      setAdminUsers(response.data)
    } catch (error) {
      console.error('Error fetching admin users:', error)
    }
  }

  const editBlogPost = (post) => {
    setEditingBlogPost(post)
  }

  const updateBlogPost = async (updatedPost) => {
    try {
      setBlogPosts(blogPosts.map(post => post.id === updatedPost.id ? updatedPost : post))
      fetchBlogPosts() // Refresh the list
    } catch (error) {
      console.error('Error updating blog post:', error)
      alert('Failed to update blog post')
    }
  }

  const editLinkedVideo = (video) => {
    setNewVideoLink(video)
  }

  const updateLinkedVideo = async () => {
    try {
      setLinkedVideos(linkedVideos.map(video => 
        video.id === newVideoLink.id ? newVideoLink : video
      ))
      setNewVideoLink({ title: '', url: '', platform: 'youtube' })
      alert('Linked video updated successfully!')
    } catch (error) {
      console.error('Error updating linked video:', error)
    }
  }

  const StatCard = ({ icon, title, value, color }) => (
    <div style={{
      background: '#f8f9fa',
      padding: '1.5rem',
      borderRadius: '12px',
      border: `2px solid ${color}40`,
      textAlign: 'center',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    }}>
      <div style={{ color, marginBottom: '0.5rem', fontSize: '1.5rem' }}>{icon}</div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem', color: '#2c3e50' }}>
        {value.toLocaleString()}
      </div>
      <div style={{ color: '#6c757d', fontSize: '0.9rem', fontWeight: '500' }}>{title}</div>
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
    <div style={{ maxWidth: '100%', color: '#333' }}>
      <div style={{ background: 'white', borderRadius: '12px' }}>
        <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid #f8f9fa' }}>
          <h1 style={{ color: '#2c3e50', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Admin Panel</h1>
          <p style={{ color: '#6c757d', fontSize: '1rem' }}>Welcome back, {adminUser?.username}!</p>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '2rem',
          borderBottom: '2px solid #f8f9fa',
          paddingBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'overview', label: 'Overview', icon: <Eye size={16} /> },
            { id: 'upload', label: 'Upload Video', icon: <Plus size={16} /> },
            { id: 'videos', label: 'Manage Videos', icon: <Edit size={16} /> },
            { id: 'linked-videos', label: 'Link Videos', icon: <Link size={16} /> },
            { id: 'quotes', label: 'Daily Quotes', icon: <Quote size={16} /> },
            { id: 'blog-posts', label: 'Blog Posts', icon: <FileText size={16} /> },
            { id: 'admin-users', label: 'Admin Users', icon: <UserPlus size={16} /> },
            { id: 'appearance', label: 'Appearance', icon: <Palette size={16} /> },
            { id: 'subscribers', label: 'Subscribers', icon: <Mail size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? '#007bff' : '#f8f9fa',
                color: activeTab === tab.id ? 'white' : '#495057',
                border: activeTab === tab.id ? '1px solid #007bff' : '1px solid #dee2e6',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
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
            <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50', fontSize: '1.4rem' }}>Analytics Overview</h2>
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
              <StatCard 
                icon={<FileText size={24} />}
                title="Blog Posts"
                value={stats.totalBlogPosts}
                color="#9b59b6"
              />
              <StatCard 
                icon={<Mail size={24} />}
                title="Subscribers"
                value={stats.totalSubscribers}
                color="#16a085"
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

        {activeTab === 'blog-posts' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>Blog Posts</h2>
              <button
                onClick={() => setShowCreateBlog(true)}
                style={{
                  background: 'var(--orange)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: '600'
                }}
              >
                <Plus size={16} />
                Create Blog Post
              </button>
            </div>
            
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {blogPosts.map((post) => (
                <div key={post.id} style={{
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
                      {post.title}
                      {!post.is_published && (
                        <span style={{ 
                          background: '#f39c12', 
                          color: 'white', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '12px', 
                          fontSize: '0.7rem', 
                          marginLeft: '0.5rem' 
                        }}>DRAFT</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.5rem' }}>
                      {post.content_type} • {post.category}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                      {formatDate(post.created_at)} • {post.views} views • {post.comments_count} comments
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => editBlogPost(post)}
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
                      onClick={() => deleteBlogPost(post.id)}
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
          </div>
        )}

        {activeTab === 'linked-videos' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Link External Videos</h2>
            
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              marginBottom: '2rem' 
            }}>
              <h3 style={{ marginBottom: '1rem' }}>Add New Video Link</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Video Title"
                  value={newVideoLink.title}
                  onChange={(e) => setNewVideoLink({...newVideoLink, title: e.target.value})}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                />
                <select
                  value={newVideoLink.platform}
                  onChange={(e) => setNewVideoLink({...newVideoLink, platform: e.target.value})}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                >
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>
              <input
                type="url"
                placeholder="Video URL"
                value={newVideoLink.url}
                onChange={(e) => setNewVideoLink({...newVideoLink, url: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  marginBottom: '1rem'
                }}
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={newVideoLink.id ? updateLinkedVideo : addLinkedVideo}
                  style={{
                    background: '#4ecdc4',
                    color: '#000',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  {newVideoLink.id ? 'Update Video Link' : 'Add Video Link'}
                </button>
                {newVideoLink.id && (
                  <button
                    onClick={() => setNewVideoLink({ title: '', url: '', platform: 'youtube' })}
                    style={{
                      background: '#6c757d',
                      color: '#fff',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: '1rem' }}>Linked Videos</h3>
              {linkedVideos.length === 0 ? (
                <p style={{ opacity: 0.7 }}>No linked videos yet.</p>
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {linkedVideos.map((video) => (
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
                          {video.platform.toUpperCase()} • {video.url}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => editLinkedVideo(video)}
                          style={{
                            background: '#4ecdc4',
                            border: 'none',
                            color: '#000',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => removeLinkedVideo(video.id)}
                          style={{
                            background: '#e74c3c',
                            border: 'none',
                            color: '#fff',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            cursor: 'pointer'
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
          </div>
        )}

        {activeTab === 'quotes' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50', fontSize: '1.4rem' }}>Daily Quotes & Motivation</h2>
            
            <div style={{ 
              background: '#f8f9fa', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              marginBottom: '2rem',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Current Quote of the Day</h3>
              {quoteOfTheDay ? (
                <blockquote style={{ 
                  fontStyle: 'italic', 
                  fontSize: '1.2rem', 
                  color: '#495057', 
                  marginBottom: '1rem',
                  padding: '1rem',
                  background: 'white',
                  borderLeft: '4px solid #28a745',
                  borderRadius: '4px'
                }}>
                  "{quoteOfTheDay}"
                </blockquote>
              ) : (
                <p style={{ color: '#6c757d' }}>No quote set yet.</p>
              )}
            </div>

            <div style={{ 
              background: '#f8f9fa', 
              padding: '1.5rem', 
              borderRadius: '8px',
              marginBottom: '2rem',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Create New Quote</h3>
              <textarea
                placeholder="Enter new motivational quote..."
                value={newQuote}
                onChange={(e) => setNewQuote(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  background: 'white',
                  color: '#495057',
                  marginBottom: '1rem',
                  resize: 'vertical',
                  fontSize: '1rem'
                }}
              />
              <button
                onClick={createQuote}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Create Quote
              </button>
            </div>

            <div>
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>All Quotes</h3>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {quotes.map((quote) => (
                  <div key={quote.id} style={{
                    background: '#f8f9fa',
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #dee2e6'
                  }}>
                    <div style={{ 
                      fontStyle: 'italic', 
                      marginBottom: '0.5rem', 
                      color: '#2c3e50',
                      fontSize: '1rem'
                    }}>
                      "{quote.content}"
                    </div>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#6c757d', 
                      marginBottom: '1rem'
                    }}>
                      {quote.author && `- ${quote.author}`} • {formatDate(quote.created_at)}
                      {quote.is_active && (
                        <span style={{ 
                          background: '#28a745', 
                          color: 'white', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '12px', 
                          fontSize: '0.7rem', 
                          marginLeft: '0.5rem' 
                        }}>ACTIVE</span>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setEditingQuote(quote)}
                        style={{
                          background: '#007bff',
                          border: 'none',
                          color: '#fff',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      
                      {!quote.is_active && (
                        <button
                          onClick={() => setAsQuoteOfTheDay(quote)}
                          style={{
                            background: '#28a745',
                            border: 'none',
                            color: '#fff',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}
                        >
                          Set as Quote of Day
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteQuote(quote.id)}
                        style={{
                          background: '#dc3545',
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
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Appearance Settings</h2>
            
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              marginBottom: '2rem' 
            }}>
              <h3 style={{ marginBottom: '1rem' }}>Background Settings</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Background Color</label>
                <input
                  type="color"
                  value={backgroundSettings.color}
                  onChange={(e) => setBackgroundSettings({...backgroundSettings, color: e.target.value})}
                  style={{
                    width: '100px',
                    height: '40px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Background Image URL (optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={backgroundSettings.image}
                  onChange={(e) => setBackgroundSettings({...backgroundSettings, image: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                />
              </div>

              <button
                onClick={updateBackground}
                style={{
                  background: '#9b59b6',
                  color: '#fff',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Apply Changes
              </button>
            </div>

            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              padding: '1.5rem', 
              borderRadius: '8px' 
            }}>
              <h3 style={{ marginBottom: '1rem' }}>Image Upload</h3>
              <p style={{ opacity: 0.7, marginBottom: '1rem' }}>
                Upload images for blog posts, backgrounds, or other content.
              </p>
              <input
                type="file"
                accept="image/*"
                style={{
                  padding: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  width: '100%'
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'admin-users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ color: '#2c3e50', fontSize: '1.4rem' }}>Admin Users</h2>
              <button
                onClick={() => setShowCreateAdmin(true)}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: '600'
                }}
              >
                <UserPlus size={16} />
                Create Admin User
              </button>
            </div>
            
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {adminUsers.map((user) => (
                <div key={user.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  marginBottom: '1rem',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#2c3e50' }}>
                      {user.username}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                      {user.email}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                      Created: {formatDate(user.date_joined)} • Last login: {user.last_login ? formatDate(user.last_login) : 'Never'}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setEditingAdmin(user)}
                      style={{
                        background: '#007bff',
                        border: 'none',
                        color: '#fff',
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
                      onClick={() => deleteAdminUser(user.id)}
                      style={{
                        background: '#dc3545',
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
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50', fontSize: '1.4rem' }}>Email Subscribers</h2>
            <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.7 }}>
              <Mail size={48} style={{ marginBottom: '1rem' }} />
              <p>Subscriber management coming soon...</p>
            </div>
          </div>
        )}
      </div>
      
      {showCreateBlog && (
        <CreateBlogPost
          onClose={() => setShowCreateBlog(false)}
          onSubmit={handleBlogPostCreated}
        />
      )}

      {editingBlogPost && (
        <EditBlogPost
          post={editingBlogPost}
          onClose={() => setEditingBlogPost(null)}
          onSubmit={updateBlogPost}
        />
      )}

      {showCreateAdmin && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>Create Admin User</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#495057' }}>Username</label>
              <input
                type="text"
                value={newAdminUser.username}
                onChange={(e) => setNewAdminUser({...newAdminUser, username: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#495057' }}>Email</label>
              <input
                type="email"
                value={newAdminUser.email}
                onChange={(e) => setNewAdminUser({...newAdminUser, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#495057' }}>Password</label>
              <input
                type="password"
                value={newAdminUser.password}
                onChange={(e) => setNewAdminUser({...newAdminUser, password: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#495057' }}>Confirm Password</label>
              <input
                type="password"
                value={newAdminUser.confirmPassword}
                onChange={(e) => setNewAdminUser({...newAdminUser, confirmPassword: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={createAdminUser}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  flex: 1
                }}
              >
                Create User
              </button>
              <button
                onClick={() => setShowCreateAdmin(false)}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  flex: 1
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {editingAdmin && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>Edit Admin User</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#495057' }}>Username</label>
              <input
                type="text"
                value={editingAdmin.username}
                onChange={(e) => setEditingAdmin({...editingAdmin, username: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#495057' }}>Email</label>
              <input
                type="email"
                value={editingAdmin.email}
                onChange={(e) => setEditingAdmin({...editingAdmin, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#495057' }}>New Password (leave blank to keep current)</label>
              <input
                type="password"
                value={editingAdmin.password || ''}
                onChange={(e) => setEditingAdmin({...editingAdmin, password: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={updateAdminUser}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  flex: 1
                }}
              >
                Update User
              </button>
              <button
                onClick={() => setEditingAdmin(null)}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  flex: 1
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {editingQuote && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>Edit Quote</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#495057' }}>Quote Content</label>
              <textarea
                value={editingQuote.content}
                onChange={(e) => setEditingQuote({...editingQuote, content: e.target.value})}
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#495057' }}>Author (optional)</label>
              <input
                type="text"
                value={editingQuote.author || ''}
                onChange={(e) => setEditingQuote({...editingQuote, author: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => updateQuote(editingQuote)}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  flex: 1
                }}
              >
                Update Quote
              </button>
              <button
                onClick={() => setEditingQuote(null)}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  flex: 1
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel