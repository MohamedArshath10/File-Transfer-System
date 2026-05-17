import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import ShareModal from '../components/ShareModal';

const getFileIcon = (mimeType) => {
  if (mimeType?.startsWith('image/')) return { icon: '🖼️', cls: 'image' };
  if (mimeType === 'application/pdf') return { icon: '📄', cls: 'pdf' };
  if (mimeType?.startsWith('video/')) return { icon: '🎬', cls: 'video' };
  return { icon: '📁', cls: 'default' };
};

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', {
  day: 'numeric', month: 'short', year: 'numeric'
});

export default function Dashboard({ onToast }) {
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [shareFile, setShareFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [filesRes, statsRes] = await Promise.all([
        api.get('/files'),
        api.get('/analytics'),
      ]);
      setFiles(filesRes.data);
      setStats(statsRes.data);
    } catch {
      onToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsRes = await api.get('/analytics');
      setStats(statsRes.data);
    } catch {
      console.error('Failed to update stats silently');
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      await api.post('/files/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onToast('File uploaded!', 'success');
      fetchAll();
      fetchStats()
    } catch {
      onToast('Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await api.delete(`/files/${fileId}`);
      setFiles(files.filter(f => f.id !== fileId));
      onToast('File deleted', 'success');
      // FETCH FRESH STATS FOR THE DASHBOARD
      const statsRes = await api.get('/analytics');
      setStats(statsRes.data);
    } catch {
      onToast('Delete failed', 'error');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  if (loading) return (
    <div className="loading">
      <div className="spinner" />Loading...
    </div>
  );

  return (
    <div className="main-layout">

      {stats && (
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Total Files</div>
            <div className="stat-value accent">{stats.totalFiles}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Storage Used</div>
            <div className="stat-value success">{formatSize(stats.totalSize)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Links</div>
            <div className="stat-value warning">{stats.activeLinks}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Downloads</div>
            <div className="stat-value danger">{stats.totalDownloads}</div>
          </div>
        </div>
      )}

      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
        onClick={() => fileRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileRef}
          onChange={e => handleUpload(e.target.files[0])}
        />
        <div className="upload-icon">{uploading ? '⏳' : '☁️'}</div>
        <h3>{uploading ? 'Uploading...' : 'Drop files here or click to upload'}</h3>
        <p>Supports any file type • Files stored securely on FileVault</p>
      </div>

      <div className="section-header">
        <h2 className="section-title">Your Files</h2>
        <span style={{ color: 'var(--muted)', fontSize: '14px' }}>
          {files.length} file{files.length !== 1 ? 's' : ''}
        </span>
      </div>

      {files.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No files yet</h3>
          <p>Upload your first file to get started</p>
        </div>
      ) : (
        <div className="files-grid">
          {files.map(file => {
            const { icon, cls } = getFileIcon(file.mime_type);
            return (
              <div key={file.id} className="file-card">
                <div className={`file-icon ${cls}`}>{icon}</div>
                <div className="file-name">{file.original_name}</div>
                <div className="file-meta">
                  {formatSize(file.size)} • {formatDate(file.created_at)}
                </div>
                <div className="file-actions">
                  <button className="btn-share" onClick={() => setShareFile(file)}>
                    🔗 Share
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(file.id)}>
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {shareFile && (
        <ShareModal
          file={shareFile}
          onClose={() => setShareFile(null)}
          onToast={onToast}
          onLinkCreated={fetchStats}
        />
      )}
    </div>
  );
}