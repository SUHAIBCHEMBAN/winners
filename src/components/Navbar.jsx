import { Link, useLocation } from 'react-router-dom';
import { Trophy, LogOut, Home, Shield } from 'lucide-react';
import useStore from '../store/useStore';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useStore();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <Trophy className="brand-icon" />
            <span className="brand-text">FestResults</span>
          </Link>
          
          {/* Links hidden as per request - access admin via /admin URL */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
