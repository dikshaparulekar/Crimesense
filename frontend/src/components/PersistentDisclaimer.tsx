import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const PersistentDisclaimer: React.FC = () => {
  return (
    <div style={{
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
      padding: '0.45rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '0.75rem',
      color: '#cbd5e1',
      zIndex: 100,
      position: 'relative'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <AlertTriangle size={15} color="#f59e0b" style={{ flexShrink: 0 }} />
        <span>
          <strong style={{ color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Academic Decision-Support Prototype:
          </strong>{' '}
          Predictions are statistical estimates based on available data, not confirmed future incidents. 
          Coverage differences & model uncertainty affect results. The platform must never be used to target individuals or communities.
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0, opacity: 0.85 }}>
        <ShieldCheck size={14} color="#00e5a3" />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#00e5a3' }}>
          NON-GOVERNMENTAL RESEARCH PROTOTYPE
        </span>
      </div>
    </div>
  );
};
