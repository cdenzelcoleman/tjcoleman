import { useState, useEffect } from 'react'

const VideoSection = () => {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    // This will be connected to backend API later
    // For now, using placeholder data
    setVideos([
      {
        id: 1,
        title: 'Sample Video 1',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        platform: 'youtube'
      }
    ])
  }, [])

  const getEmbedUrl = (url, platform) => {
    if (platform === 'youtube') {
      const videoId = url.includes('watch?v=') 
        ? url.split('watch?v=')[1]?.split('&')[0]
        : url.split('/').pop()
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`
    }
    
    if (platform === 'instagram') {
      const postId = url.split('/p/')[1]?.split('/')[0]
      return `https://www.instagram.com/p/${postId}/embed/`
    }
    
    if (platform === 'tiktok') {
      const videoId = url.split('/video/')[1]?.split('?')[0]
      return `https://www.tiktok.com/embed/v2/${videoId}`
    }
    
    return url
  }

  return (
    <div className="video-section">
      <div className="container">
        <h2>Featured Videos</h2>
        <div className="video-grid">
          {videos.map((video) => (
            <div key={video.id} className="video-card">
              <div className="video-wrapper">
                <iframe
                  src={getEmbedUrl(video.url, video.platform)}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
              <h3>{video.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VideoSection