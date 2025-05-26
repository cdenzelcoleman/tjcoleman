import { useState } from 'react'
import { Settings, LogOut } from 'lucide-react'
import AdminLogin from './AdminLogin'
import AdminPanel from './AdminPanel'

const Footer = ({ isAdmin, adminUser, onAdminLogin, onAdminLogout }) => {
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <h3>Minimal Stories</h3>
            <p>© 2024 Minimal Stories. All rights reserved.</p>
          </div>
          
          <div className="admin-section">
            {isAdmin ? (
              <div className="admin-controls">
                <button 
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className="admin-btn"
                >
                  <Settings size={16} />
                  Admin Panel
                </button>
                <button onClick={onAdminLogout} className="logout-btn">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className="admin-btn"
              >
                <Settings size={16} />
                Admin Login
              </button>
            )}
          </div>
        </div>
        
        {showAdminPanel && (
          <div className="admin-panel-modal">
            <div className="modal-backdrop" onClick={() => setShowAdminPanel(false)} />
            <div className="modal-content">
              <button 
                className="close-btn"
                onClick={() => setShowAdminPanel(false)}
              >
                ×
              </button>
              {isAdmin ? (
                <AdminPanel adminUser={adminUser} />
              ) : (
                <AdminLogin onLogin={onAdminLogin} />
              )}
            </div>
          </div>
        )}
      </div>
    </footer>
  )
}

export default Footer