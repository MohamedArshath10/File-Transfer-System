import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Links from './pages/Links';
import SharePage from './pages/SharePage';
import Navbar from './components/Navbar';
import './styles/global.css';

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);
  return <div className={`toast ${type}`}>{message}</div>;
}

function AppContent() {
  const { user, loading } = useAuth();
  const [authPage, setAuthPage] = useState('login');
  const [page, setPage] = useState('dashboard');
  const [toast, setToast] = useState(null);

  const path = window.location.pathname;
  const shareMatch = path.match(/^\/share\/([a-zA-Z0-9_-]+)$/);

  const showToast = (message, type = 'success') => setToast({ message, type });

  if (loading) return (
    <div className="loading"><div className="spinner" />Loading...</div>
  );

  if (shareMatch) return (
    <>
      <SharePage token={shareMatch[1]} />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </>
  );

  if (!user) return (
    <>
      {authPage === 'login'
        ? <Login switchToRegister={() => setAuthPage('register')} />
        : <Register switchToLogin={() => setAuthPage('login')} />
      }
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </>
  );

  return (
    <>
      <Navbar page={page} setPage={setPage} />
      {page === 'dashboard' && <Dashboard onToast={showToast} />}
      {page === 'links' && <Links onToast={showToast} />}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}