import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Layers, Upload, FileText, CheckCircle2, AlertTriangle, Eye, Download } from 'lucide-react';

export const DatasetRegistry: React.FC = () => {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [selectedPreview, setSelectedPreview] = useState<any>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/datasets');
      setDatasets(res.data.datasets);
    } catch (e) {
      console.error('Failed to load datasets:', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (datasetId: string) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/datasets/${datasetId}/preview`);
      setSelectedPreview(res.data);
    } catch (e) {
      console.error('Preview error:', e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setUploadStatus('Uploading & Validating Schema...');
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/datasets/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadStatus(`Success! Ingested ${res.data.rows} rows from ${res.data.filename}. Status: ${res.data.validation.quality_check}`);
    } catch (err: any) {
      setUploadStatus(`Upload failed: ${err?.response?.data?.detail || err.message}`);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading Dataset Registry...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header & Ingestion Card */}
      <div className="cyber-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                Dataset Provenance Registry & Ingestion Interface
              </h2>
              <span className="cyber-badge badge-teal">PROVENANCE TRACKED</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem', maxWidth: '850px' }}>
              Verifiable public Indian datasets with strict provenance tags separating official National Crime Records Bureau (NCRB)
              records from simulated multi-year spatial benchmarks.
            </p>
          </div>

          <div>
            <label className="cyber-btn cyber-btn-primary" style={{ cursor: 'pointer' }}>
              <Upload size={15} />
              <span>Import CSV / Parquet</span>
              <input type="file" accept=".csv,.parquet" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {uploadStatus && (
          <div style={{
            marginTop: '1rem',
            padding: '0.65rem 1rem',
            backgroundColor: '#0c1424',
            border: '1px solid var(--accent-cyan)',
            borderRadius: '4px',
            fontSize: '0.78rem',
            color: '#f8fafc'
          }}>
            {uploadStatus}
          </div>
        )}
      </div>

      {/* Registry Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.25rem' }}>
        {datasets.map((ds) => (
          <div key={ds.id} className="cyber-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                <span className={`cyber-badge badge-${ds.is_synthetic ? 'amber' : 'cyan'}`}>
                  {ds.quality_status}
                </span>
                <span className="mono-text" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {ds.time_period}
                </span>
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
                {ds.name}
              </h3>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                <strong>Publisher:</strong> {ds.publisher}
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <strong>Granularity:</strong> {ds.granularity}
              </div>

              <p style={{ fontSize: '0.72rem', color: '#cbd5e1', lineHeight: 1.45, backgroundColor: '#0c1424', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <strong>Limitations:</strong> {ds.limitations}
              </p>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
              <span className="mono-text" style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                {ds.total_records.toLocaleString()} Records
              </span>

              <button
                onClick={() => handlePreview(ds.id)}
                className="cyber-btn"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                <Eye size={13} />
                <span>Preview Rows</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dataset Preview Inspector */}
      {selectedPreview && (
        <div className="cyber-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
              Raw Dataset Preview ({selectedPreview.dataset_id} • {selectedPreview.total_rows} total rows)
            </h3>
            <span className={`cyber-badge badge-${selectedPreview.is_synthetic ? 'amber' : 'cyan'}`}>
              {selectedPreview.is_synthetic ? 'SYNTHETIC BENCHMARK' : 'OFFICIAL NCRB'}
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  {selectedPreview.columns.map((col: string) => (
                    <th key={col} style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedPreview.rows.map((row: any, i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(30, 48, 86, 0.3)' }}>
                    {selectedPreview.columns.map((col: string) => (
                      <td key={col} style={{ padding: '0.5rem', whiteSpace: 'nowrap' }} className="mono-text">
                        {String(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
