import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend,
  LineChart, Line, ScatterChart, Scatter, ZAxis,
  Cell, PieChart, Pie,
} from 'recharts';
import { STATE_PROVIDER_DATA, REGIONS, getNationalAverages } from '../../data/stateProviderData';
import { PROVIDERS } from '../../data/providers';
import { PROVIDER_COLOR_MAP, getProviderColor } from '../../utils/colorUtils';
import { formatPercent, formatNumber } from '../../utils/formatters';

const PROVIDER_KEYS = [
  { key: 'att', label: 'AT&T', color: '#00A8E0' },
  { key: 'verizon', label: 'Verizon', color: '#CD040B' },
  { key: 'tmobile', label: 'T-Mobile', color: '#E20074' },
  { key: 'comcast', label: 'Comcast', color: '#CC0000' },
  { key: 'spectrum', label: 'Spectrum', color: '#0072CE' },
  { key: 'cox', label: 'Cox', color: '#00897B' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0D1526', border: '1px solid #1E2D45', borderRadius: 10, padding: '12px 16px', minWidth: 160 }}>
      <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8, fontWeight: 600 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 3 }}>
          <span style={{ fontSize: 12, color: p.color }}>{p.name}</span>
          <span style={{ fontSize: 12, color: '#E2E8F0', fontWeight: 600 }}>{typeof p.value === 'number' ? `${p.value.toFixed(1)}%` : p.value}</span>
        </div>
      ))}
    </div>
  );
};

const ProviderCard = ({ provider, isSelected, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: isSelected ? `${provider.color}15` : 'linear-gradient(145deg, #111C2E, #0D1526)',
      border: `1px solid ${isSelected ? provider.color : '#1E2D45'}`,
      borderRadius: 12, padding: '14px 18px', cursor: 'pointer',
      transition: 'all 0.2s ease',
    }}
    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = `${provider.color}60`; }}
    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = '#1E2D45'; }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, background: `${provider.color}20`,
        border: `1px solid ${provider.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 800, color: provider.color,
      }}>{provider.shortName.slice(0, 4)}</div>
      {provider.isATT && (
        <span style={{ fontSize: 9, fontWeight: 700, color: '#00A8E0', letterSpacing: '1px', background: 'rgba(0,168,224,0.12)', padding: '2px 6px', borderRadius: 4 }}>OUR CO.</span>
      )}
    </div>
    <div style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', marginBottom: 4 }}>{provider.name}</div>
    <div style={{ fontSize: 22, fontWeight: 800, color: provider.color }}>{provider.nationalWirelessShare}%</div>
    <div style={{ fontSize: 11, color: '#64748B' }}>Wireless share</div>
    <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
      <div style={{ flex: 1, height: 3, background: '#1E2D45', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${(provider.nationalWirelessShare / 30) * 100}%`, height: '100%', background: provider.color, transition: 'width 0.5s' }} />
      </div>
    </div>
  </div>
);

const ProviderAnalytics = ({ liveData }) => {
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedProviders, setSelectedProviders] = useState(['att', 'verizon', 'tmobile']);
  const [chartType, setChartType] = useState('bar');
  const [selectedProvider, setSelectedProvider] = useState(null);

  const stateData = liveData || STATE_PROVIDER_DATA;

  const filteredData = useMemo(() =>
    stateData.filter(s => selectedRegion === 'All Regions' || s.region === selectedRegion),
    [stateData, selectedRegion]
  );

  const chartData = useMemo(() =>
    filteredData.map(s => ({
      state: s.id,
      name: s.name,
      att: parseFloat(s.att.toFixed(1)),
      verizon: parseFloat(s.verizon.toFixed(1)),
      tmobile: parseFloat(s.tmobile.toFixed(1)),
      comcast: parseFloat(s.comcast.toFixed(1)),
      spectrum: parseFloat(s.spectrum.toFixed(1)),
      cox: parseFloat(s.cox.toFixed(1)),
    })),
    [filteredData]
  );

  const nationalAvg = getNationalAverages();

  const radarData = [
    { subject: 'Coverage', att: 87, verizon: 95, tmobile: 85 },
    { subject: 'Speed', att: 80, verizon: 85, tmobile: 90 },
    { subject: 'Pricing', att: 72, verizon: 60, tmobile: 88 },
    { subject: 'Customer Svc', att: 75, verizon: 78, tmobile: 82 },
    { subject: 'Innovation', att: 82, verizon: 79, tmobile: 88 },
    { subject: '5G Deploy', att: 85, verizon: 88, tmobile: 92 },
  ];

  const toggleProvider = (key) => {
    setSelectedProviders(prev =>
      prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]
    );
  };

  const topAttStates = [...stateData].sort((a, b) => b.att - a.att).slice(0, 10);
  const bottomAttStates = [...stateData].sort((a, b) => a.att - b.att).slice(0, 10);

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Provider Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
        {PROVIDERS.slice(0, 6).map(p => (
          <ProviderCard
            key={p.id}
            provider={p}
            isSelected={selectedProvider === p.id}
            onClick={() => setSelectedProvider(prev => prev === p.id ? null : p.id)}
          />
        ))}
      </div>

      {/* Controls */}
      <div style={{
        background: 'linear-gradient(145deg, #111C2E, #0D1526)', border: '1px solid #1E2D45',
        borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
      }}>
        <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>Filter by Region:</div>
        <select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)}
          style={{ padding: '6px 12px', background: '#0D1526', border: '1px solid #1E2D45', borderRadius: 8, color: '#E2E8F0', fontSize: 12 }}>
          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        <div style={{ width: 1, height: 24, background: '#1E2D45' }} />
        <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>Show Providers:</div>
        {PROVIDER_KEYS.map(pk => (
          <button key={pk.key} onClick={() => toggleProvider(pk.key)}
            style={{
              padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600,
              background: selectedProviders.includes(pk.key) ? `${pk.color}20` : 'transparent',
              border: `1px solid ${selectedProviders.includes(pk.key) ? pk.color : '#1E2D45'}`,
              color: selectedProviders.includes(pk.key) ? pk.color : '#64748B',
            }}>
            {pk.label}
          </button>
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {['bar', 'line'].map(type => (
            <button key={type} onClick={() => setChartType(type)}
              style={{
                padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 11,
                background: chartType === type ? 'rgba(0,168,224,0.15)' : 'transparent',
                border: `1px solid ${chartType === type ? '#00A8E0' : '#1E2D45'}`,
                color: chartType === type ? '#00A8E0' : '#64748B',
              }}>
              {type === 'bar' ? '▪ Bar' : '↗ Line'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart */}
      <div style={{
        background: 'linear-gradient(145deg, #111C2E, #0D1526)', border: '1px solid #1E2D45', borderRadius: 16, padding: 24,
      }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#E2E8F0' }}>Market Share by State — {selectedRegion}</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Telecom provider market penetration per state (%)</div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          {chartType === 'bar' ? (
            <BarChart data={chartData} margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
              <XAxis dataKey="state" tick={{ fill: '#64748B', fontSize: 9 }} stroke="#1E2D45" interval={0} angle={-45} textAnchor="end" height={50} />
              <YAxis domain={[0, 55]} tick={{ fill: '#64748B', fontSize: 11 }} stroke="#1E2D45" tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94A3B8', paddingTop: 12 }} />
              {PROVIDER_KEYS.filter(p => selectedProviders.includes(p.key)).map(p => (
                <Bar key={p.key} dataKey={p.key} name={p.label} fill={p.color} radius={[2, 2, 0, 0]} />
              ))}
            </BarChart>
          ) : (
            <LineChart data={chartData} margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
              <XAxis dataKey="state" tick={{ fill: '#64748B', fontSize: 9 }} stroke="#1E2D45" interval={0} angle={-45} textAnchor="end" height={50} />
              <YAxis domain={[0, 55]} tick={{ fill: '#64748B', fontSize: 11 }} stroke="#1E2D45" tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94A3B8', paddingTop: 12 }} />
              {PROVIDER_KEYS.filter(p => selectedProviders.includes(p.key)).map(p => (
                <Line key={p.key} type="monotone" dataKey={p.key} name={p.label} stroke={p.color} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Row: Top/Bottom States + Radar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {/* Top AT&T States */}
        <div style={{ background: 'linear-gradient(145deg, #111C2E, #0D1526)', border: '1px solid #1E2D45', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0', marginBottom: 4 }}>🏆 Top AT&T States</div>
          <div style={{ fontSize: 11, color: '#64748B', marginBottom: 16 }}>Highest market penetration</div>
          {topAttStates.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, background: i < 3 ? 'rgba(0,168,224,0.2)' : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: i < 3 ? '#00A8E0' : '#64748B', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 12, color: '#E2E8F0' }}>{s.name}</span>
                  <span style={{ fontSize: 12, color: '#00A8E0', fontWeight: 700 }}>{formatPercent(s.att)}</span>
                </div>
                <div style={{ height: 3, background: '#1E2D45', borderRadius: 2 }}>
                  <div style={{ width: `${(s.att / 45) * 100}%`, height: '100%', background: '#00A8E0', borderRadius: 2 }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom AT&T States (opportunities) */}
        <div style={{ background: 'linear-gradient(145deg, #111C2E, #0D1526)', border: '1px solid #1E2D45', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0', marginBottom: 4 }}>🎯 Growth Opportunity States</div>
          <div style={{ fontSize: 11, color: '#64748B', marginBottom: 16 }}>Lowest AT&T market share</div>
          {bottomAttStates.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#EF4444', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 12, color: '#E2E8F0' }}>{s.name}</span>
                  <span style={{ fontSize: 12, color: '#EF4444', fontWeight: 700 }}>{formatPercent(s.att)}</span>
                </div>
                <div style={{ height: 3, background: '#1E2D45', borderRadius: 2 }}>
                  <div style={{ width: `${(s.att / 45) * 100}%`, height: '100%', background: '#EF4444', borderRadius: 2 }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Radar chart */}
        <div style={{ background: 'linear-gradient(145deg, #111C2E, #0D1526)', border: '1px solid #1E2D45', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0', marginBottom: 4 }}>Competitive Radar</div>
          <div style={{ fontSize: 11, color: '#64748B', marginBottom: 12 }}>AT&T vs Competitors (score/100)</div>
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1E2D45" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10 }} />
              <Radar name="AT&T" dataKey="att" stroke="#00A8E0" fill="#00A8E0" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Verizon" dataKey="verizon" stroke="#CD040B" fill="#CD040B" fillOpacity={0.1} strokeWidth={1.5} />
              <Radar name="T-Mobile" dataKey="tmobile" stroke="#E20074" fill="#E20074" fillOpacity={0.1} strokeWidth={1.5} />
              <Legend wrapperStyle={{ fontSize: 10, color: '#94A3B8' }} />
              <Tooltip contentStyle={{ background: '#0D1526', border: '1px solid #1E2D45', borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* National averages summary */}
      <div style={{ background: 'linear-gradient(145deg, #111C2E, #0D1526)', border: '1px solid #00A8E030', borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0', marginBottom: 16 }}>National Average Market Share (All 51 States + DC)</div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'AT&T', value: nationalAvg.att, color: '#00A8E0' },
            { label: 'Verizon', value: nationalAvg.verizon, color: '#CD040B' },
            { label: 'T-Mobile', value: nationalAvg.tmobile, color: '#E20074' },
            { label: 'Comcast', value: nationalAvg.comcast, color: '#CC0000' },
            { label: 'Spectrum', value: nationalAvg.spectrum, color: '#0072CE' },
            { label: 'Cox', value: nationalAvg.cox, color: '#00897B' },
          ].map(p => (
            <div key={p.label} style={{ flex: 1, minWidth: 100 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#94A3B8' }}>{p.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{formatPercent(p.value)}</span>
              </div>
              <div style={{ height: 6, background: '#1E2D45', borderRadius: 3 }}>
                <div style={{ width: `${(p.value / 40) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${p.color}80, ${p.color})`, borderRadius: 3, transition: 'width 0.5s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProviderAnalytics;
