import React from 'react';
import { Menu, Activity, ShieldCheck, MapPin, RefreshCw } from 'lucide-react';

interface CommandBarProps {
  onToggleSidebar: () => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export const CommandBar: React.FC<CommandBarProps> = ({
  onToggleSidebar,
  selectedCity,
  onSelectCity,
  onRefresh,
  refreshing
}) => {
  return (
    <header style={{
      height: '52px',
      backgroundColor: '#0c1424',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      flexShrink: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={onToggleSidebar}
          className="cyber-btn"
          style={{ padding: '0.4rem', borderRadius: '4px' }}
          title="Toggle Command Sidebar"
        >
          <Menu size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={15} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Region:</span>
          <select
            value={selectedCity}
            onChange={(e) => onSelectCity(e.target.value)}
            style={{
              backgroundColor: '#111d35',
              border: '1px solid var(--border-color)',
              color: '#f8fafc',
              fontSize: '0.8rem',
              padding: '0.3rem 0.6rem',
              borderRadius: '4px',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Maharashtra Centers (State + Metros)</option>
            <option value="Mumbai">Mumbai Metropolitan Region</option>
            <option value="Pune">Pune Urban District</option>
            <option value="Nagpur">Nagpur Urban District</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="cyber-badge badge-teal" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Activity size={12} />
          <span>DATA FLOW: SYNCHRONIZED</span>
        </div>

        <button 
          onClick={onRefresh}
          className="cyber-btn"
          style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
          disabled={refreshing}
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          <span>{refreshing ? 'Syncing...' : 'Sync Pipeline'}</span>
        </button>
      </div>
    </header>
  );
};
