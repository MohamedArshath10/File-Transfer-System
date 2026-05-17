import { useState } from 'react';
import api from '../api/axios';

export default function ShareModal({ file, onClose, onToast, onLinkCreated }) {
  const [password, setPassword] = useState('');
  const [expiresIn, setExpiresIn] = useState('24');
  const [maxDownloads, setMaxDownloads] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await api.post('/share', {
        fileId: file.id,
        password: password || undefined,
        expiresIn: expiresIn ? parseInt(expiresIn) : undefined,
        maxDownloads: maxDownloads ? parseInt(maxDownloads) : undefined,
      });
      const link = `${window.location.origin}/share/${res.data.token}`;
      setGeneratedLink(link);
      onToast('Link created!', 'success');
      onLinkCreated()
    } catch {
      onToast('Failed to create link', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    onToast('Link copied!', 'success');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Share File</h3>
        <p>Create a secure link for: <strong>{file.original_name}</strong></p>

        <div className="form-group">
          <label>Password (optional)</label>
          <input
            type="password"
            placeholder="Leave empty for no password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Expires In</label>
          <select
            className="select-input"
            value={expiresIn}
            onChange={e => setExpiresIn(e.target.value)}
          >
            <option value="1">1 Hour</option>
            <option value="24">24 Hours</option>
            <option value="168">7 Days</option>
            <option value="720">30 Days</option>
            <option value="">Never</option>
          </select>
        </div>

        <div className="form-group">
          <label>Max Downloads (optional)</label>
          <input
            type="number"
            placeholder="Unlimited"
            value={maxDownloads}
            onChange={e => setMaxDownloads(e.target.value)}
            min="1"
          />
        </div>

        {generatedLink && (
          <div className="link-box">
            <span>{generatedLink}</span>
            <button className="btn-copy" onClick={copyLink}>Copy</button>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Close</button>
          {!generatedLink && (
            <button
              className="btn-primary"
              style={{ flex: 1 }}
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Generate Link'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}