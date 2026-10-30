import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';
import { 
  Database, ShieldCheck, Cpu, HardDrive, 
  TrendingUp, AlertCircle, ArrowUpRight, BarChart2 
} from 'lucide-react';

export const DashboardOverview: React.FC<{ selectedCity: string }> = ({ selectedCity }) => {
  const [overview, setOverview] = useState<any>(null);
  const [ncrbData, setNcrbData] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedCity]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resOverview, resNcrb, resTrends] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/overview'),
        axios.get(`http://127.0.0.1:8000/api/analytics/ncrb?city=${selectedCity}`),
        axios.get(`http://127.0.0.1:8000/api/analytics/trends?city=${selectedCity === 'All' ? 'Mumbai' : selectedCity}`)
      ]);
      setOverview(resOverview.data);
      setNcrbData(resNcrb.data);
      setTrends(resTrends.data);
    } catch (e) {
      console.error('Failed to load overview:', e);
    } finally {
      setLoading(false);
    }
  };

  // ECharts Crime Distribution Donut
  const getCrimeDistributionChart = () => {
    if (!ncrbData || !ncrbData.crime_distribution) return {};
    const chartData = Object.entries(ncrbData.crime_distribution).map(([name, value]) => ({
      name,
      value
    }));

    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#111d35',
        borderColor: '#1e3056',
        textStyle: { color: '#f8fafc' },
        formatter: '{b}: {c} cases ({d}%)'
      },
      legend: {
        bottom: 0,
        textStyle: { color: '#94a3b8', fontSize: 11 },
        itemWidth: 10,
        itemHeight: 10
      },
      series: [
        {
          name: 'Official Crime Distribution',
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#070c14',
            borderWidth: 2
          },
          label: { show: false },
          emphasis: {
            label: { show: true, fontSize: 12, fontWeight: 'bold', color: '#00f0ff' }
          },
          data: chartData,
          color: ['#00f0ff', '#00e5a3', '#f59e0b', '#3b82f6', '#ec4899']
        }
      ]
    };
  };

  // Monthly incident trend chart
  const getMonthlyTrendChart = () => {
    if (!trends || !trends.monthly_trend) return {};
    const months = trends.monthly_trend.map((t: any) => t.month_year);
    const incidents = trends.monthly_trend.map((t: any) => t.total_incidents);
    const rolling7d = trends.monthly_trend.map((t: any) => Math.round(t.avg_7d_rolling * 10) / 10);

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#111d35',
        borderColor: '#1e3056',
        textStyle: { color: '#f8fafc' }
      },
      legend: {
        data: ['Observed Incidents (Simulated)', 'Past-7D Rolling Lag Avg'],
        textStyle: { color: '#94a3b8' },
        top: 0
      },
      grid: { left: '3%', right: '4%', bottom: '8%', containLabel: true },
      xAxis: {
        type: 'category',
        data: months,
        axisLine: { lineStyle: { color: '#1e3056' } },
        axisLabel: { color: '#64748b', fontSize: 10, rotate: 30 }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(30, 48, 86, 0.4)' } },
        axisLabel: { color: '#64748b', fontSize: 10 }
      },
      series: [
        {
          name: 'Observed Incidents (Simulated)',
          type: 'bar',
          data: incidents,
          itemStyle: { color: 'rgba(0, 240, 255, 0.65)' }
        },
        {
          name: 'Past-7D Rolling Lag Avg',
          type: 'line',
          smooth: true,
          data: rolling7d,
          lineStyle: { color: '#00e5a3', width: 2.5 },
          itemStyle: { color: '#00e5a3' }
        }
      ]
    };
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading Command Intelligence Telemetry...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Telemetry KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem'
      }}>
        <div className="cyber-card" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Data Quality Index
            </span>
            <div className="cyber-badge badge-teal">{overview?.data_quality_score}% VERIFIED</div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem', color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
            {overview?.data_quality_score}%
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Schema, bounding box & integrity audited
          </div>
        </div>

        <div className="cyber-card" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Official NCRB Compendiums
            </span>
            <div className="cyber-badge badge-cyan">NCRB OFFICIAL</div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
            {overview?.observed_official_records} <span style={{ fontSize: '0.85rem', fontWeight: 400 }}>City/Year Aggregates</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Govt. of India Open Data (2018-2022)
          </div>
        </div>

        <div className="cyber-card" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Synthetic ML Benchmark
            </span>
            <div className="cyber-badge badge-amber">SYNTHETIC DEMO</div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
            {overview?.synthetic_benchmark_records.toLocaleString()}{' '}
            <span style={{ fontSize: '0.85rem', fontWeight: 400 }}>Spatio-Temporal Logs</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            19 Police Station Jurisdictions (Mumbai/Pune/Nagpur)
          </div>
        </div>

        <div className="cyber-card" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Champion ML Predictor
            </span>
            <div className="cyber-badge badge-teal">ROC-AUC {overview?.champion_roc_auc}</div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--accent-teal)', fontFamily: 'var(--font-mono)' }}>
            {overview?.champion_ml_model}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Chronological out-of-time evaluation
          </div>
        </div>
      </div>

      {/* Main Visual Intelligence Rows */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Monthly Trend (Columnar Features) */}
        <div className="cyber-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                Multi-Year Spatio-Temporal Volumetrics
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Aggregated daily logs with 7-day past rolling features (No future leakage)
              </p>
            </div>
            <span className="cyber-badge badge-amber">SYNTHETIC DEMO DATA</span>
          </div>
          <div style={{ height: '280px' }}>
            <ReactECharts option={getMonthlyTrendChart()} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Crime Breakdown (Official NCRB) */}
        <div className="cyber-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                Official IPC Crime Classifications (NCRB)
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Historical Crime in India compendium distribution for Maharashtra metros
              </p>
            </div>
            <span className="cyber-badge badge-cyan">OFFICIAL VERIFIED</span>
          </div>
          <div style={{ height: '280px' }}>
            <ReactECharts option={getCrimeDistributionChart()} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* Technical Pipeline & Model Health Banner */}
      <div className="cyber-card" style={{ padding: '1.1rem', backgroundColor: '#0d182e', borderLeft: '3px solid var(--accent-cyan)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.88rem' }}>
              <Cpu size={16} color="var(--accent-cyan)" />
              <span>Big Data Engine Architecture</span>
              <span className="cyber-badge badge-teal">{overview?.pipeline_engine}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Last executed: <span className="mono-text" style={{ color: 'var(--accent-cyan)' }}>{overview?.last_pipeline_execution || 'Active in Memory'}</span> • 
              Primary Risk Drivers: <span className="mono-text" style={{ color: '#f8fafc' }}>{overview?.top_predictive_features?.join(', ')}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className="cyber-badge badge-cyan">Zero Data Leakage Validated</span>
            <span className="cyber-badge badge-teal">Parquet Columnar Partitioned</span>
          </div>
        </div>
      </div>
    </div>
  );
};
