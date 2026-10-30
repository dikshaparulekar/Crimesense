import React, { useState } from 'react';
import { PersistentDisclaimer } from './components/PersistentDisclaimer';
import { Sidebar, RouteType } from './components/Sidebar';
import { CommandBar } from './components/CommandBar';

import { DashboardOverview } from './pages/DashboardOverview';
import { GeospatialMap } from './pages/GeospatialMap';
import { AnalyticsTrends } from './pages/AnalyticsTrends';
import { AreaRiskInference } from './pages/AreaRiskInference';
import { MLLaboratory } from './pages/MLLaboratory';
import { DataOperationsPipeline } from './pages/DataOperationsPipeline';
import { DatasetRegistry } from './pages/DatasetRegistry';
import { SafetyPlanningSimulator } from './pages/SafetyPlanningSimulator';
import { MethodologyPage } from './pages/MethodologyPage';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<RouteType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  const renderCurrentRoute = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardOverview selectedCity={selectedCity} />;
      case 'map':
        return <GeospatialMap selectedCity={selectedCity} />;
      case 'analytics':
        return <AnalyticsTrends selectedCity={selectedCity} />;
      case 'risk':
        return <AreaRiskInference selectedCity={selectedCity} />;
      case 'models':
        return <MLLaboratory />;
      case 'data-operations':
        return <DataOperationsPipeline />;
      case 'datasets':
        return <DatasetRegistry />;
      case 'planning':
        return <SafetyPlanningSimulator selectedCity={selectedCity} />;
      case 'methodology':
        return <MethodologyPage />;
      default:
        return <DashboardOverview selectedCity={selectedCity} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Persistent Academic & Safety Disclaimer */}
      <PersistentDisclaimer />

      {/* Main Command Center Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Cyber Sidebar */}
        <Sidebar
          currentRoute={currentRoute}
          onRouteChange={(r) => setCurrentRoute(r)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Center Workspace */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, overflow: 'hidden' }}>
          {/* Top Command Bar */}
          <CommandBar
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            selectedCity={selectedCity}
            onSelectCity={(c) => setSelectedCity(c)}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />

          {/* Active Route Viewport */}
          <main style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem',
            backgroundColor: 'var(--bg-primary)'
          }}>
            {renderCurrentRoute()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
