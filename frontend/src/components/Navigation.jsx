import { Link, useLocation } from 'react-router-dom'

const Navigation = () => {
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
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
            >
              About Me
            </Link>
          </li>
          <li>
            <Link 
              to="/written" 
              className={`nav-link ${location.pathname === '/written' ? 'active' : ''}`}
            >
              The Claimed
            </Link>
          </li>
          <li>
            <Link 
              to="/video" 
              className={`nav-link ${location.pathname === '/video' ? 'active' : ''}`}
            >
              The Ease
            </Link>
          </li>
          <li>
            <Link 
              to="/events" 
              className={`nav-link ${location.pathname === '/events' ? 'active' : ''}`}
            >
              The Events
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation