import { useState, useEffect } from 'react';
import api from '../api/axios';

const formatSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function SharePage({ token }) {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => { fetchInfo(); }, []);

  const fetchInfo = async () => {
    try {
      const res = await api.get(`/share/${token}`);
      setInfo(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Link not found or expired');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    setError('');
    try {
      const res = await api.post(`/share/${token}/download`, {
        password: password || undefined,
      });

      // Force download instead of opening in browser
      const url = res.data.downloadUrl;
      const fileName = res.data.fileName;

      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);

      setInfo(prev => ({ ...prev, downloadCount: (prev.downloadCount || 0) + 1 }));
    } catch (err) {
      setError(err.response?.data?.message || 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return (
    <div className="share-page">
      <div className="loading"><div className="spinner" />Loading...</div>
    </div>
  );

  if (error && !info) return (
    <div className="share-page">
      <div className="share-card">
        <div className="share-file-icon">❌</div>
        <h2>Link Unavailable</h2>
        <p className="share-meta">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="share-page">
      <div className="share-card">
        <div className="share-file-icon">📁</div>
        <h2>{info.fileName}</h2>
        <p className="share-meta">{formatSize(info.fileSize)} • {info.mimeType}</p>

        <div className="share-info-row">
          <div className="share-info-item">
            <div className="label">Downloads</div>
            <div className="value">
              {info.downloadCount || 0}
              {info.maxDownloads ? `/${info.maxDownloads}` : ''}
            </div>
          </div>
          {info.expiresAt && (
            <div className="share-info-item">
              <div className="label">Expires</div>
              <div className="value" style={{ fontSize: '13px' }}>
                {new Date(info.expiresAt).toLocaleDateString('en-IN')}
              </div>
            </div>
          )}
          <div className="share-info-item">
            <div className="label">Protected</div>
            <div className="value">{info.hasPassword ? '🔒 Yes' : '🔓 No'}</div>
          </div>
        </div>

        {info.hasPassword && (
          <div className="form-group" style={{ textAlign: 'left', marginBottom: '20px' }}>
            <label>Password Required</label>
            <input
              type="password"
              placeholder="Enter password to download"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleDownload()}
            />
          </div>
        )}

        {error && (
          <div className="error-msg" style={{ marginBottom: '16px' }}>{error}</div>
        )}

        <button className="btn-download" onClick={handleDownload} disabled={downloading}>
          {downloading ? '⏳ Downloading...' : '⬇️ Download File'}
        </button>

        <p style={{ marginTop: '20px', fontSize: '12px', color: 'var(--muted)' }}>
          Shared via FileVault • Secure file sharing
        </p>
      </div>
    </div>
  );
}