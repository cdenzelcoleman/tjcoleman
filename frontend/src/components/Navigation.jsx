import { Link, useLocation } from 'react-router-dom'

const Navigation = () => {
  const location = useLocation()

  return (
    <nav className="navigation">
      <div className="nav-content">
        <div className="logo">VideoHub</div>
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Feed
            </Link>
          </li>
          <li>
            <Link 
              to="/upload" 
              className={`nav-link ${location.pathname === '/upload' ? 'active' : ''}`}
            >
              Upload
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation