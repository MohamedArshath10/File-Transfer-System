import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ page, setPage }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (p) => {
    setPage(p);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <div className="navbar-logo-icon">📁</div>
          <span>FileVault</span>
        </div>

        {/* Desktop Nav */}
        <div className="navbar-nav desktop-nav">
          <span
            className={`nav-link ${page === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNav('dashboard')}
          >
            Dashboard
          </span>
          <span
            className={`nav-link ${page === 'links' ? 'active' : ''}`}
            onClick={() => handleNav('links')}
          >
            My Links
          </span>
        </div>

        {/* Desktop User */}
        <div className="navbar-user desktop-nav">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>

        {/* Hamburger Button */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`bar ${menuOpen ? 'open' : ''}`} />
          <span className={`bar ${menuOpen ? 'open' : ''}`} />
          <span className={`bar ${menuOpen ? 'open' : ''}`} />
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-user">
            <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <span style={{ fontWeight: 600, color: 'var(--accent-dark)' }}>{user?.name}</span>
          </div>
          <span
            className={`mobile-nav-link ${page === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNav('dashboard')}
          >
            📊 Dashboard
          </span>
          <span
            className={`mobile-nav-link ${page === 'links' ? 'active' : ''}`}
            onClick={() => handleNav('links')}
          >
            🔗 My Links
          </span>
          <button className="mobile-logout" onClick={() => { logout(); setMenuOpen(false); }}>
            Logout
          </button>
        </div>
      )}
    </>
  );
}