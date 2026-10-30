import React, { useState } from 'react';
import axios from 'axios';
import { Shield, AlertTriangle, CheckCircle, HelpCircle, Sliders, ArrowRight } from 'lucide-react';

export const AreaRiskInference: React.FC<{ selectedCity: string }> = ({ selectedCity }) => {
  const [stationName, setStationName] = useState('Andheri Police Station');
  const [rolling7d, setRolling7d] = useState<number>(14);
  const [rolling30d, setRolling30d] = useState<number>(48);
  const [baselineRate, setBaselineRate] = useState<number>(1.8);
  const [commercialDensity, setCommercialDensity] = useState<number>(0.92);
  const [transitProximity, setTransitProximity] = useState<number>(0.35);
  const [isWeekend, setIsWeekend] = useState<number>(1);
  const [isMonsoon, setIsMonsoon] = useState<number>(0);

  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInference = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/models/predict', {
        police_station: stationName,
        rolling_7d_past_count: parseFloat(String(rolling7d)),
        rolling_30d_past_count: parseFloat(String(rolling30d)),
        station_baseline_rate: parseFloat(String(baselineRate)),
        commercial_density: parseFloat(String(commercialDensity)),
        transit_proximity_km: parseFloat(String(transitProximity)),
        is_weekend: isWeekend,
        is_monsoon: isMonsoon
      });
      setPrediction(res.data);
    } catch (e) {
      console.error('Inference error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header and Methodology Explanation */}
      <div className="cyber-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                Area-Level Risk Inference & Explainability
              </h2>
              <span className="cyber-badge badge-amber">SYNTHETIC DEMO ESTIMATION</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem', maxWidth: '850px' }}>
              Estimates the probability of an elevated activity day (daily crime count ≥ 2) for a given police station jurisdiction,
              leveraging cost-sensitive gradient boosted decision trees (XGBoost) evaluated with temporal validation.
            </p>
          </div>
          <div className="cyber-badge badge-teal">MODEL: XGBOOST v1.0</div>
        </div>
      </div>

      {/* Main Form + Prediction Result Split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {/* Interactive Feature Inputs */}
        <div className="cyber-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={16} color="var(--accent-cyan)" />
            <span>Jurisdiction Environmental & Historical Inputs</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                Police Station Jurisdiction
              </label>
              <select
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#0c1424',
                  border: '1px solid var(--border-color)',
                  color: '#f8fafc',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.85rem'
                }}
              >
                <option value="Andheri Police Station">Andheri Police Station (Mumbai Suburban)</option>
                <option value="Bandra Police Station">Bandra Police Station (Mumbai Suburban)</option>
                <option value="Colaba Police Station">Colaba Police Station (Mumbai City)</option>
                <option value="Shivajinagar Police Station">Shivajinagar Police Station (Pune)</option>
                <option value="Hinjewadi Police Station">Hinjewadi Police Station (Pune)</option>
                <option value="Sitabuldi Police Station">Sitabuldi Police Station (Nagpur)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
                  Rolling 7D Past Incidents
                </label>
                <input
                  type="number"
                  value={rolling7d}
                  onChange={(e) => setRolling7d(parseFloat(e.target.value))}
                  style={{ width: '100%', backgroundColor: '#0c1424', border: '1px solid var(--border-color)', color: '#f8fafc', padding: '0.45rem', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
                  Rolling 30D Past Incidents
                </label>
                <input
                  type="number"
                  value={rolling30d}
                  onChange={(e) => setRolling30d(parseFloat(e.target.value))}
                  style={{ width: '100%', backgroundColor: '#0c1424', border: '1px solid var(--border-color)', color: '#f8fafc', padding: '0.45rem', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
                  Station Historical Baseline
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={baselineRate}
                  onChange={(e) => setBaselineRate(parseFloat(e.target.value))}
                  style={{ width: '100%', backgroundColor: '#0c1424', border: '1px solid var(--border-color)', color: '#f8fafc', padding: '0.45rem', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
                  Commercial Density (0-1)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={commercialDensity}
                  onChange={(e) => setCommercialDensity(parseFloat(e.target.value))}
                  style={{ width: '100%', backgroundColor: '#0c1424', border: '1px solid var(--border-color)', color: '#f8fafc', padding: '0.45rem', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
                  Transit Proximity (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={transitProximity}
                  onChange={(e) => setTransitProximity(parseFloat(e.target.value))}
                  style={{ width: '100%', backgroundColor: '#0c1424', border: '1px solid var(--border-color)', color: '#f8fafc', padding: '0.45rem', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
                  Temporal Seasonality
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsWeekend(isWeekend === 1 ? 0 : 1)}
                    className="cyber-btn"
                    style={{
                      flex: 1,
                      fontSize: '0.7rem',
                      padding: '0.35rem',
                      backgroundColor: isWeekend ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                      borderColor: isWeekend ? 'var(--accent-cyan)' : 'var(--border-color)'
                    }}
                  >
                    {isWeekend ? 'Weekend' : 'Weekday'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMonsoon(isMonsoon === 1 ? 0 : 1)}
                    className="cyber-btn"
                    style={{
                      flex: 1,
                      fontSize: '0.7rem',
                      padding: '0.35rem',
                      backgroundColor: isMonsoon ? 'rgba(0, 229, 163, 0.15)' : 'transparent',
                      borderColor: isMonsoon ? 'var(--accent-teal)' : 'var(--border-color)'
                    }}
                  >
                    {isMonsoon ? 'Monsoon' : 'Dry'}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleInference}
              disabled={loading}
              className="cyber-btn cyber-btn-primary"
              style={{ marginTop: '0.5rem', padding: '0.7rem' }}
            >
              <span>{loading ? 'Evaluating Model Inferences...' : 'Execute ML Risk Inference'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Prediction Output & Explainability */}
        <div className="cyber-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                Statistical Inference & Explainability
              </h3>
              {prediction && (
                <span className={`cyber-badge badge-${prediction.risk_badge}`}>
                  {prediction.risk_level} RISK
                </span>
              )}
            </div>

            {prediction ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  backgroundColor: '#0c1424',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '1.2rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    ESTIMATED PROBABILITY OF ELEVATED INCIDENT DAY
                  </div>
                  <div style={{
                    fontSize: '3rem',
                    fontWeight: 900,
                    marginTop: '0.3rem',
                    color: prediction.risk_badge === 'red' ? 'var(--accent-red)' : prediction.risk_badge === 'amber' ? 'var(--accent-amber)' : 'var(--accent-teal)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {(prediction.estimated_probability * 100).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Target: Station daily events ≥ 2 (Test ROC-AUC: 0.6583)
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'rgba(0, 240, 255, 0.05)',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '0.85rem'
                }}>
                  <div style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--accent-cyan)', marginBottom: '0.3rem' }}>
                    Model-Supported Plain-Language Attribution:
                  </div>
                  <p style={{ fontSize: '0.76rem', color: '#e2e8f0', lineHeight: 1.45 }}>
                    {prediction.explainability_plain_language}
                  </p>
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <strong>Key Model Inputs:</strong> Commercial Density: {prediction.key_contributing_factors.commercial_density} • Transit Proximity: {prediction.key_contributing_factors.transit_proximity_km}km • 7-Day Past Volume: {prediction.key_contributing_factors.rolling_7d_past_count}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '3rem' }}>
                Click "Execute ML Risk Inference" to invoke the trained XGBoost model artifact and generate calibrated risk estimates.
              </div>
            )}
          </div>

          <div style={{
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '0.75rem',
            marginTop: '1rem'
          }}>
            Ethical Governance: Area-level capacity estimation only. Model strictly evaluates spatial and temporal dynamics without demographic or individual profiling.
          </div>
        </div>
      </div>
    </div>
  );
};
