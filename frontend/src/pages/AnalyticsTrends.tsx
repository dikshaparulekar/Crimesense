import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';
import { LineChart, BarChart, Calendar, Award, AlertCircle, FileText } from 'lucide-react';

export const AnalyticsTrends: React.FC<{ selectedCity: string }> = ({ selectedCity }) => {
  const [ncrbData, setNcrbData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchNcrb();
  }, [selectedCity]);

  const fetchNcrb = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/analytics/ncrb?city=${selectedCity}`);
      setNcrbData(res.data);
    } catch (e) {
      console.error('Failed to load NCRB analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  // Yearly Multi-Bar / Line Chart
  const getMultiYearCrimeChart = () => {
    if (!ncrbData || !ncrbData.raw_records) return {};

    const years = [2018, 2019, 2020, 2021, 2022];
    const categories = Array.from(new Set(ncrbData.raw_records.map((r: any) => r.crime_head)));

    const series = categories.map((cat: any, idx: number) => {
      const colorPalette = ['#00f0ff', '#00e5a3', '#f59e0b', '#ef4444', '#a855f7'];
      const dataForCat = years.map((y) => {
        const rows = ncrbData.raw_records.filter((r: any) => r.year === y && r.crime_head === cat);
        return rows.reduce((acc: number, cur: any) => acc + cur.cases_reported, 0);
      });

      return {
        name: cat,
        type: 'line',
        smooth: true,
        data: dataForCat,
        lineStyle: { width: 2.5 },
        itemStyle: { color: colorPalette[idx % colorPalette.length] }
      };
    });

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#111d35',
        borderColor: '#1e3056',
        textStyle: { color: '#f8fafc' }
      },
      legend: {
        data: categories,
        textStyle: { color: '#94a3b8', fontSize: 11 },
        top: 0
      },
      grid: { left: '3%', right: '4%', bottom: '5%', containLabel: true },
      xAxis: {
        type: 'category',
        data: years.map(String),
        axisLine: { lineStyle: { color: '#1e3056' } },
        axisLabel: { color: '#64748b' }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(30, 48, 86, 0.4)' } },
        axisLabel: { color: '#64748b' }
      },
      series
    };
  };

  // Metro Comparison Bar Chart
  const getCityComparisonChart = () => {
    if (!ncrbData || !ncrbData.city_comparison) return {};
    const cities = Object.keys(ncrbData.city_comparison);
    const totals = Object.values(ncrbData.city_comparison);

    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#111d35',
        borderColor: '#1e3056',
        textStyle: { color: '#f8fafc' },
        formatter: '{b}: {c} total cases (2018-2022)'
      },
      grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
      xAxis: {
        type: 'category',
        data: cities,
        axisLine: { lineStyle: { color: '#1e3056' } },
        axisLabel: { color: '#64748b' }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(30, 48, 86, 0.4)' } },
        axisLabel: { color: '#64748b' }
      },
      series: [
        {
          name: 'Total Cases Reported',
          type: 'bar',
          data: totals,
          itemStyle: {
            color: '#00f0ff',
            borderRadius: [4, 4, 0, 0]
          }
        }
      ]
    };
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading Official NCRB Crime Trends...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Info Banner */}
      <div className="cyber-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                Official NCRB Historical Trends & Analysis (2018–2022)
              </h2>
              <span className="cyber-badge badge-cyan">OFFICIAL VERIFIED DATA</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem', maxWidth: '800px' }}>
              Comparative multi-year trajectory across major Maharashtra urban centers (Mumbai, Pune, Nagpur)
              based on authenticated Crime in India compendiums published by the National Crime Records Bureau (NCRB).
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <FileText size={15} color="var(--accent-cyan)" />
            <span>GODL Licensed Official Dataset</span>
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Trend Over Time */}
        <div className="cyber-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
              Multi-Year Category Growth Trajectory
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>2018 - 2022</span>
          </div>
          <div style={{ height: '320px' }}>
            <ReactECharts option={getMultiYearCrimeChart()} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Metro Comparison */}
        <div className="cyber-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
              Metropolitan Jurisdiction Case Volumes
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Cumulative 5-Year Totals</span>
          </div>
          <div style={{ height: '320px' }}>
            <ReactECharts option={getCityComparisonChart()} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* Official Data Table View */}
      <div className="cyber-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>
          NCRB Official Aggregates Registry Table
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.6rem' }}>Year</th>
                <th style={{ padding: '0.6rem' }}>City / District</th>
                <th style={{ padding: '0.6rem' }}>Crime Category</th>
                <th style={{ padding: '0.6rem' }}>Cases Reported</th>
                <th style={{ padding: '0.6rem' }}>Cases Chargesheeted</th>
                <th style={{ padding: '0.6rem' }}>Rate per Lakh Pop</th>
              </tr>
            </thead>
            <tbody>
              {ncrbData?.raw_records?.slice(0, 10).map((row: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(30, 48, 86, 0.3)' }}>
                  <td style={{ padding: '0.6rem', color: 'var(--accent-cyan)' }} className="mono-text">{row.year}</td>
                  <td style={{ padding: '0.6rem', fontWeight: 600 }}>{row.city_district}</td>
                  <td style={{ padding: '0.6rem' }}>{row.crime_head}</td>
                  <td style={{ padding: '0.6rem', fontWeight: 600 }} className="mono-text">{row.cases_reported.toLocaleString()}</td>
                  <td style={{ padding: '0.6rem', color: 'var(--accent-teal)' }} className="mono-text">{row.cases_chargesheeted.toLocaleString()}</td>
                  <td style={{ padding: '0.6rem' }} className="mono-text">{row.rate_per_lakh}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
