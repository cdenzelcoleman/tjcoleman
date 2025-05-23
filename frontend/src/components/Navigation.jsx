import { Link, useLocation } from 'react-router-dom'
import { LogOut, Settings } from 'lucide-react'

const Navigation = ({ isAdmin, adminUser, onAdminLogout }) => {
  const location = useLocation()

  return (
    <nav className="navigation">
      <div className="nav-content">
        <div className="logo">Claiming Ease</div>
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              The Ease
              
            </Link>
          </li>
          <li>
            <Link 
              to="/admin" 
              className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
            >
              <Settings size={16} style={{ marginRight: '0.5rem' }} />
              {isAdmin ? 'Admin Panel' : 'Admin Login'}
            </Link>
          </li>
          {isAdmin && (
            <li>
              <button 
                onClick={onAdminLogout}
                className="nav-link"
                style={{ 
                  background: 'none', 
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <LogOut size={16} />
                Logout ({adminUser?.username})
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navigation