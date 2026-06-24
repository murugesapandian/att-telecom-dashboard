import { useEffect } from 'react';
import logger from '../../services/LoggingService';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts';
import { useKPIMetrics, useRealtimeSubscriberFeed } from '../../hooks/useRealTimeData';
import { getATTLeadingStates, getATTOpportunityStates } from '../../data/stateProviderData';
import { formatNumber, formatPercent } from '../../utils/formatters';

const MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 29.8, subscribers: 131 }, { month: 'Feb', revenue: 30.1, subscribers: 132 },
  { month: 'Mar', revenue: 30.4, subscribers: 133 }, { month: 'Apr', revenue: 29.9, subscribers: 132 },
  { month: 'May', revenue: 30.6, subscribers: 134 }, { month: 'Jun', revenue: 30.9, subscribers: 135 },
  { month: 'Jul', revenue: 30.2, subscribers: 134 }, { month: 'Aug', revenue: 30.7, subscribers: 135 },
  { month: 'Sep', revenue: 31.1, subscribers: 136 }, { month: 'Oct', revenue: 30.8, subscribers: 135 },
  { month: 'Nov', revenue: 31.3, subscribers: 136 }, { month: 'Dec', revenue: 30.1, subscribers: 134.5 },
];

const NATIONAL_SHARE = [
  { name: 'AT&T', value: 27.2, color: '#00A8E0' },
  { name: 'Verizon', value: 28.4, color: '#CD040B' },
  { name: 'T-Mobile', value: 24.1, color: '#E20074' },
  { name: 'Comcast', value: 5.1, color: '#CC0000' },
  { name: 'Charter', value: 3.2, color: '#0072CE' },
  { name: 'Others', value: 12.0, color: '#374151' },
];

const KPICard = ({ label, value, subValue, trend, icon, color, description }) => (
  <div style={{
    background: 'linear-gradient(145deg, #111C2E, #0D1526)',
    border: `1px solid ${color}30`,
    borderRadius: 16,
    padding: '20px 24px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px ${color}20`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
  >
    <div style={{
      position: 'absolute', top: -20, right: -20, width: 100, height: 100,
      borderRadius: '50%', background: `${color}10`,
    }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 22 }}>{icon}</div>
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, color: '#F1F5F9', marginBottom: 4, letterSpacing: '-0.5px' }}>{value}</div>
    {subValue && <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8 }}>{subValue}</div>}
    {trend && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ color: trend.startsWith('+') ? '#10B981' : '#EF4444', fontSize: 12, fontWeight: 600 }}>{trend}</span>
        <span style={{ fontSize: 11, color: '#64748B' }}>vs last quarter</span>
      </div>
    )}
    {description && <div style={{ fontSize: 11, color: '#64748B', marginTop: 6 }}>{description}</div>}
    <div style={{ position: 'absolute', bottom: 0, left: 0, height: 2, width: '40%', background: `linear-gradient(90deg, ${color}, transparent)` }} />
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0D1526', border: '1px solid #1E2D45', borderRadius: 10, padding: '12px 16px' }}>
      <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 13, color: p.color, fontWeight: 600 }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
          {p.name === 'revenue' ? 'B' : p.name === 'subscribers' ? 'M' : ''}
        </div>
      ))}
    </div>
  );
};

const OverviewDashboard = () => {
  const metrics = useKPIMetrics();
  const feed = useRealtimeSubscriberFeed();
  const attLeadingStates = getATTLeadingStates();
  const opportunityStates = getATTOpportunityStates();

  useEffect(() => {
    logger.dataLoad('OverviewDashboard', attLeadingStates.length + opportunityStates.length, 0);
  }, []);

  const regionData = [
    { region: 'South', att: 38, verizon: 20, tmobile: 18 },
    { region: 'Southeast', att: 35, verizon: 22, tmobile: 19 },
    { region: 'Midwest', att: 21, verizon: 27, tmobile: 21 },
    { region: 'Northeast', att: 16, verizon: 32, tmobile: 20 },
    { region: 'Pacific', att: 21, verizon: 21, tmobile: 26 },
    { region: 'Mountain', att: 18, verizon: 21, tmobile: 29 },
    { region: 'Southwest', att: 29, verizon: 21, tmobile: 24 },
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <KPICard
          label="Total Subscribers" icon="👥"
          value={formatNumber(metrics.totalSubscribers)}
          subValue="Wireless + Fiber"
          trend="+1.8%"
          color="#00A8E0"
        />
        <KPICard
          label="National Market Share" icon="📈"
          value={formatPercent(metrics.attMarketShare)}
          subValue="Wireless subscribers"
          trend="+0.3%"
          color="#10B981"
        />
        <KPICard
          label="States AT&T Leads" icon="🏆"
          value={`${attLeadingStates.length} / 51`}
          subValue="Including DC"
          description="Opportunity: 28 states"
          color="#F59E0B"
        />
        <KPICard
          label="Fiber Subscribers" icon="🔗"
          value={formatNumber(metrics.fiberSubscribers)}
          subValue="AT&T Fiber + DSL"
          trend="+12.4%"
          color="#8B5CF6"
        />
        <KPICard
          label="Quarterly Revenue" icon="💰"
          value={`$${metrics.revenueQ.toFixed(1)}B`}
          subValue="Wireless services"
          trend="+3.2%"
          color="#00A8E0"
        />
        <KPICard
          label="Network Uptime" icon="📡"
          value={`${metrics.networkUptime.toFixed(2)}%`}
          subValue="5G + LTE combined"
          trend="+0.02%"
          color="#10B981"
        />
        <KPICard
          label="Churn Rate" icon="📉"
          value={`${metrics.churnRate.toFixed(2)}%`}
          subValue="Monthly postpaid"
          trend="-0.08%"
          color="#EF4444"
        />
        <KPICard
          label="Opportunity States" icon="🎯"
          value={opportunityStates.length}
          subValue="High AT&T growth potential"
          description="Target: 28 states"
          color="#E20074"
        />
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Revenue Trend */}
        <div style={{
          background: 'linear-gradient(145deg, #111C2E, #0D1526)',
          border: '1px solid #1E2D45', borderRadius: 16, padding: 24,
        }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#E2E8F0' }}>Revenue & Subscriber Trend</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>12-month AT&T performance</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_REVENUE}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00A8E0" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00A8E0" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="subGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
              <XAxis dataKey="month" stroke="#475569" tick={{ fill: '#64748B', fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fill: '#64748B', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
              <Area type="monotone" dataKey="revenue" name="Revenue ($B)" stroke="#00A8E0" strokeWidth={2} fill="url(#revenueGrad)" dot={false} />
              <Area type="monotone" dataKey="subscribers" name="Subscribers (M)" stroke="#10B981" strokeWidth={2} fill="url(#subGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* National Market Share */}
        <div style={{
          background: 'linear-gradient(145deg, #111C2E, #0D1526)',
          border: '1px solid #1E2D45', borderRadius: 16, padding: 24,
        }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#E2E8F0' }}>National Market Share</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Wireless subscribers</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={NATIONAL_SHARE} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                dataKey="value" paddingAngle={2}>
                {NATIONAL_SHARE.map((e, i) => (
                  <Cell key={i} fill={e.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v}%`, n]} contentStyle={{ background: '#0D1526', border: '1px solid #1E2D45', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {NATIONAL_SHARE.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                <span style={{ color: '#94A3B8' }}>{s.name} <span style={{ color: s.color, fontWeight: 600 }}>{s.value}%</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Regional Breakdown */}
        <div style={{
          background: 'linear-gradient(145deg, #111C2E, #0D1526)',
          border: '1px solid #1E2D45', borderRadius: 16, padding: 24,
        }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#E2E8F0' }}>Regional Market Share</div>
            <div style={{ fontSize: 12, color: '#64748B' }}>Top 3 carriers by US region</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={regionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" horizontal={false} />
              <XAxis type="number" domain={[0, 50]} tick={{ fill: '#64748B', fontSize: 10 }} stroke="#1E2D45" />
              <YAxis dataKey="region" type="category" tick={{ fill: '#94A3B8', fontSize: 11 }} stroke="transparent" width={70} />
              <Tooltip contentStyle={{ background: '#0D1526', border: '1px solid #1E2D45', borderRadius: 8 }} />
              <Bar dataKey="att" name="AT&T" fill="#00A8E0" radius={[0, 2, 2, 0]} />
              <Bar dataKey="verizon" name="Verizon" fill="#CD040B" radius={[0, 2, 2, 0]} />
              <Bar dataKey="tmobile" name="T-Mobile" fill="#E20074" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Live Event Feed */}
        <div style={{
          background: 'linear-gradient(145deg, #111C2E, #0D1526)',
          border: '1px solid #1E2D45', borderRadius: 16, padding: 24, overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#E2E8F0' }}>Live Activity Feed</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 10, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontSize: 9, color: '#10B981', fontWeight: 700 }}>LIVE</span>
            </div>
          </div>
          <div style={{ height: 240, overflowY: 'auto' }}>
            {feed.map(event => (
              <div key={event.id} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                borderBottom: '1px solid #1E2D45', animation: 'fadeIn 0.3s ease',
              }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(0,168,224,0.12)', border: '1px solid rgba(0,168,224,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#00A8E0', fontWeight: 700, flexShrink: 0 }}>
                  {event.state}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: '#E2E8F0', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.action}</div>
                  <div style={{ fontSize: 10, color: '#64748B' }}>{event.service}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>{event.value}</div>
                  <div style={{ fontSize: 10, color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>{event.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;
