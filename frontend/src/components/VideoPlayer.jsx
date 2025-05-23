import { useState, useRef, useEffect } from 'react'
import { Heart, MessageCircle, Share2, Play, Pause, Bell } from 'lucide-react'
import ShareModal from './ShareModal'
import CommentsSection from './CommentsSection'
import SubscribeModal from './SubscribeModal'

const VideoPlayer = ({ video, onLike, onComment, onShare, onView }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showSubscribeModal, setShowSubscribeModal] = useState(false)
  const [hasViewed, setHasViewed] = useState(false)
  const videoRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Auto-play when video comes into view
            if (videoRef.current) {
              videoRef.current.play()
              setIsPlaying(true)
              
              // Increment view count only once
              if (!hasViewed) {
                onView()
                setHasViewed(true)
              }
            }
          } else {
            // Pause when video goes out of view
            if (videoRef.current) {
              videoRef.current.pause()
              setIsPlaying(false)
            }
          }
        })
      },
      { threshold: 0.7 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [onView, hasViewed])

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div className="video-container" ref={containerRef}>
      <div className="video-wrapper">
        <video
          ref={videoRef}
          className="video-player"
          src={`http://localhost:8000${video.video_file}`}
          loop
          muted
          playsInline
          onClick={togglePlayPause}
        />
        
        {!isPlaying && (
          <div 
            className="play-overlay"
            onClick={togglePlayPause}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '50%',
              padding: '1rem',
              cursor: 'pointer'
            }}
          >
            <Play size={32} color="white" />
          </div>
        )}

        <div className="video-overlay">
          <div className="video-info">
            <h3>{video.title}</h3>
            <p>{video.description}</p>
            <div className="video-stats">
              <span>{formatNumber(video.views)} views</span>
              <span>@{video.uploader.username}</span>
            </div>
          </div>
        </div>

        <div className="video-actions">
          <div className="action-group">
            <button
              className={`action-btn ${video.is_liked ? 'liked' : ''}`}
              onClick={onLike}
            >
              <Heart size={20} fill={video.is_liked ? '#fff' : 'none'} />
            </button>
            <div className="action-count">{formatNumber(video.likes_count)}</div>
          </div>

          <div className="action-group">
            <button
              className="action-btn"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle size={20} />
            </button>
            <div className="action-count">{formatNumber(video.comments_count)}</div>
          </div>

          <div className="action-group">
            <button
              className="action-btn"
              onClick={() => setShowShareModal(true)}
            >
              <Share2 size={20} />
            </button>
          </div>

          <div className="action-group">
            <button
              className="action-btn"
              onClick={() => setShowSubscribeModal(true)}
            >
              <Bell size={20} />
            </button>
          </div>
        </div>

        {showComments && (
          <CommentsSection
            comments={video.comments}
            onComment={onComment}
            onClose={() => setShowComments(false)}
          />
        )}
      </div>

      {showShareModal && (
        <ShareModal
          video={video}
          onShare={onShare}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showSubscribeModal && (
        <SubscribeModal
          onClose={() => setShowSubscribeModal(false)}
        />
      )}
    </div>
  )
}

export default VideoPlayer