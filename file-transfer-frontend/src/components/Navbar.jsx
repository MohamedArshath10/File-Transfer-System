import { useAuth } from '../context/AuthContext';

export default function Navbar({ page, setPage }) {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="navbar-logo-icon">📁</div>
        <span>FileVault</span>
      </div>

      <div className="navbar-nav">
        <span
          className={`nav-link ${page === 'dashboard' ? 'active' : ''}`}
          onClick={() => setPage('dashboard')}
        >
          Dashboard
        </span>
        <span
          className={`nav-link ${page === 'links' ? 'active' : ''}`}
          onClick={() => setPage('links')}
        >
          My Links
        </span>
      </div>

      <div className="navbar-user">
        <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
        <button className="btn-logout" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}