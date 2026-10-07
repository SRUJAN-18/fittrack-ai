import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  TrendingUp, 
  Bot, 
  User, 
  LogOut, 
  Menu, 
  X,
  Sparkles,
  Dumbbell
} from 'lucide-react';

export default function Navbar() {
  const { user, profile, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'Workouts', path: '/workouts', icon: Dumbbell },
    { name: 'Weight Tracking', path: '/weight-tracking', icon: TrendingUp },
    { name: 'AI Coach', path: '/ai-chat', icon: Bot, isSpecial: true },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-root">
      <div className="nav-container">
        {/* Brand */}
        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="brand-logo">
          <div className="logo-icon-wrapper">
            <Activity className="logo-icon" size={24} />
          </div>
          <div className="brand-text-wrapper">
            <div className="brand-text">
              <span>Fit Tracker</span>
              <span className="brand-ai">AI</span>
            </div>
            <span className="brand-author-tag">by Srujan</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        {isAuthenticated && (
          <nav className="desktop-nav">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${active ? 'nav-link-active' : ''} ${link.isSpecial ? 'nav-link-ai' : ''}`}
                >
                  <Icon size={18} className={link.isSpecial ? 'ai-icon-pulse' : ''} />
                  <span>{link.name}</span>
                  {link.isSpecial && (
                    <span className="ai-chip">
                      <Sparkles size={10} />
                      Gemini
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Action / User Profile */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <div className="user-nav-block">
              <Link to="/profile" className="user-profile-badge">
                <div className="user-avatar">
                  {(profile?.name || user?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="user-info-text">
                  <span className="user-name">{profile?.name || user?.name}</span>
                  <span className="user-status">{profile?.fitnessGoal || 'Active'}</span>
                </div>
              </Link>
              <button 
                onClick={handleLogout} 
                className="btn-logout" 
                title="Logout from FitTrack"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="auth-nav-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          {isAuthenticated && (
            <button 
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isAuthenticated && mobileMenuOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`mobile-link ${active ? 'mobile-link-active' : ''}`}
              >
                <Icon size={20} />
                <span>{link.name}</span>
                {link.isSpecial && <span className="ai-chip">AI Powered</span>}
              </Link>
            );
          })}
          <div className="mobile-menu-divider" />
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            className="mobile-link text-danger"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      <style>{`
        .navbar-root {
          background: rgba(9, 13, 22, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-subtle);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.9rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
        }

        .logo-icon-wrapper {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2));
          border: 1px solid var(--border-active);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-light);
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
        }

        .brand-text-wrapper {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .brand-text {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .brand-ai {
          background: linear-gradient(135deg, #34d399 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 0.85em;
        }

        .brand-author-tag {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-top: 2px;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (max-width: 840px) {
          .desktop-nav {
            display: none;
          }
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 0.95rem;
          border-radius: var(--radius-md);
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.925rem;
          font-weight: 500;
          transition: var(--transition);
        }

        .nav-link:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.05);
        }

        .nav-link-active {
          color: #ffffff;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.25);
          font-weight: 600;
        }

        .nav-link-ai.nav-link-active {
          background: rgba(6, 182, 212, 0.12);
          border-color: rgba(6, 182, 212, 0.3);
        }

        .ai-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.68rem;
          padding: 0.15rem 0.45rem;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(16, 185, 129, 0.25));
          border: 1px solid rgba(6, 182, 212, 0.4);
          border-radius: var(--radius-full);
          color: #22d3ee;
          font-weight: 700;
          text-transform: uppercase;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-nav-block {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-profile-badge {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.35rem 0.75rem 0.35rem 0.35rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          text-decoration: none;
          transition: var(--transition);
        }

        .user-profile-badge:hover {
          background: rgba(255, 255, 255, 0.09);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary-gradient);
          color: #042f1a;
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-info-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
          text-align: left;
        }

        .user-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .user-status {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .btn-logout {
          background: transparent;
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-logout:hover {
          color: #fb7185;
          border-color: rgba(244, 63, 94, 0.3);
          background: rgba(244, 63, 94, 0.1);
        }

        .mobile-toggle {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-main);
          cursor: pointer;
          padding: 0.25rem;
        }

        @media (max-width: 840px) {
          .mobile-toggle {
            display: block;
          }
          .user-info-text {
            display: none;
          }
        }

        .mobile-menu {
          background: #111827;
          border-bottom: 1px solid var(--border-subtle);
          padding: 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          color: var(--text-main);
          text-decoration: none;
          font-weight: 500;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        .mobile-link-active {
          background: rgba(16, 185, 129, 0.15);
          color: var(--primary-light);
        }

        .mobile-menu-divider {
          height: 1px;
          background: var(--border-subtle);
          margin: 0.25rem 0;
        }

        .text-danger {
          color: #fb7185;
        }
      `}</style>
    </header>
  );
}
