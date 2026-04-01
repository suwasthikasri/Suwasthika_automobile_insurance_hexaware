import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="navbar-logo-icon">🛡️</div>
        <div className="navbar-brand-text">
          <span className="navbar-brand-name">AutoShield</span>
          <span className="navbar-brand-sub">Insurance</span>
        </div>
      </Link>

      <div className="navbar-links">
        <Link to="/" className={isActive('/')}>Home</Link>

        {!user && (
          <>
            <Link to="/login" className={isActive('/login')}>Login</Link>
            <Link to="/register" className="nav-link nav-btn">Register</Link>
          </>
        )}

        {user?.role === 'USER' && (
          <>
            <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
            <Link to="/proposals/new" className={isActive('/proposals/new')}>New Proposal</Link>
            <Link to="/my-claims" className={isActive('/my-claims')}>Claims</Link>
          </>
        )}

        {user?.role === 'OFFICER' && (
          <>
            <Link to="/officer/dashboard" className={isActive('/officer/dashboard')}>Dashboard</Link>
            <Link to="/officer/proposals" className={isActive('/officer/proposals')}>Proposals</Link>
            <Link to="/officer/claims" className={isActive('/officer/claims')}>Claims</Link>
            <Link to="/officer/policies" className={isActive('/officer/policies')}>Policies</Link>
          </>
        )}

        {user && (
          <div className="nav-user-badge">
            <div className="nav-avatar">{user.email?.[0]?.toUpperCase()}</div>
            <button className="nav-logout" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
