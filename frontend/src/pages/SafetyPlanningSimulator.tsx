import React, { useState } from 'react';
import axios from 'axios';
import { Sliders, Shield, Users, Compass, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export const SafetyPlanningSimulator: React.FC<{ selectedCity: string }> = ({ selectedCity }) => {
  const [city, setCity] = useState(selectedCity === 'All' ? 'Mumbai' : selectedCity);
  const [patrolUnits, setPatrolUnits] = useState<number>(24);
  const [strategy, setStrategy] = useState<string>('HOTSPOT_PROPORTIONAL');
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/planning/simulate', {
        city: city,
        total_patrol_units: patrolUnits,
        strategy: strategy
      });
      setSimulationResult(res.data);
    } catch (e) {
      console.error('Simulation error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div className="cyber-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                Public Safety Scenario Planning Simulator
              </h2>
              <span className="cyber-badge badge-teal">CAPACITY MODELING AID</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem', maxWidth: '850px' }}>
              Simulates hypothetical resource allocations (patrol units / coverage ratio) across urban police station jurisdictions.
              Strictly intended for administrative workload balancing without individual profiling or automated dispatch.
            </p>
          </div>
          <span className="cyber-badge badge-amber">ACADEMIC SIMULATION</span>
        </div>
      </div>

      {/* Simulator Inputs & Allocation Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.25rem' }}>
        {/* Controls */}
        <div className="cyber-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={16} color="var(--accent-cyan)" />
            <span>Scenario Parameters</span>
          </h3>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
              Metropolitan Region
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
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
              <option value="Mumbai">Mumbai Metropolitan Region</option>
              <option value="Pune">Pune Urban District</option>
              <option value="Nagpur">Nagpur Urban District</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
              Total Patrol Units to Allocate: <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{patrolUnits}</span>
            </label>
            <input
              type="range"
              min="10"
              max="60"
              value={patrolUnits}
              onChange={(e) => setPatrolUnits(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
              Allocation Strategy
            </label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
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
              <option value="HOTSPOT_PROPORTIONAL">Hotspot-Density Proportional</option>
              <option value="EQUAL_PATROL">Equal Geographic Distribution</option>
              <option value="TRANSIT_FOCUSED">Transit & Commercial Nexus Priority</option>
            </select>
          </div>

          <button
            onClick={handleSimulate}
            disabled={loading}
            className="cyber-btn cyber-btn-primary"
            style={{ marginTop: '0.5rem', padding: '0.7rem' }}
          >
            <span>{loading ? 'Computing Allocations...' : 'Simulate Resource Scenario'}</span>
          </button>
        </div>

        {/* Results */}
        <div className="cyber-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
              Simulated Jurisdiction Workload & Patrol Allocation
            </h3>
            {simulationResult && (
              <span className="cyber-badge badge-teal">
                Coverage Index: {simulationResult.overall_simulated_coverage}%
              </span>
            )}
          </div>

          {simulationResult ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.6rem' }}>Jurisdiction</th>
                    <th style={{ padding: '0.6rem' }}>District</th>
                    <th style={{ padding: '0.6rem' }}>Spatial Profile</th>
                    <th style={{ padding: '0.6rem' }}>Historical Incidents</th>
                    <th style={{ padding: '0.6rem' }}>Allocated Patrols</th>
                    <th style={{ padding: '0.6rem' }}>Coverage Index</th>
                  </tr>
                </thead>
                <tbody>
                  {simulationResult.allocations.map((row: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(30, 48, 86, 0.3)' }}>
                      <td style={{ padding: '0.6rem', fontWeight: 600, color: '#f8fafc' }}>{row.police_station}</td>
                      <td style={{ padding: '0.6rem', color: 'var(--text-secondary)' }}>{row.district}</td>
                      <td style={{ padding: '0.6rem' }}>
                        <span className="cyber-badge badge-cyan" style={{ fontSize: '0.65rem' }}>{row.cluster_label}</span>
                      </td>
                      <td style={{ padding: '0.6rem' }} className="mono-text">{row.historical_incidents}</td>
                      <td style={{ padding: '0.6rem', color: 'var(--accent-teal)', fontWeight: 700 }} className="mono-text">
                        {row.allocated_patrol_units} units
                      </td>
                      <td style={{ padding: '0.6rem' }} className="mono-text">
                        {row.simulated_coverage_pct}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{
                marginTop: '1rem',
                padding: '0.65rem',
                backgroundColor: '#0c1424',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                fontSize: '0.7rem',
                color: 'var(--text-muted)'
              }}>
                <strong>Disclaimer:</strong> {simulationResult.scenario_disclaimer}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '4rem' }}>
              Configure parameters on the left and click "Simulate Resource Scenario" to calculate capacity allocations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
