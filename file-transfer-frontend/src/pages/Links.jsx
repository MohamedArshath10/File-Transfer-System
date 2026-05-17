import { useState, useEffect } from 'react';
import api from '../api/axios';

const formatDate = (date) => {
  if (!date) return 'Never';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const isExpired = (expiresAt) => expiresAt && new Date() > new Date(expiresAt);

export default function Links({ onToast }) {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchLinks(); }, []);

  const fetchLinks = async () => {
    try {
      const res = await api.get('/share/my-links');
      setLinks(res.data);
    } catch {
      onToast('Failed to load links', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deactivate = async (id) => {
    try {
      await api.delete(`/share/${id}`);
      setLinks(links.map(l => l.id === id ? { ...l, is_active: false } : l));
      onToast('Link deactivated', 'success');
    } catch {
      onToast('Failed to deactivate', 'error');
    }
  };

  const copyLink = (token) => {
    navigator.clipboard.writeText(`${window.location.origin}/share/${token}`);
    onToast('Link copied!', 'success');
  };

  if (loading) return (
    <div className="loading">
      <div className="spinner" />Loading...
    </div>
  );

  return (
    <div className="main-layout">
      <div className="section-header">
        <h2 className="section-title">My Share Links</h2>
        <span style={{ color: 'var(--muted)', fontSize: '14px' }}>
          {links.filter(l => l.is_active).length} active
        </span>
      </div>

      {links.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔗</div>
          <h3>No links yet</h3>
          <p>Share a file from your dashboard to create a link</p>
        </div>
      ) : (
        <div className="links-table">
          <table>
            <thead>
              <tr>
                <th>File</th>
                <th>Status</th>
                <th>Downloads</th>
                <th>Expires</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map(link => {
                const expired = isExpired(link.expires_at);
                const limitReached = link.max_downloads && link.download_count >= link.max_downloads;
                const inactive = !link.is_active || expired || limitReached;

                return (
                  <tr key={link.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>
                        {link.file?.original_name}
                      </div>
                      <div style={{ color: 'var(--muted)', fontSize: '11px', marginTop: 2 }}>
                        /{link.token}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${inactive ? 'inactive' : 'active'}`}>
                        {expired ? 'Expired' : limitReached ? 'Limit Reached' : link.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {link.download_count}
                      {link.max_downloads && (
                        <span style={{ color: 'var(--muted)', fontSize: '12px' }}>
                          /{link.max_downloads}
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: '13px', color: expired ? 'var(--danger)' : 'inherit' }}>
                      {formatDate(link.expires_at)}
                    </td>
                    <td>
                      {link.password ? (
                        <span style={{ color: 'var(--warning)', fontSize: '13px' }}>🔒 Yes</span>
                      ) : (
                        <span style={{ color: 'var(--muted)', fontSize: '13px' }}>None</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {!inactive && (
                          <button
                            className="btn-copy"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => copyLink(link.token)}
                          >
                            Copy
                          </button>
                        )}
                        {link.is_active && !expired && (
                          <button className="btn-deactivate" onClick={() => deactivate(link.id)}>
                            Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}