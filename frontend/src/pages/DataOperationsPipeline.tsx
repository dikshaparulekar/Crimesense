import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Database, Play, CheckCircle, Clock, Zap, ArrowRight, FileCode } from 'lucide-react';

export const DataOperationsPipeline: React.FC = () => {
  const [pipelineRun, setPipelineRun] = useState<any>(null);
  const [triggering, setTriggering] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchLatestRun();
  }, []);

  const fetchLatestRun = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/pipelines/latest');
      setPipelineRun(res.data);
    } catch (e) {
      console.error('Failed to load pipeline run:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerPipeline = async () => {
    setTriggering(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/pipelines/run');
      setPipelineRun(res.data.result);
    } catch (e) {
      console.error('Failed to run pipeline:', e);
    } finally {
      setTriggering(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading Big Data Pipeline Telemetry...
      </div>
    );
  }

  const execution = pipelineRun?.execution || {};
  const benchmark = pipelineRun?.benchmark || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner and Action */}
      <div className="cyber-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                Big Data Analytics Processing Pipeline
              </h2>
              <span className="cyber-badge badge-teal">STATUS: {execution?.status || 'COMPLETED'}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem', maxWidth: '850px' }}>
              Scalable distributed feature engineering: Schema Ingestion → Geospatial Boundary Filter → 
              Leak-Free Chronological Rolling Lag Computation (t-1 to t-7 / t-30) → Parquet Columnar Persistence.
            </p>
          </div>

          <button
            onClick={handleTriggerPipeline}
            disabled={triggering}
            className="cyber-btn cyber-btn-primary"
            style={{ padding: '0.65rem 1.25rem' }}
          >
            <Play size={15} />
            <span>{triggering ? 'Executing Pipeline...' : 'Run Pipeline Now'}</span>
          </button>
        </div>
      </div>

      {/* Execution Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem'
      }}>
        <div className="cyber-card" style={{ padding: '1.1rem' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Raw Events Ingested
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.4rem' }} className="mono-text">
            {execution?.raw_records_ingested?.toLocaleString() || 0}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Filter: Invalid coordinates: {execution?.invalid_geo_records_filtered || 0}
          </div>
        </div>

        <div className="cyber-card" style={{ padding: '1.1rem' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Feature Vectors Generated
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-teal)', marginTop: '0.4rem' }} className="mono-text">
            {execution?.aggregated_feature_records?.toLocaleString() || 0}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Jurisdiction-day training records
          </div>
        </div>

        <div className="cyber-card" style={{ padding: '1.1rem' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Engine Processing Time
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.4rem' }} className="mono-text">
            {execution?.processing_duration_seconds}s
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Engine: {execution?.engine}
          </div>
        </div>

        <div className="cyber-card" style={{ padding: '1.1rem' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Throughput Rate
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '0.4rem' }} className="mono-text">
            {benchmark?.single_node_speed_records_per_sec?.toLocaleString()} <span style={{ fontSize: '0.8rem' }}>rec/s</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Memory footprint: ~{benchmark?.memory_footprint_mb} MB
          </div>
        </div>
      </div>

      {/* Feature Engineering Pipeline Flow Stages */}
      <div className="cyber-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
          Distributed Pipeline Execution Architecture & Stage Artifacts
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div style={{ backgroundColor: '#0c1424', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.82rem' }}>
              <span className="mono-text">01</span>
              <span>Ingestion & Cleansing</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.4 }}>
              Ingests raw CSV/Parquet records, checks field non-null constraints, verifies Maharashtra bounding box coordinates (15°-23°N, 72°-81.5°E).
            </p>
          </div>

          <div style={{ backgroundColor: '#0c1424', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-teal)', fontWeight: 600, fontSize: '0.82rem' }}>
              <span className="mono-text">02</span>
              <span>Leak-Free Lag Features</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.4 }}>
              Computes past rolling 7-day and 30-day incident counts shifted strictly by 1 day (t-1). Guarantees zero look-ahead contamination.
            </p>
          </div>

          <div style={{ backgroundColor: '#0c1424', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-amber)', fontWeight: 600, fontSize: '0.82rem' }}>
              <span className="mono-text">03</span>
              <span>Columnar Persistence</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.4 }}>
              Outputs partitioned Parquet files optimized with Snappy compression for downstream Spark local workers and scikit-learn/XGBoost loaders.
            </p>
          </div>
        </div>

        {/* Technical Run Metadata */}
        <div style={{
          backgroundColor: '#070c14',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          padding: '1rem',
          marginTop: '1.25rem',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <div style={{ color: 'var(--accent-cyan)', marginBottom: '0.4rem' }}>
            # Execution Manifest ({pipelineRun?.run_id}):
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            Input File: {pipelineRun?.input_file}<br/>
            Engine: {execution?.engine}<br/>
            Engine Status: {execution?.status}<br/>
            Target Parquet: {execution?.station_features_file}<br/>
            Hotspots Parquet: {execution?.hotspot_features_file}
          </div>
        </div>
      </div>
    </div>
  );
};
