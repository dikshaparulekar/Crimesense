import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen, ShieldCheck, Database, Cpu, AlertTriangle, Layers } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  const [methodology, setMethodology] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchMethodology();
  }, []);

  const fetchMethodology = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/methodology');
      setMethodology(res.data);
    } catch (e) {
      console.error('Failed to load methodology:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div className="cyber-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
            Academic Methodology, Scalable Architecture & Limiting Scope
          </h2>
          <span className="cyber-badge badge-teal">PEER REVIEW READY</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem', maxWidth: '850px' }}>
          Comprehensive documentation of mathematical formulations, temporal leakage safeguards, distributed Big Data engine design,
          and strict ethical guardrails tailored for Scalable Machine Learning & Big Data Analytics coursework.
        </p>
      </div>

      {/* Grid of Architectural Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        <div className="cyber-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '0.6rem' }}>
            <Database size={18} />
            <span>Big Data Distributed Processing Engine</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '0.8rem' }}>
            Implemented with dual-engine capability: Apache Spark (PySpark 3.5.9) with distributed partition management
            and a high-throughput columnar PyArrow/Pandas engine capable of 70,000+ records/sec on single-node environments.
          </p>
          <ul style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <li>Partitioned Parquet storage with snappy compression</li>
            <li>Chronological out-of-time sliding window aggregations</li>
            <li>Multi-scale grouping: State → Metropolitan Region → Police Station</li>
          </ul>
        </div>

        <div className="cyber-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-teal)', fontWeight: 700, marginBottom: '0.6rem' }}>
            <Cpu size={18} />
            <span>Temporal Leakage Safeguard Protocol</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '0.8rem' }}>
            A common failure in academic ML is random k-fold cross validation on time-series records, which leaks future information.
            CrimeSense strictly mandates:
          </p>
          <ul style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <li>1-day lag shift on all rolling features (t-1 to t-7 and t-1 to t-30)</li>
            <li>Expanding station baseline rate computed strictly prior to date t</li>
            <li>Chronological 70% Train, 15% Validation, 15% Test split</li>
          </ul>
        </div>

        <div className="cyber-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-amber)', fontWeight: 700, marginBottom: '0.6rem' }}>
            <Layers size={18} />
            <span>Indian Data Provenance Policy</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '0.8rem' }}>
            Maintains rigorous transparency regarding Indian crime statistics:
          </p>
          <ul style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <li>
              <strong style={{ color: 'var(--accent-cyan)' }}>Official NCRB Compendiums:</strong> Annual aggregates for Maharashtra, Mumbai, Pune, Nagpur (2018–2022).
            </li>
            <li>
              <strong style={{ color: 'var(--accent-amber)' }}>Synthetic Spatio-Temporal Benchmark:</strong> Explicitly labeled simulation (15,000 events) for ML pipelines.
            </li>
            <li>No fabricated police station coordinates or synthetic data merged without explicit disclosure.</li>
          </ul>
        </div>

        <div className="cyber-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-red)', fontWeight: 700, marginBottom: '0.6rem' }}>
            <AlertTriangle size={18} />
            <span>Ethical Safeguards & Prohibited Uses</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '0.8rem' }}>
            In accordance with responsible AI standards and human rights principles:
          </p>
          <ul style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <li>Zero individual profiling: No suspect lists, individual threat scores, or biometric targeting</li>
            <li>No demographic discrimination: Caste, religion, and socio-economic identity are excluded from features</li>
            <li>Capacity planning only: Purely intended for macro administrative workload balancing</li>
          </ul>
        </div>
      </div>

      {/* Persistent Disclaimer Full Text */}
      <div className="cyber-card" style={{ padding: '1.25rem', backgroundColor: '#0c1424', borderLeft: '3px solid var(--accent-amber)' }}>
        <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
          Academic Decision-Support Prototype Notice
        </h3>
        <p style={{ fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.5 }}>
          CrimeSense is an academic decision-support prototype. Predictions are estimates based on available data, 
          not confirmed future incidents. Data coverage, reporting differences and model uncertainty affect results. 
          The platform must not be used to target individuals or communities.
        </p>
      </div>
    </div>
  );
};
