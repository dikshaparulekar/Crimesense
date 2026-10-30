import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';
import { Cpu, CheckCircle2, Sliders, BarChart2, Layers, ShieldCheck, RefreshCw } from 'lucide-react';

export const MLLaboratory: React.FC = () => {
  const [modelReport, setModelReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/models');
      setModelReport(res.data);
    } catch (e) {
      console.error('Failed to load ML report:', e);
    } finally {
      setLoading(false);
    }
  };

  // Feature Importance Horizontal Bar Chart
  const getFeatureImportanceChart = () => {
    if (!modelReport || !modelReport.feature_importance) return {};

    const features = Object.keys(modelReport.feature_importance).reverse();
    const scores = Object.values(modelReport.feature_importance).reverse().map((v: any) => Math.round(v * 1000) / 1000);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#111d35',
        borderColor: '#1e3056',
        textStyle: { color: '#f8fafc' },
        formatter: '{b}: Importance Weight {c}'
      },
      grid: { left: '3%', right: '5%', bottom: '5%', top: '5%', containLabel: true },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(30, 48, 86, 0.4)' } },
        axisLabel: { color: '#64748b' }
      },
      yAxis: {
        type: 'category',
        data: features,
        axisLine: { lineStyle: { color: '#1e3056' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 }
      },
      series: [
        {
          name: 'Feature Weight',
          type: 'bar',
          data: scores,
          itemStyle: {
            color: '#00f0ff',
            borderRadius: [0, 4, 4, 0]
          }
        }
      ]
    };
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading Machine Learning Model Registry & Evaluation Reports...
      </div>
    );
  }

  const models = modelReport?.models_evaluated || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Info */}
      <div className="cyber-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                Machine Learning Evaluation & Calibration Laboratory
              </h2>
              <span className="cyber-badge badge-teal">CHAMPION: {modelReport?.champion_model}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem', maxWidth: '850px' }}>
              Reproducible evaluation suite using strict chronological temporal partitioning (Train: {modelReport?.train_period} • Test: {modelReport?.test_period}).
              Zero target leakage validated across feature engineering windows.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className="cyber-badge badge-cyan">Temporal Validation</span>
            <span className="cyber-badge badge-amber">Synthetic Benchmark</span>
          </div>
        </div>
      </div>

      {/* Model Benchmark Comparison Matrix */}
      <div className="cyber-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu size={16} color="var(--accent-cyan)" />
          <span>Multi-Model Benchmark Performance Matrix (Out-of-Time Test Set)</span>
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.7rem' }}>Model Name</th>
                <th style={{ padding: '0.7rem' }}>Algorithm Family</th>
                <th style={{ padding: '0.7rem' }}>ROC-AUC</th>
                <th style={{ padding: '0.7rem' }}>PR-AUC</th>
                <th style={{ padding: '0.7rem' }}>F1-Score</th>
                <th style={{ padding: '0.7rem' }}>Recall</th>
                <th style={{ padding: '0.7rem' }}>Precision</th>
                <th style={{ padding: '0.7rem' }}>Brier Score</th>
                <th style={{ padding: '0.7rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(models).map(([name, data]: [string, any]) => {
                const isChampion = name === modelReport?.champion_model;
                return (
                  <tr 
                    key={name}
                    style={{
                      borderBottom: '1px solid rgba(30, 48, 86, 0.3)',
                      backgroundColor: isChampion ? 'rgba(0, 240, 255, 0.05)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '0.7rem', fontWeight: 700, color: isChampion ? 'var(--accent-cyan)' : '#f8fafc' }}>
                      {name.replace('_', ' ')}
                    </td>
                    <td style={{ padding: '0.7rem', color: 'var(--text-secondary)' }}>{data.model_type}</td>
                    <td style={{ padding: '0.7rem', fontWeight: 700 }} className="mono-text">{data.roc_auc}</td>
                    <td style={{ padding: '0.7rem' }} className="mono-text">{data.pr_auc}</td>
                    <td style={{ padding: '0.7rem', color: isChampion ? 'var(--accent-teal)' : '#f8fafc', fontWeight: 600 }} className="mono-text">{data.f1}</td>
                    <td style={{ padding: '0.7rem' }} className="mono-text">{data.recall}</td>
                    <td style={{ padding: '0.7rem' }} className="mono-text">{data.precision}</td>
                    <td style={{ padding: '0.7rem' }} className="mono-text">{data.brier_score}</td>
                    <td style={{ padding: '0.7rem' }}>
                      {isChampion ? (
                        <span className="cyber-badge badge-teal">Champion</span>
                      ) : (
                        <span className="cyber-badge badge-cyan">Evaluated</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Importance + Clustering Summary Split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.25rem' }}>
        {/* Feature Importance Attribution */}
        <div className="cyber-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                XGBoost Feature Importance Attribution
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Relative information gain ranking across tree splits
              </p>
            </div>
            <span className="cyber-badge badge-cyan">MODEL EXPLAINABILITY</span>
          </div>
          <div style={{ height: '280px' }}>
            <ReactECharts option={getFeatureImportanceChart()} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Spatial K-Means Hotspot Clustering */}
        <div className="cyber-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                Unsupervised Spatial K-Means Clusters
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                4 distinct operational patrol profiles derived from geographic coordinates and incident density
              </p>
            </div>
            <span className="cyber-badge badge-teal">K=4 CLUSTERS</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.entries(modelReport?.clustering_summary?.cluster_labels || {}).map(([cid, label]: [string, any]) => {
              const count = modelReport?.clustering_summary?.cluster_distribution?.[cid] || 0;
              return (
                <div 
                  key={cid}
                  style={{
                    backgroundColor: '#0c1424',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#f8fafc' }}>
                      Cluster {cid}: {label}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Patrol classification based on spatial centroid & density
                    </div>
                  </div>
                  <div className="cyber-badge badge-cyan">
                    {count} Police Stations
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
