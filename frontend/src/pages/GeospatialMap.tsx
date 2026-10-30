import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, ShieldAlert, Layers, Filter, Compass, Info } from 'lucide-react';

export const GeospatialMap: React.FC<{ selectedCity: string }> = ({ selectedCity }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [clusters, setClusters] = useState<any[]>([]);
  const [selectedStation, setSelectedStation] = useState<any>(null);
  const [crimeFilter, setCrimeFilter] = useState<string>('all');
  const [clusterFilter, setClusterFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center on Maharashtra (default Mumbai region)
      const map = L.map(mapContainerRef.current, {
        center: [19.0760, 72.8777],
        zoom: 11,
        zoomControl: false
      });

      // Dark cyber-intelligence map tiles (CartoDB Dark Matter)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>, OpenStreetMap',
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Keep instance intact across minor renders
    };
  }, []);

  // Fetch geographic stations and cluster aggregations
  useEffect(() => {
    const fetchClusters = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/geo/clusters');
        setClusters(res.data.clusters);
      } catch (e) {
        console.error('Failed to load clusters:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchClusters();
  }, []);

  // Update map viewport when city changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (selectedCity === 'Mumbai') {
      mapInstanceRef.current.flyTo([19.0760, 72.8777], 11, { duration: 1.2 });
    } else if (selectedCity === 'Pune') {
      mapInstanceRef.current.flyTo([18.5204, 73.8567], 12, { duration: 1.2 });
    } else if (selectedCity === 'Nagpur') {
      mapInstanceRef.current.flyTo([21.1458, 79.0882], 12, { duration: 1.2 });
    } else {
      mapInstanceRef.current.flyTo([19.5, 75.5], 7, { duration: 1.5 });
    }
  }, [selectedCity]);

  // Render markers and hot zones on map
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // Filter stations
    const filteredStations = clusters.filter((st) => {
      const matchCity = selectedCity === 'All' || st.city.toLowerCase() === selectedCity.toLowerCase();
      const matchCluster = clusterFilter === 'all' || String(st.cluster_id) === clusterFilter;
      return matchCity && matchCluster;
    });

    filteredStations.forEach((st) => {
      // Determine radius and color based on cluster and incident density
      let markerColor = '#00f0ff'; // Cyan
      if (st.cluster_id === 0) markerColor = '#ef4444'; // Red (High-Frequency Metro Corridor)
      else if (st.cluster_id === 1) markerColor = '#3b82f6'; // Blue (Moderate Residential)
      else if (st.cluster_id === 2) markerColor = '#f59e0b'; // Amber (Commercial Transit Nexus)
      else markerColor = '#00e5a3'; // Teal (Peripheral Sub-District)

      const radius = Math.min(22, Math.max(9, Math.sqrt(st.total_incidents) * 0.45));

      // Hotspot circle marker
      const marker = L.circleMarker([st.avg_lat, st.avg_lon], {
        radius: radius,
        fillColor: markerColor,
        color: '#f8fafc',
        weight: 1.5,
        opacity: 0.9,
        fillOpacity: 0.55
      });

      marker.on('click', () => {
        setSelectedStation(st);
      });

      marker.bindTooltip(`
        <div style="font-family: var(--font-sans); padding: 4px;">
          <strong style="color: ${markerColor}">${st.police_station}</strong><br/>
          <span style="font-size: 11px; color: #94a3b8">${st.cluster_label}</span><br/>
          <span style="font-size: 12px; font-weight: bold; color: #f8fafc">${st.total_incidents} Total Events</span>
        </div>
      `, { className: 'cyber-tooltip', sticky: true });

      marker.addTo(markersLayerRef.current!);
    });

    // Auto select first visible station if none selected
    if (filteredStations.length > 0 && !selectedStation) {
      setSelectedStation(filteredStations[0]);
    }
  }, [clusters, selectedCity, clusterFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'calc(100vh - 125px)' }}>
      {/* Top Filter and Layer Control */}
      <div className="cyber-card" style={{ padding: '0.75rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={15} color="var(--accent-cyan)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>K-Means Cluster:</span>
            <select
              value={clusterFilter}
              onChange={(e) => setClusterFilter(e.target.value)}
              style={{
                backgroundColor: '#111d35',
                border: '1px solid var(--border-color)',
                color: '#f8fafc',
                fontSize: '0.78rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                outline: 'none'
              }}
            >
              <option value="all">All Clusters (4 Spatial Profiles)</option>
              <option value="0">Cluster 0: High-Frequency Metro Corridor</option>
              <option value="1">Cluster 1: Moderate Urban Residential</option>
              <option value="2">Cluster 2: Commercial Transit Nexus</option>
              <option value="3">Cluster 3: Peripheral Sub-District</option>
            </select>
          </div>

          <span className="cyber-badge badge-amber">SYNTHETIC DEMO DATA</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} /> High Corridor
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} /> Transit Nexus
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} /> Residential
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00e5a3' }} /> Peripheral
          </span>
        </div>
      </div>

      {/* Main Map + Inspector Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1rem', flex: 1, minHeight: 0 }}>
        {/* Leaflet Map Canvas */}
        <div className="cyber-card" style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
          
          {/* Map floating banner */}
          <div style={{
            position: 'absolute',
            bottom: '15px',
            left: '15px',
            zIndex: 400,
            background: 'rgba(11, 20, 38, 0.85)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            padding: '0.4rem 0.75rem',
            fontSize: '0.7rem',
            color: 'var(--text-secondary)',
            backdropFilter: 'blur(4px)'
          }}>
            Coordinate Bounds: Maharashtra Urban Polygons (Mumbai / Pune / Nagpur)
          </div>
        </div>

        {/* Selected Area Detail Inspector */}
        <div className="cyber-card" style={{ padding: '1.25rem', overflowY: 'auto' }}>
          {selectedStation ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <span className="cyber-badge badge-cyan" style={{ marginBottom: '0.4rem' }}>
                  {selectedStation.city} • {selectedStation.district}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.3rem' }}>
                  {selectedStation.police_station}
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Cluster: <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{selectedStation.cluster_label}</span>
                </div>
              </div>

              <div style={{
                background: 'rgba(0, 240, 255, 0.05)',
                border: '1px solid rgba(0, 240, 255, 0.2)',
                borderRadius: '6px',
                padding: '0.85rem'
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>AGGREGATE INCIDENT VOLUME</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  {selectedStation.total_incidents}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Multi-year spatial events logged
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                  Crime Category Breakdown
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid rgba(30, 48, 86, 0.4)' }}>
                    <span>Property Theft & Burglary</span>
                    <strong className="mono-text" style={{ color: '#f8fafc' }}>{selectedStation.property_thefts}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid rgba(30, 48, 86, 0.4)' }}>
                    <span>Violent Crimes</span>
                    <strong className="mono-text" style={{ color: '#ef4444' }}>{selectedStation.violent_crimes}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid rgba(30, 48, 86, 0.4)' }}>
                    <span>Crimes Against Women</span>
                    <strong className="mono-text" style={{ color: '#f59e0b' }}>{selectedStation.crimes_against_women}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid rgba(30, 48, 86, 0.4)' }}>
                    <span>Cyber Crimes</span>
                    <strong className="mono-text" style={{ color: '#00f0ff' }}>{selectedStation.cyber_crimes}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                    <span>Economic Offences</span>
                    <strong className="mono-text" style={{ color: '#00e5a3' }}>{selectedStation.economic_crimes}</strong>
                  </div>
                </div>
              </div>

              <div style={{
                background: '#0a1222',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '0.75rem',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  Geospatial Coordinates:
                </div>
                <div className="mono-text">
                  Lat: {selectedStation.avg_lat.toFixed(4)}° N, Lon: {selectedStation.avg_lon.toFixed(4)}° E
                </div>
                <div style={{ marginTop: '0.4rem', color: 'var(--text-muted)' }}>
                  Commercial Density: {Math.round(selectedStation.avg_commercial_density * 100)}% • 
                  Transit Proximity: {selectedStation.avg_transit_proximity} km
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '3rem' }}>
              Select a police station jurisdiction marker on the map to inspect its spatial intelligence profile.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
