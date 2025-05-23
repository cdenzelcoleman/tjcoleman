import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import VideoPlayer from './VideoPlayer'

const VideoFeed = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const feedRef = useRef(null)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/videos/feed/')
      setVideos(response.data)
    } catch (err) {
      setError('Failed to load videos')
      console.error('Error fetching videos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (videoId) => {
    try {
      await axios.post(`http://localhost:8000/api/videos/${videoId}/like/`)
      // Refresh videos to get updated like count
      fetchVideos()
    } catch (err) {
      console.error('Error liking video:', err)
    }
  }

  const handleComment = async (videoId, text) => {
    try {
      await axios.post(`http://localhost:8000/api/videos/${videoId}/comment/`, {
        text
      })
      // Refresh videos to get updated comments
      fetchVideos()
    } catch (err) {
      console.error('Error commenting on video:', err)
    }
  }

  const handleShare = async (videoId, platform) => {
    try {
      await axios.post(`http://localhost:8000/api/videos/${videoId}/share/`, {
        platform
      })
      
      // Generate share URLs based on platform
      const baseUrl = window.location.origin
      const videoUrl = `${baseUrl}/video/${videoId}`
      
      switch (platform) {
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`)
          break
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(videoUrl)}`)
          break
        case 'copy_link':
          navigator.clipboard.writeText(videoUrl)
          alert('Link copied to clipboard!')
          break
        default:
          alert(`Share to ${platform} - functionality coming soon!`)
      }
    } catch (err) {
      console.error('Error sharing video:', err)
    }
  }

  const incrementViews = async (videoId) => {
    try {
      await axios.post(`http://localhost:8000/api/videos/${videoId}/increment_views/`)
    } catch (err) {
      console.error('Error incrementing views:', err)
    }
  }

  if (loading) {
    return <div className="loading">Loading videos...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (videos.length === 0) {
    return (
      <div className="error">
        No videos available. <br />
        <Link to="/upload">Upload the first video!</Link>
      </div>
    )
  }

  return (
    <div className="video-feed" ref={feedRef}>
      {videos.map((video) => (
        <VideoPlayer
          key={video.id}
          video={video}
          onLike={() => handleLike(video.id)}
          onComment={(text) => handleComment(video.id, text)}
          onShare={(platform) => handleShare(video.id, platform)}
          onView={() => incrementViews(video.id)}
        />
      ))}
    </div>
  )
}

export default VideoFeed