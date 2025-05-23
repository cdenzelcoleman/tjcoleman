import { X, Facebook, Twitter, Instagram, Copy } from 'lucide-react'

const ShareModal = ({ video, onShare, onClose }) => {
  const shareOptions = [
    {
      platform: 'facebook',
      name: 'Facebook',
      icon: <Facebook size={20} />,
      color: '#1877f2'
    },
    {
      platform: 'twitter', 
      name: 'Twitter',
      icon: <Twitter size={20} />,
      color: '#1da1f2'
    },
    {
      platform: 'instagram',
      name: 'Instagram', 
      icon: <Instagram size={20} />,
      color: '#e4405f'
    },
    {
      platform: 'tiktok',
      name: 'TikTok',
      icon: '🎵',
      color: '#000'
    },
    {
      platform: 'copy_link',
      name: 'Copy Link',
      icon: <Copy size={20} />,
      color: '#6b7280'
    }
  ]

  const handleShare = (platform) => {
    onShare(platform)
    onClose()
  }

  return (
    <div className="share-modal" onClick={onClose}>
      <div className="share-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Share Video</h3>
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#fff', 
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            <X size={20} />
          </button>
        </div>
        
        <p style={{ marginBottom: '1rem', opacity: 0.8 }}>
          Share "{video.title}" with your friends
        </p>

        <div className="share-options">
          {shareOptions.map((option) => (
            <button
              key={option.platform}
              className="share-option"
              onClick={() => handleShare(option.platform)}
              style={{ borderColor: option.color }}
            >
              <span style={{ color: option.color }}>{option.icon}</span>
              <span>{option.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ShareModal