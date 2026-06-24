import { useState } from 'react';
import logger from '../../services/LoggingService';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell,
} from 'recharts';
import { CUSTOMER_FEEDBACK, FEEDBACK_CATEGORIES, ATT_IMPROVEMENT_AREAS } from '../../data/feedbackData';

const StarRating = ({ score, color }) => {
  const stars = Math.round(score);
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= stars ? color : '#1E2D45', fontSize: 14 }}>★</span>
      ))}
    </div>
  );
};

const SentimentBar = ({ positive, neutral, negative }) => (
  <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', gap: 1 }}>
    <div style={{ width: `${positive}%`, background: '#10B981' }} />
    <div style={{ width: `${neutral}%`, background: '#F59E0B' }} />
    <div style={{ width: `${negative}%`, background: '#EF4444' }} />
  </div>
);

const RankBadge = ({ rank }) => {
  const colors = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' };
  return (
    <div style={{
      width: 28, height: 28, borderRadius: '50%',
      background: colors[rank] || 'rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, fontWeight: 800, color: rank <= 3 ? '#0A0E1A' : '#94A3B8',
    }}>
      #{rank}
    </div>
  );
};

const FeedbackCard = ({ feedback, isExpanded, onToggle }) => (
  <div
    style={{
      background: 'linear-gradient(145deg, #111C2E, #0D1526)',
      border: `1px solid ${feedback.color}${isExpanded ? '60' : '25'}`,
      borderRadius: 16, padding: '20px 24px', cursor: 'pointer',
      transition: 'all 0.25s ease',
    }}
    onClick={onToggle}
  >
    {/* Header */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
      <RankBadge rank={feedback.rank} />
      <div style={{
        width: 40, height: 40, borderRadius: 10, background: `${feedback.color}20`,
        border: `1px solid ${feedback.color}40`, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 11, fontWeight: 800, color: feedback.color,
      }}>
        {feedback.provider.slice(0, 4).toUpperCase()}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#E2E8F0' }}>{feedback.provider}</div>
        <StarRating score={feedback.overallScore} color={feedback.color} />
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: feedback.color }}>{feedback.overallScore}</div>
        <div style={{ fontSize: 10, color: '#64748B' }}>/ 5.0</div>
      </div>
    </div>

    {/* Key metrics row */}
    <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
      <div style={{ flex: 1, padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
        <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>NPS SCORE</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: feedback.nps >= 0 ? '#10B981' : '#EF4444' }}>
          {feedback.nps >= 0 ? '+' : ''}{feedback.nps}
        </div>
      </div>
      <div style={{ flex: 1, padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
        <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>REVIEWS</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#E2E8F0' }}>{(feedback.totalReviews / 1000).toFixed(0)}K</div>
      </div>
      <div style={{ flex: 2, padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
        <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 4 }}>SENTIMENT</div>
        <SentimentBar {...feedback.sentimentBreakdown} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
          <span style={{ fontSize: 9, color: '#10B981' }}>{feedback.sentimentBreakdown.positive}% Pos</span>
          <span style={{ fontSize: 9, color: '#F59E0B' }}>{feedback.sentimentBreakdown.neutral}% Neu</span>
          <span style={{ fontSize: 9, color: '#EF4444' }}>{feedback.sentimentBreakdown.negative}% Neg</span>
        </div>
      </div>
    </div>

    {isExpanded && (
      <>
        {/* Category breakdown */}
        <div style={{ marginBottom: 16, paddingTop: 12, borderTop: '1px solid #1E2D45' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 12 }}>CATEGORY BREAKDOWN</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FEEDBACK_CATEGORIES.map(cat => {
              const score = feedback.categories[cat.key];
              const pct = (score / 5) * 100;
              return (
                <div key={cat.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>{cat.icon} {cat.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: score >= 4 ? '#10B981' : score >= 3.5 ? '#F59E0B' : '#EF4444' }}>{score.toFixed(1)}</span>
                  </div>
                  <div style={{ height: 4, background: '#1E2D45', borderRadius: 2 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: score >= 4 ? '#10B981' : score >= 3.5 ? '#F59E0B' : '#EF4444', borderRadius: 2, transition: 'width 0.5s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Themes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#10B981', marginBottom: 8, letterSpacing: '0.5px' }}>✅ POSITIVE THEMES</div>
            {feedback.topPositiveThemes.map((t, i) => (
              <div key={i} style={{ fontSize: 11, color: '#94A3B8', padding: '4px 0', borderBottom: '1px solid #1A2535', display: 'flex', gap: 6 }}>
                <span style={{ color: '#10B981', flexShrink: 0 }}>•</span> {t}
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', marginBottom: 8, letterSpacing: '0.5px' }}>⚠️ IMPROVEMENT AREAS</div>
            {feedback.topNegativeThemes.map((t, i) => (
              <div key={i} style={{ fontSize: 11, color: '#94A3B8', padding: '4px 0', borderBottom: '1px solid #1A2535', display: 'flex', gap: 6 }}>
                <span style={{ color: '#EF4444', flexShrink: 0 }}>•</span> {t}
              </div>
            ))}
          </div>
        </div>
      </>
    )}
    <div style={{ textAlign: 'center', marginTop: 10, fontSize: 10, color: '#475569' }}>
      {isExpanded ? '▲ Show less' : '▼ Click for detailed breakdown'}
    </div>
  </div>
);

const CustomerFeedback = () => {
  const [expandedProvider, setExpandedProvider] = useState('AT&T');
  const [activeTab, setActiveTab] = useState('rankings');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    logger.click('CustomerFeedback', 'TAB_CHANGE', { tab });
  };

  const handleCardToggle = (provider) => {
    const next = expandedProvider === provider ? null : provider;
    setExpandedProvider(next);
    logger.click('CustomerFeedback', 'PROVIDER_CARD_EXPAND', { provider, expanded: next !== null });
  };

  const radarData = FEEDBACK_CATEGORIES.map(cat => ({
    subject: cat.label.replace(' ', '\n'),
    ...CUSTOMER_FEEDBACK.reduce((acc, f) => ({ ...acc, [f.provider]: f.categories[cat.key] * 20 }), {}),
  }));

  const trendData = CUSTOMER_FEEDBACK[2].monthlyTrend.map((m, i) => ({
    month: m.month,
    ...CUSTOMER_FEEDBACK.reduce((acc, f) => ({ ...acc, [f.provider]: f.monthlyTrend[i]?.score }), {}),
  }));

  const attImprovements = ATT_IMPROVEMENT_AREAS;

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #1E2D45', paddingBottom: 0 }}>
        {[
          { id: 'rankings', label: '📊 Provider Rankings' },
          { id: 'trends', label: '📈 Satisfaction Trends' },
          { id: 'radar', label: '🎯 Competitive Radar' },
          { id: 'opportunities', label: '💡 AT&T Opportunities' },
        ].map(tab => (
          <button key={tab.id} onClick={() => handleTabChange(tab.id)}
            style={{
              padding: '10px 18px', background: 'transparent', border: 'none',
              borderBottom: `2px solid ${activeTab === tab.id ? '#00A8E0' : 'transparent'}`,
              color: activeTab === tab.id ? '#00A8E0' : '#64748B', cursor: 'pointer',
              fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400, transition: 'all 0.2s', marginBottom: -1,
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Rankings */}
      {activeTab === 'rankings' && (
        <div>
          <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(0,168,224,0.06)', border: '1px solid rgba(0,168,224,0.15)', borderRadius: 10 }}>
            <span style={{ fontSize: 13, color: '#94A3B8' }}>
              Showing <strong style={{ color: '#00A8E0' }}>Top 5 telecom providers</strong> ranked by overall customer satisfaction score. Data aggregated from 1.3M+ verified reviews.
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CUSTOMER_FEEDBACK.map(f => (
              <FeedbackCard
                key={f.provider}
                feedback={f}
                isExpanded={expandedProvider === f.provider}
                onToggle={() => handleCardToggle(f.provider)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab: Trends */}
      {activeTab === 'trends' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'linear-gradient(145deg, #111C2E, #0D1526)', border: '1px solid #1E2D45', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#E2E8F0', marginBottom: 4 }}>Customer Satisfaction Score — 12 Month Trend</div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 20 }}>Monthly average rating (out of 5.0) across all verified reviews</div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
                <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} stroke="#1E2D45" />
                <YAxis domain={[2.5, 4.5]} tick={{ fill: '#64748B', fontSize: 11 }} stroke="#1E2D45" tickFormatter={v => v.toFixed(1)} />
                <Tooltip contentStyle={{ background: '#0D1526', border: '1px solid #1E2D45', borderRadius: 8, fontSize: 12 }} formatter={(v) => [v?.toFixed(2), '']} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
                {CUSTOMER_FEEDBACK.map(f => (
                  <Line key={f.provider} type="monotone" dataKey={f.provider} stroke={f.color} strokeWidth={f.provider === 'AT&T' ? 3 : 1.5} dot={false} strokeDasharray={f.provider === 'AT&T' ? 'none' : f.rank > 3 ? '5 3' : 'none'} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab: Radar */}
      {activeTab === 'radar' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: 'linear-gradient(145deg, #111C2E, #0D1526)', border: '1px solid #1E2D45', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#E2E8F0', marginBottom: 4 }}>Category Comparison Radar</div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 16 }}>Score out of 100 across 6 key dimensions</div>
            <ResponsiveContainer width="100%" height={340}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1E2D45" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                {CUSTOMER_FEEDBACK.slice(0, 3).map(f => (
                  <Radar key={f.provider} name={f.provider} dataKey={f.provider} stroke={f.color} fill={f.color} fillOpacity={0.1} strokeWidth={2} />
                ))}
                <Legend wrapperStyle={{ fontSize: 11, color: '#94A3B8' }} />
                <Tooltip contentStyle={{ background: '#0D1526', border: '1px solid #1E2D45', borderRadius: 8, fontSize: 11 }} formatter={(v) => [`${(v / 20).toFixed(1)}/5.0`, '']} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: 'linear-gradient(145deg, #111C2E, #0D1526)', border: '1px solid #1E2D45', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#E2E8F0', marginBottom: 4 }}>NPS Score Comparison</div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 16 }}>Net Promoter Score — higher is better</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={CUSTOMER_FEEDBACK.map(f => ({ name: f.provider, nps: f.nps, fill: f.color }))} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" horizontal={false} />
                <XAxis type="number" domain={[-15, 30]} tick={{ fill: '#64748B', fontSize: 10 }} stroke="transparent" />
                <YAxis dataKey="name" type="category" tick={{ fill: '#94A3B8', fontSize: 11 }} stroke="transparent" width={80} />
                <Tooltip formatter={(v) => [v, 'NPS']} contentStyle={{ background: '#0D1526', border: '1px solid #1E2D45', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="nps" radius={[0, 3, 3, 0]}>
                  {CUSTOMER_FEEDBACK.map((f, i) => <Cell key={i} fill={f.nps >= 0 ? f.color : '#EF4444'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(0,168,224,0.06)', border: '1px solid rgba(0,168,224,0.15)', borderRadius: 10, fontSize: 12, color: '#94A3B8' }}>
              <strong style={{ color: '#00A8E0' }}>AT&T NPS gap:</strong> T-Mobile leads by 10 points. Closing this gap could drive <strong style={{ color: '#10B981' }}>$4B+ annual revenue</strong> through reduced churn.
            </div>
          </div>
        </div>
      )}

      {/* Tab: AT&T Opportunities */}
      {activeTab === 'opportunities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: '14px 18px', background: 'rgba(0,168,224,0.08)', border: '1px solid rgba(0,168,224,0.2)', borderRadius: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#00A8E0', marginBottom: 4 }}>Strategic Insight for AT&T Leadership</div>
            <div style={{ fontSize: 13, color: '#94A3B8' }}>Based on customer feedback analysis, these are the highest-priority improvement areas to close the satisfaction gap with T-Mobile and Verizon.</div>
          </div>
          {attImprovements.map((item, i) => (
            <div key={i} style={{
              background: 'linear-gradient(145deg, #111C2E, #0D1526)', border: '1px solid #1E2D45',
              borderRadius: 16, padding: 24,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: item.priority === 'Critical' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', color: item.priority === 'Critical' ? '#EF4444' : '#F59E0B' }}>{item.priority.toUpperCase()}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#E2E8F0' }}>{item.area}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#94A3B8' }}>{item.action}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#64748B', marginBottom: 2 }}>EST. REVENUE IMPACT</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#10B981' }}>{item.revenue_impact}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: '#64748B' }}>Current: <strong style={{ color: '#EF4444' }}>{item.currentScore.toFixed(1)}</strong></span>
                    <span style={{ fontSize: 11, color: '#64748B' }}>Gap: <strong style={{ color: '#F59E0B' }}>+{item.gap.toFixed(1)}</strong></span>
                    <span style={{ fontSize: 11, color: '#64748B' }}>Target: <strong style={{ color: '#10B981' }}>{item.targetScore.toFixed(1)}</strong></span>
                  </div>
                  <div style={{ height: 8, background: '#1E2D45', borderRadius: 4, position: 'relative' }}>
                    <div style={{ height: '100%', width: `${(item.currentScore / 5) * 100}%`, background: '#EF4444', borderRadius: 4 }} />
                    <div style={{
                      position: 'absolute', top: 0, left: `${(item.currentScore / 5) * 100}%`,
                      width: `${(item.gap / 5) * 100}%`, height: '100%',
                      background: 'repeating-linear-gradient(90deg, #F59E0B40 0px, #F59E0B40 4px, transparent 4px, transparent 8px)',
                    }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerFeedback;
