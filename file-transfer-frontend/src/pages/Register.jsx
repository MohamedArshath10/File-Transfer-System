import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Register({ switchToLogin }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !password) return setError('All fields required');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      switchToLogin();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">📁</div>
          <span>FileVault</span>
        </div>

        <h2>Create account</h2>
        <p>Start sharing files securely</p>

        {error && <div className="error-msg">{error}</div>}

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Mohamed Arshath"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Min. 6 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <div className="auth-switch">
          Already have an account?{' '}
          <a onClick={switchToLogin}>Sign in</a>
        </div>
      </div>
    </div>
  );
}