import React from 'react';
import { 
  ShieldAlert, LayoutDashboard, MapPin, LineChart, Shield, 
  Cpu, Database, Layers, Sliders, BookOpen 
} from 'lucide-react';

export type RouteType = 
  | 'dashboard' 
  | 'map' 
  | 'analytics' 
  | 'risk' 
  | 'models' 
  | 'data-operations' 
  | 'datasets' 
  | 'planning' 
  | 'methodology';

interface SidebarProps {
  currentRoute: RouteType;
  onRouteChange: (route: RouteType) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentRoute, 
  onRouteChange, 
  collapsed, 
  onToggleCollapse 
}) => {
  const menuItems: { id: RouteType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Command Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'map', label: 'Geospatial Intelligence', icon: <MapPin size={18} /> },
    { id: 'analytics', label: 'Crime Trends & NCRB', icon: <LineChart size={18} /> },
    { id: 'risk', label: 'Area Risk Inference', icon: <Shield size={18} /> },
    { id: 'models', label: 'ML Laboratory', icon: <Cpu size={18} /> },
    { id: 'data-operations', label: 'Big Data Pipeline', icon: <Database size={18} /> },
    { id: 'datasets', label: 'Dataset Registry & Import', icon: <Layers size={18} /> },
    { id: 'planning', label: 'Safety Planning Simulator', icon: <Sliders size={18} /> },
    { id: 'methodology', label: 'Methodology & Limiting Scope', icon: <BookOpen size={18} /> },
  ];

  return (
    <aside style={{
      width: collapsed ? '68px' : '260px',
      backgroundColor: '#09101f',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.2s ease',
      flexShrink: 0,
      minHeight: 'calc(100vh - 35px)',
      position: 'relative'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: collapsed ? '1.2rem 0.5rem' : '1.25rem 1.25rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        justifyContent: collapsed ? 'center' : 'flex-start'
      }}>
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2) 0%, rgba(0, 229, 163, 0.2) 100%)',
          border: '1px solid var(--accent-cyan)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-cyan)'
        }}>
          <ShieldAlert size={20} />
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              CrimeSense <span className="cyber-badge badge-cyan" style={{ fontSize: '0.6rem' }}>IN</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Urban Risk Intelligence
            </div>
          </div>
        )}
      </div>

      {/* Navigation items */}
      <nav style={{ padding: '1rem 0.6rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {menuItems.map((item) => {
          const isActive = currentRoute === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onRouteChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                border: isActive ? '1px solid rgba(0, 240, 255, 0.4)' : '1px solid transparent',
                backgroundColor: isActive ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.82rem',
                cursor: 'pointer',
                textAlign: 'left',
                justifyContent: collapsed ? 'center' : 'flex-start',
                transition: 'all 0.15s ease'
              }}
              title={collapsed ? item.label : undefined}
            >
              <span style={{ color: isActive ? 'var(--accent-cyan)' : '#64748b', display: 'flex', alignItems: 'center' }}>
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div style={{
        padding: '0.85rem',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.7rem',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)'
      }}>
        {!collapsed && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-teal)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-teal)', display: 'inline-block' }} />
              CORE PIPELINE ACTIVE
            </div>
            <div style={{ marginTop: '0.3rem', fontSize: '0.65rem' }}>
              MAHARASHTRA v1.0.4
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
