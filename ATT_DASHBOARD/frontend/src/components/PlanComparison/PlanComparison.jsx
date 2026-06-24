import { useState } from 'react';
import logger from '../../services/LoggingService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { WIRELESS_PLANS, BROADBAND_PLANS } from '../../data/planData';

const CheckIcon = ({ available }) => (
  <span style={{ color: available ? '#10B981' : '#374151', fontSize: 14 }}>
    {available ? '✓' : '—'}
  </span>
);

const PriceBadge = ({ price, isATT }) => (
  <div style={{
    fontSize: 22, fontWeight: 800,
    color: isATT ? '#00A8E0' : '#E2E8F0',
  }}>
    ${price}
    <span style={{ fontSize: 11, fontWeight: 400, color: '#64748B' }}>/mo</span>
  </div>
);

const FeatureBadge = ({ text, highlight }) => (
  <span style={{
    padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600,
    background: highlight ? 'rgba(0,168,224,0.12)' : 'rgba(255,255,255,0.04)',
    color: highlight ? '#00A8E0' : '#94A3B8',
    border: `1px solid ${highlight ? 'rgba(0,168,224,0.3)' : '#1E2D45'}`,
  }}>
    {text}
  </span>
);

const PlanCard = ({ plan, color, isATT }) => (
  <div style={{
    background: plan.recommended
      ? 'linear-gradient(145deg, #0D1E30, #091628)'
      : 'linear-gradient(145deg, #111C2E, #0D1526)',
    border: `1px solid ${plan.recommended ? color : '#1E2D45'}`,
    borderRadius: 14, padding: '18px 20px',
    position: 'relative', overflow: 'hidden',
    flex: '1', minWidth: 160,
    transition: 'transform 0.2s',
  }}
    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
  >
    {plan.badge && (
      <div style={{
        position: 'absolute', top: 10, right: 10,
        padding: '2px 8px', borderRadius: 20, fontSize: 9, fontWeight: 700,
        background: plan.recommended ? color : 'rgba(255,255,255,0.08)',
        color: plan.recommended ? '#fff' : '#94A3B8',
        letterSpacing: '0.5px',
      }}>{plan.badge}</div>
    )}
    <div style={{ fontSize: 12, fontWeight: 700, color: '#E2E8F0', marginBottom: 4, paddingRight: 60 }}>{plan.name}</div>
    <PriceBadge price={plan.price} isATT={isATT} />
    <div style={{ fontSize: 9, color: '#475569', marginBottom: 12 }}>{plan.priceUnit}</div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {[
        { label: '📶 Data', value: plan.data },
        { label: '📡 Hotspot', value: plan.hotspot || plan.speed || 'N/A' },
        { label: '📺 Streaming', value: plan.streams || plan.type || '' },
        { label: '🌐 Network', value: plan.network || plan.contract || '' },
        { label: '✈️ Intl', value: plan.international || plan.installation || '' },
      ].map(item => item.value && (
        <div key={item.label} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 10, color: '#475569', flexShrink: 0, width: 64 }}>{item.label}</span>
          <span style={{ fontSize: 10, color: '#94A3B8', wordBreak: 'break-word' }}>{item.value}</span>
        </div>
      ))}
    </div>

    {plan.perks && plan.perks.length > 0 && (
      <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #1E2D45' }}>
        <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, marginBottom: 6, letterSpacing: '0.5px' }}>INCLUDED PERKS</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {plan.perks.slice(0, 3).map((p, i) => (
            <FeatureBadge key={i} text={p.length > 25 ? p.slice(0, 22) + '...' : p} highlight={isATT && i === 0} />
          ))}
        </div>
      </div>
    )}
  </div>
);

const ProviderSection = ({ provider }) => (
  <div style={{
    background: 'linear-gradient(145deg, #111C2E, #0D1526)',
    border: `2px solid ${provider.isATT ? provider.color + '50' : '#1E2D45'}`,
    borderRadius: 16, overflow: 'hidden', marginBottom: 16,
  }}>
    <div style={{
      padding: '14px 20px',
      background: provider.isATT ? `linear-gradient(90deg, ${provider.color}15, transparent)` : 'transparent',
      borderBottom: '1px solid #1E2D45',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        padding: '4px 12px', borderRadius: 8, fontSize: 13, fontWeight: 800,
        background: `${provider.color}20`, color: provider.color,
        border: `1px solid ${provider.color}40`,
      }}>{provider.provider}</div>
      {provider.isATT && (
        <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', background: 'rgba(16,185,129,0.12)', padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(16,185,129,0.25)' }}>
          ← OUR COMPANY
        </span>
      )}
    </div>
    <div style={{ padding: '16px 20px' }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {provider.plans.map((plan, i) => (
          <PlanCard key={i} plan={plan} color={provider.color} isATT={provider.isATT} />
        ))}
      </div>
    </div>
  </div>
);

const ComparisonTable = ({ plans, type }) => {
  const allPlans = plans.flatMap(p =>
    p.plans.map(plan => ({ ...plan, provider: p.provider, color: p.color, isATT: p.isATT }))
  );

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #1E2D45' }}>
            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontWeight: 600, position: 'sticky', left: 0, background: '#0A1020', zIndex: 1, minWidth: 140 }}>Plan</th>
            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontWeight: 600, minWidth: 100 }}>Provider</th>
            <th style={{ padding: '12px 16px', textAlign: 'right', color: '#64748B', fontWeight: 600 }}>Price</th>
            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontWeight: 600 }}>{type === 'wireless' ? 'Data' : 'Speed'}</th>
            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontWeight: 600 }}>{type === 'wireless' ? 'Hotspot' : 'Type'}</th>
            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontWeight: 600 }}>Network/Contract</th>
            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontWeight: 600 }}>Highlight</th>
          </tr>
        </thead>
        <tbody>
          {allPlans.sort((a, b) => a.price - b.price).map((plan, i) => (
            <tr key={i}
              style={{
                borderBottom: '1px solid #1A2535',
                background: plan.isATT ? 'rgba(0,168,224,0.05)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
              }}
            >
              <td style={{ padding: '10px 16px', fontWeight: 600, color: plan.isATT ? '#00A8E0' : '#E2E8F0', position: 'sticky', left: 0, background: plan.isATT ? 'rgba(0,50,80,0.9)' : '#0A1020', zIndex: 1 }}>
                {plan.name}
                {plan.recommended && <span style={{ marginLeft: 6, fontSize: 9, color: '#10B981' }}>★ BEST</span>}
              </td>
              <td style={{ padding: '10px 16px' }}>
                <span style={{ color: plan.color, fontWeight: 600, fontSize: 11 }}>{plan.provider}</span>
              </td>
              <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: plan.isATT ? '#00A8E0' : '#E2E8F0' }}>${plan.price}/mo</td>
              <td style={{ padding: '10px 16px', color: '#94A3B8' }}>{plan.data || plan.speed}</td>
              <td style={{ padding: '10px 16px', color: '#94A3B8' }}>{plan.hotspot || plan.type}</td>
              <td style={{ padding: '10px 16px', color: '#94A3B8', fontSize: 11 }}>{plan.network || plan.contract}</td>
              <td style={{ padding: '10px 16px' }}>
                {plan.badge && <FeatureBadge text={plan.badge} highlight={plan.recommended} />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PlanComparison = () => {
  const [planType, setPlanType] = useState('wireless');
  const [viewMode, setViewMode] = useState('cards');

  const plans = planType === 'wireless' ? WIRELESS_PLANS : BROADBAND_PLANS;

  const priceCompareData = plans.flatMap(p =>
    p.plans.map(plan => ({ name: `${p.provider}\n${plan.name.split(' ').slice(-1)[0]}`, price: plan.price, provider: p.provider, color: p.color }))
  ).sort((a, b) => a.price - b.price);

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4, padding: 4, background: '#0D1526', borderRadius: 10, border: '1px solid #1E2D45' }}>
          {[
            { id: 'wireless', icon: '📱', label: 'Wireless Plans' },
            { id: 'broadband', icon: '🏠', label: 'Broadband Plans' },
          ].map(t => (
            <button key={t.id} onClick={() => { setPlanType(t.id); logger.click('PlanComparison', 'PLAN_TYPE', { type: t.id }); }}
              style={{
                padding: '8px 18px', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: planType === t.id ? 'linear-gradient(135deg, rgba(0,168,224,0.2), rgba(0,87,166,0.2))' : 'transparent',
                border: `1px solid ${planType === t.id ? '#00A8E0' : 'transparent'}`,
                color: planType === t.id ? '#00A8E0' : '#64748B', transition: 'all 0.2s',
              }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {[
            { id: 'cards', label: '⊞ Cards' },
            { id: 'table', label: '☰ Table' },
            { id: 'chart', label: '📊 Chart' },
          ].map(m => (
            <button key={m.id} onClick={() => { setViewMode(m.id); logger.click('PlanComparison', 'VIEW_MODE', { mode: m.id }); }}
              style={{
                padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12,
                background: viewMode === m.id ? 'rgba(0,168,224,0.15)' : 'transparent',
                border: `1px solid ${viewMode === m.id ? '#00A8E0' : '#1E2D45'}`,
                color: viewMode === m.id ? '#00A8E0' : '#64748B',
              }}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* AT&T vs Competition summary */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12,
      }}>
        {[
          { label: 'AT&T Best Plan', value: planType === 'wireless' ? '$85/mo' : '$180/mo', sub: 'Premium unlimited', color: '#00A8E0' },
          { label: 'Cheapest Competitor', value: planType === 'wireless' ? '$29/mo' : '$30/mo', sub: 'Spectrum Basic', color: '#0072CE' },
          { label: 'Plans Compared', value: plans.reduce((s, p) => s + p.plans.length, 0), sub: `Across ${plans.length} providers`, color: '#F59E0B' },
          { label: 'AT&T Value Rank', value: planType === 'wireless' ? '#3 / 5' : '#2 / 5', sub: 'By value for money', color: '#10B981' },
        ].map(item => (
          <div key={item.label} style={{
            background: 'linear-gradient(145deg, #111C2E, #0D1526)', border: `1px solid ${item.color}25`, borderRadius: 12, padding: '16px 18px',
          }}>
            <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: item.color }}>{item.value}</div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Cards view */}
      {viewMode === 'cards' && (
        <div>
          {plans.map(p => <ProviderSection key={p.provider} provider={p} />)}
        </div>
      )}

      {/* Table view */}
      {viewMode === 'table' && (
        <div style={{ background: 'linear-gradient(145deg, #111C2E, #0D1526)', border: '1px solid #1E2D45', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #1E2D45' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0' }}>Complete Plan Comparison — {planType === 'wireless' ? 'Wireless' : 'Broadband'}</div>
            <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>AT&T plans highlighted in blue • Sorted by price</div>
          </div>
          <ComparisonTable plans={plans} type={planType} />
        </div>
      )}

      {/* Chart view */}
      {viewMode === 'chart' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'linear-gradient(145deg, #111C2E, #0D1526)', border: '1px solid #1E2D45', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#E2E8F0', marginBottom: 4 }}>Plan Price Comparison</div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 20 }}>Monthly cost per plan across all providers</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceCompareData} margin={{ bottom: 60, left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 9 }} stroke="#1E2D45" angle={-45} textAnchor="end" height={80} interval={0} />
                <YAxis tickFormatter={v => `$${v}`} tick={{ fill: '#64748B', fontSize: 11 }} stroke="#1E2D45" />
                <Tooltip formatter={(v) => [`$${v}/mo`, 'Price']} contentStyle={{ background: '#0D1526', border: '1px solid #1E2D45', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="price" radius={[3, 3, 0, 0]}>
                  {priceCompareData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={entry.provider === 'AT&T' ? 1 : 0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Key differences AT&T vs competitors */}
          <div style={{ background: 'linear-gradient(145deg, #111C2E, #0D1526)', border: '1px solid #1E2D45', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#E2E8F0', marginBottom: 16 }}>AT&T Competitive Advantages vs Key Rivals</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { vs: 'vs Verizon', pros: ['Lower entry price', 'Better fiber availability', 'FirstNet priority for safety'], cons: ['Lower NPS score', 'Less international coverage', 'Smaller 5G UW footprint'] },
                { vs: 'vs T-Mobile', pros: ['Better enterprise solutions', 'Superior rural FirstNet coverage', 'More fiber broadband options'], cons: ['Higher price points', 'Lower customer satisfaction', 'Less transparent pricing'] },
                { vs: 'vs Comcast', pros: ['True wireless mobile service', 'Better 5G network', 'No equipment rental fees', 'Better rural coverage'], cons: ['Higher broadband prices in some markets', 'Less TV content bundling', 'Smaller broadband footprint in midwest'] },
              ].map(item => (
                <div key={item.vs} style={{ padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2D45', borderRadius: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#00A8E0', marginBottom: 12 }}>{item.vs}</div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: '#10B981', fontWeight: 700, marginBottom: 6 }}>AT&T ADVANTAGES</div>
                    {item.pros.map((p, i) => <div key={i} style={{ fontSize: 11, color: '#94A3B8', marginBottom: 3, display: 'flex', gap: 6 }}><span style={{ color: '#10B981' }}>+</span>{p}</div>)}
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#EF4444', fontWeight: 700, marginBottom: 6 }}>AREAS TO IMPROVE</div>
                    {item.cons.map((c, i) => <div key={i} style={{ fontSize: 11, color: '#94A3B8', marginBottom: 3, display: 'flex', gap: 6 }}><span style={{ color: '#EF4444' }}>−</span>{c}</div>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanComparison;
