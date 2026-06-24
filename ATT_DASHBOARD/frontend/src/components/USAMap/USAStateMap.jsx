import React, { useState, memo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { STATE_PROVIDER_DATA, getATTLeadingStates, getATTOpportunityStates, REGIONS } from '../../data/stateProviderData';
import { getATTHeatColor, getLeaderColor, PROVIDER_COLOR_MAP } from '../../utils/colorUtils';
import { formatPopulation, formatPercent } from '../../utils/formatters';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const FIPS_TO_STATE = STATE_PROVIDER_DATA.reduce((acc, s) => {
  acc[parseInt(s.fips, 10)] = s;
  return acc;
}, {});

const MAP_MODES = [
  { id: 'leader', label: 'Market Leader', description: 'Shows dominant provider per state' },
  { id: 'att', label: 'AT&T Share', description: 'AT&T market presence heatmap' },
  { id: 'opportunity', label: 'AT&T Opportunity', description: 'Growth potential for AT&T' },
];

const StateDetailPanel = ({ state, onClose }) => {
  if (!state) return null;
  const providers = [
    { name: 'AT&T', share: state.att, color: '#00A8E0' },
    { name: 'Verizon', share: state.verizon, color: '#CD040B' },
    { name: 'T-Mobile', share: state.tmobile, color: '#E20074' },
    { name: 'Comcast', share: state.comcast, color: '#CC0000' },
    { name: 'Spectrum', share: state.spectrum, color: '#0072CE' },
    { name: 'Cox', share: state.cox, color: '#00897B' },
    { name: 'Others', share: state.others, color: '#374151' },
  ].filter(p => p.share > 0).sort((a, b) => b.share - a.share);

  const opportunityColor = { low: '#10B981', medium: '#F59E0B', high: '#EF4444' };

  return (
    <div style={{
      position: 'absolute', right: 0, top: 0, bottom: 0, width: 320,
      background: 'linear-gradient(180deg, #0D1526, #0A1020)',
      borderLeft: '1px solid #1E2D45', padding: 24, overflowY: 'auto',
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#E2E8F0' }}>{state.name}</div>
          <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{state.region} • Pop: {formatPopulation(state.population)}</div>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: '1px solid #1E2D45', borderRadius: 8, color: '#94A3B8', cursor: 'pointer', padding: '4px 10px', fontSize: 16 }}>✕</button>
      </div>

      {/* Leader badge */}
      <div style={{
        padding: '10px 14px', borderRadius: 10, marginBottom: 20,
        background: `${getLeaderColor(state.leader)}15`,
        border: `1px solid ${getLeaderColor(state.leader)}40`,
      }}>
        <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700, letterSpacing: '1px', marginBottom: 4 }}>MARKET LEADER</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: getLeaderColor(state.leader) }}>{state.leader}</div>
      </div>

      {/* AT&T opportunity */}
      <div style={{
        padding: '10px 14px', borderRadius: 10, marginBottom: 20,
        background: 'rgba(255,255,255,0.03)', border: '1px solid #1E2D45',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700, letterSpacing: '1px' }}>AT&T OPPORTUNITY</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: opportunityColor[state.attOpportunity], marginTop: 2, textTransform: 'uppercase' }}>
            {state.attOpportunity}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700, letterSpacing: '1px' }}>GROWTH TREND</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#10B981', marginTop: 2 }}>{state.trend}</div>
        </div>
      </div>

      {/* Market Share Chart */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 12, letterSpacing: '0.5px' }}>MARKET SHARE BREAKDOWN</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={providers} layout="vertical" margin={{ left: 8, right: 8 }}>
            <XAxis type="number" domain={[0, 50]} tick={{ fill: '#64748B', fontSize: 10 }} stroke="transparent" />
            <YAxis dataKey="name" type="category" tick={{ fill: '#94A3B8', fontSize: 11 }} stroke="transparent" width={60} />
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" horizontal={false} />
            <Tooltip formatter={(v) => [`${v.toFixed(1)}%`, 'Market Share']} contentStyle={{ background: '#0D1526', border: '1px solid #1E2D45', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="share" radius={[0, 3, 3, 0]}>
              {providers.map((p, i) => <Cell key={i} fill={p.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Share bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {providers.map(p => (
          <div key={p.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: p.name === 'AT&T' ? '#00A8E0' : '#94A3B8', fontWeight: p.name === 'AT&T' ? 700 : 400 }}>{p.name}</span>
              <span style={{ fontSize: 12, color: p.color, fontWeight: 600 }}>{formatPercent(p.share)}</span>
            </div>
            <div style={{ height: 4, background: '#1E2D45', borderRadius: 2 }}>
              <div style={{ height: '100%', width: `${p.share * 2}%`, background: p.color, borderRadius: 2, transition: 'width 0.5s ease' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Legend = ({ mode }) => {
  if (mode === 'leader') return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {[['AT&T', '#00A8E0'], ['Verizon', '#CD040B'], ['T-Mobile', '#E20074'], ['Comcast', '#CC0000'], ['Spectrum', '#0072CE']].map(([name, color]) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
          <span style={{ color: '#94A3B8' }}>{name}</span>
        </div>
      ))}
    </div>
  );
  if (mode === 'att') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 11, color: '#64748B' }}>Low</span>
      <div style={{ width: 120, height: 8, borderRadius: 4, background: 'linear-gradient(90deg, #1A2535, #0057A6, #00C8FF)' }} />
      <span style={{ fontSize: 11, color: '#64748B' }}>High AT&T Share</span>
    </div>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {[['Low (AT&T leads)', '#10B981'], ['Medium', '#F59E0B'], ['High (Growth potential)', '#EF4444']].map(([label, color]) => (
        <div key={color} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
          <span style={{ color: '#94A3B8' }}>{label}</span>
        </div>
      ))}
    </div>
  );
};

const USAStateMap = ({ liveData }) => {
  const [mapMode, setMapMode] = useState('att');
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('All Regions');

  const stateData = liveData || STATE_PROVIDER_DATA;

  const getColor = (fips) => {
    const state = FIPS_TO_STATE[fips];
    if (!state) return '#1A2535';
    if (mapMode === 'leader') return getLeaderColor(state.leader);
    if (mapMode === 'att') return getATTHeatColor(state.att);
    const oColors = { low: '#10B981', medium: '#F59E0B', high: '#EF4444' };
    return oColors[state.attOpportunity] || '#374151';
  };

  const stats = {
    attLeading: stateData.filter(s => s.leader === 'AT&T').length,
    verizonLeading: stateData.filter(s => s.leader === 'Verizon').length,
    tmobileLeading: stateData.filter(s => s.leader === 'T-Mobile').length,
    highOpportunity: stateData.filter(s => s.attOpportunity === 'high').length,
  };

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#E2E8F0', marginRight: 8 }}>Map View:</div>
        {MAP_MODES.map(mode => (
          <button key={mode.id} onClick={() => setMapMode(mode.id)}
            title={mode.description}
            style={{
              padding: '7px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600,
              background: mapMode === mode.id ? 'rgba(0,168,224,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${mapMode === mode.id ? 'rgba(0,168,224,0.5)' : '#1E2D45'}`,
              color: mapMode === mode.id ? '#00A8E0' : '#94A3B8',
              transition: 'all 0.2s',
            }}>
            {mode.label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)}
            style={{ padding: '7px 12px', background: '#111C2E', border: '1px solid #1E2D45', borderRadius: 8, color: '#94A3B8', fontSize: 12, cursor: 'pointer' }}>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'AT&T Leading States', value: stats.attLeading, color: '#00A8E0', icon: '🏆' },
          { label: 'Verizon Leading States', value: stats.verizonLeading, color: '#CD040B', icon: '📍' },
          { label: 'T-Mobile Leading States', value: stats.tmobileLeading, color: '#E20074', icon: '📍' },
          { label: 'High Opportunity States', value: stats.highOpportunity, color: '#EF4444', icon: '🎯' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'linear-gradient(145deg, #111C2E, #0D1526)',
            border: `1px solid ${stat.color}25`, borderRadius: 12, padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 24 }}>{stat.icon}</span>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Map */}
      <div style={{
        background: 'linear-gradient(145deg, #111C2E, #0D1526)',
        border: '1px solid #1E2D45', borderRadius: 16,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1E2D45', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0' }}>
              {MAP_MODES.find(m => m.id === mapMode)?.label}
            </div>
            <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Click any state for detailed breakdown</div>
          </div>
          <Legend mode={mapMode} />
        </div>

        <div style={{ display: 'flex', position: 'relative', minHeight: 520 }}>
          <div style={{ flex: 1 }}>
            <ComposableMap
              projection="geoAlbersUsa"
              style={{ width: '100%', height: 520 }}
            >
              <ZoomableGroup zoom={1}>
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map(geo => {
                      const fips = parseInt(geo.id, 10);
                      const stateInfo = FIPS_TO_STATE[fips];
                      const isSelected = selectedState?.fips === geo.id;
                      const isHovered = hoveredState === geo.id;
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onClick={() => {
                            if (stateInfo) setSelectedState(isSelected ? null : stateInfo);
                          }}
                          onMouseEnter={() => setHoveredState(geo.id)}
                          onMouseLeave={() => setHoveredState(null)}
                          style={{
                            default: {
                              fill: getColor(fips),
                              stroke: '#0A1020',
                              strokeWidth: 0.8,
                              outline: 'none',
                              transition: 'fill 0.3s ease',
                            },
                            hover: {
                              fill: isSelected ? getColor(fips) : '#2D4A6B',
                              stroke: '#00A8E0',
                              strokeWidth: 1.5,
                              outline: 'none',
                              cursor: 'pointer',
                            },
                            pressed: {
                              fill: '#00A8E0',
                              outline: 'none',
                            },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>

          {/* State detail panel */}
          {selectedState && (
            <StateDetailPanel state={selectedState} onClose={() => setSelectedState(null)} />
          )}
        </div>

        {/* Hover tooltip */}
        {hoveredState && (() => {
          const fips = parseInt(hoveredState, 10);
          const s = FIPS_TO_STATE[fips];
          if (!s) return null;
          return (
            <div style={{
              position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(13,21,38,0.95)', border: '1px solid #1E2D45', borderRadius: 10,
              padding: '8px 16px', pointerEvents: 'none', backdropFilter: 'blur(10px)',
              display: 'flex', gap: 16, alignItems: 'center',
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0' }}>{s.name}</span>
              <span style={{ fontSize: 12, color: getLeaderColor(s.leader) }}>Leader: {s.leader}</span>
              <span style={{ fontSize: 12, color: '#00A8E0' }}>AT&T: {s.att.toFixed(1)}%</span>
              <span style={{ fontSize: 12, color: '#94A3B8' }}>Pop: {formatPopulation(s.population)}</span>
            </div>
          );
        })()}
      </div>

      {/* State Table */}
      <div style={{
        background: 'linear-gradient(145deg, #111C2E, #0D1526)',
        border: '1px solid #1E2D45', borderRadius: 16, overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1E2D45' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0' }}>State-by-State Market Data</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1E2D45' }}>
                {['State', 'Region', 'AT&T %', 'Verizon %', 'T-Mobile %', 'Comcast %', 'Spectrum %', 'Leader', 'Opportunity', 'Trend'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#64748B', fontWeight: 600, letterSpacing: '0.5px', whiteSpace: 'nowrap', fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stateData
                .filter(s => selectedRegion === 'All Regions' || s.region === selectedRegion)
                .map((state, i) => (
                  <tr key={state.id}
                    onClick={() => setSelectedState(state)}
                    style={{
                      borderBottom: '1px solid #1A2535',
                      background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                      cursor: 'pointer', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,168,224,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'}
                  >
                    <td style={{ padding: '10px 16px', fontWeight: 600, color: '#E2E8F0' }}>{state.name}</td>
                    <td style={{ padding: '10px 16px', color: '#64748B' }}>{state.region}</td>
                    <td style={{ padding: '10px 16px', color: '#00A8E0', fontWeight: 700 }}>{formatPercent(state.att)}</td>
                    <td style={{ padding: '10px 16px', color: '#CD040B' }}>{formatPercent(state.verizon)}</td>
                    <td style={{ padding: '10px 16px', color: '#E20074' }}>{formatPercent(state.tmobile)}</td>
                    <td style={{ padding: '10px 16px', color: '#CC0000' }}>{formatPercent(state.comcast)}</td>
                    <td style={{ padding: '10px 16px', color: '#0072CE' }}>{formatPercent(state.spectrum)}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 6, background: `${getLeaderColor(state.leader)}20`, color: getLeaderColor(state.leader), fontSize: 11, fontWeight: 600 }}>
                        {state.leader}
                      </span>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: state.attOpportunity === 'high' ? 'rgba(239,68,68,0.12)' : state.attOpportunity === 'medium' ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)', color: state.attOpportunity === 'high' ? '#EF4444' : state.attOpportunity === 'medium' ? '#F59E0B' : '#10B981' }}>
                        {state.attOpportunity.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '10px 16px', color: '#10B981', fontWeight: 600 }}>{state.trend}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default USAStateMap;
