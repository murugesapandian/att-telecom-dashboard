import React, { useState } from 'react';
import logger from '../../services/LoggingService';

const SECTION = ({ title, children, color = '#00A8E0', icon }) => (
  <div style={{
    background: 'rgba(255,255,255,0.03)',
    border: `1px solid ${color}30`,
    borderRadius: 12, padding: '20px 24px', marginBottom: 20,
  }}>
    <h3 style={{ color, margin: '0 0 14px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 20 }}>{icon}</span> {title}
    </h3>
    {children}
  </div>
);

const Row = ({ label, value, badge, badgeColor = '#EF4444' }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', gap: 16,
    padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
  }}>
    <div style={{ width: 180, flexShrink: 0, color: '#94A3B8', fontSize: 13 }}>{label}</div>
    <div style={{ flex: 1, color: '#CBD5E1', fontSize: 13 }}>
      {value}
      {badge && (
        <span style={{
          marginLeft: 10, background: `${badgeColor}22`,
          color: badgeColor, border: `1px solid ${badgeColor}44`,
          borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 700,
        }}>
          {badge}
        </span>
      )}
    </div>
  </div>
);

export default function DataDisclaimer() {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    logger.click('DataDisclaimer', 'TOGGLE', { expanded: next });
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0A0E1A 0%, #0F1629 100%)',
      minHeight: '100%', padding: '32px 40px', color: '#E2E8F0',
    }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #FF6B0015, #FF6B0005)',
        border: '1px solid #FF6B0066',
        borderRadius: 16, padding: '20px 28px', marginBottom: 32,
        display: 'flex', alignItems: 'flex-start', gap: 20,
      }}>
        <span style={{ fontSize: 40, flexShrink: 0 }}>⚠️</span>
        <div>
          <h2 style={{ color: '#FF6B00', margin: '0 0 10px', fontSize: 20 }}>
            Data Source Transparency — Important Disclosure
          </h2>
          <p style={{ color: '#94A3B8', margin: 0, lineHeight: 1.7, fontSize: 14 }}>
            This dashboard is a <strong style={{ color: '#E2E8F0' }}>proof-of-concept prototype</strong> built
            for strategic demonstration purposes. <strong style={{ color: '#FF6B00' }}>No data shown here
            is sourced from AT&T internal systems, live APIs, or verified market intelligence feeds.</strong>{' '}
            All market share figures, customer feedback scores, NPS values, plan prices, and real-time activity
            events are <strong style={{ color: '#E2E8F0' }}>illustrative estimates or algorithmically
            simulated values</strong>. They are intended to demonstrate product vision and dashboard capabilities,
            not to inform business decisions.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Left column */}
        <div>
          <SECTION title="Market Share Data (50 States)" icon="🗺️" color="#00A8E0">
            <Row label="Source file"         value="src/data/stateProviderData.js" badge="SIMULATED" />
            <Row label="Data origin"         value="Manually estimated percentages based on general public knowledge, analyst reports (OpenSignal, Ookla), and FCC broadband deployment maps as of early 2025. Not derived from AT&T internal CRM or billing data." />
            <Row label="Update frequency"    value="Static base values refreshed every 3 seconds with ±0.8% random noise (Math.random() in useRealTimeData.js)" badge="RANDOM NOISE" />
            <Row label="Coverage"            value="All 50 US states + Washington D.C." badge="COMPLETE" badgeColor="#22C55E" />
            <Row label="For production"      value="AT&T internal BI systems, FCC Broadband Data Collection API, CTIA Wireless Industry Statistics" />
          </SECTION>

          <SECTION title="Real-Time Activity Feed" icon="⚡" color="#FF6B00">
            <Row label="Source hook"         value="src/hooks/useRealTimeData.js — useRealtimeSubscriberFeed()" badge="FAKE EVENTS" />
            <Row label="Mechanism"           value="setInterval firing every 1,800ms generates random subscriber events from hardcoded arrays of city names, plan types, and event types (signup, churn, upgrade, issue)." />
            <Row label="Events are real?"    value="NO. Every 'New signup in Dallas' or 'Fiber upgrade in Atlanta' is a randomly composed string. No actual subscriber transactions." badge="NOT REAL" />
            <Row label="KPI metrics"         value="Total subscribers, revenue, data usage, and satisfaction scores are hardcoded baseline values with ±random drift applied on each 2,500ms tick." />
            <Row label="For production"      value="AT&T OSS/BSS event streams via Kafka, subscriber management APIs (SMAPI), revenue assurance systems" />
          </SECTION>
        </div>

        {/* Right column */}
        <div>
          <SECTION title="Customer Feedback & NPS" icon="💬" color="#8B5CF6">
            <Row label="Source file"         value="src/data/feedbackData.js" badge="ILLUSTRATIVE" />
            <Row label="NPS scores"          value="Illustrative values based on publicly reported J.D. Power rankings and Consumer Reports surveys (not real AT&T survey data)" />
            <Row label="Sentiment analysis"  value="Backend SentimentAnalysisService.java uses a hardcoded keyword map (NOT an ML model, NOT trained on real reviews)" />
            <Row label="Trend data"          value="Monthly trend lines are linear interpolations from manually set start/end points with added noise" />
            <Row label="Feedback volume"     value="Hardcoded counts (e.g., '52,341 reviews') — not connected to any review platform (Trustpilot, App Store, Google Play)" />
            <Row label="For production"      value="AT&T VoC (Voice of Customer) platform, Qualtrics NPS feeds, Google Play / App Store review APIs, Medallia integration" />
          </SECTION>

          <SECTION title="Plan Pricing Data" icon="💰" color="#22C55E">
            <Row label="Source file"         value="src/data/planData.js" badge="STATIC" badgeColor="#F59E0B" />
            <Row label="Data origin"         value="Publicly available pricing from provider websites (att.com, verizon.com, t-mobile.com, comcast.com, spectrum.com) as of knowledge cutoff (early 2025). Prices change frequently." />
            <Row label="Live pricing?"       value="NO. Prices are hardcoded. No connections to AT&T OPUS pricing engine or competitor scraping." badge="NOT LIVE" />
            <Row label="For production"      value="AT&T Product Catalog API (OPUS), competitor price monitoring services (Crayon, Klue), public FCC broadband availability maps" />
          </SECTION>

          <SECTION title="What IS Real" icon="✅" color="#22C55E">
            <Row label="US state boundaries" value="TopoJSON from cdn.jsdelivr.net/npm/us-atlas@3 — this is the official US Census Bureau cartographic boundary data." badge="REAL DATA" badgeColor="#22C55E" />
            <Row label="State FIPS codes"    value="Official FIPS 5-2 state codes from NIST — used for map rendering." badge="REAL" badgeColor="#22C55E" />
            <Row label="State populations"   value="US Census Bureau 2023 population estimates, used for subscriber density calculations." badge="REAL" badgeColor="#22C55E" />
            <Row label="Architecture"        value="Spring Boot microservices, Kafka topics, WebSocket infrastructure — all real and production-capable." badge="REAL" badgeColor="#22C55E" />
            <Row label="Logging system"      value="End-to-end logging (this session's frontend LoggingService + backend LoggingAspect) captures real user interactions in real time." badge="REAL" badgeColor="#22C55E" />
          </SECTION>
        </div>
      </div>

      {/* Architecture pipeline */}
      <SECTION title="Data Pipeline: Current vs. Production Vision" icon="🏗️" color="#00A8E0">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <p style={{ color: '#64748B', fontWeight: 700, fontSize: 12, marginBottom: 12, letterSpacing: 1 }}>
              CURRENT (PROTOTYPE)
            </p>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748B', lineHeight: 2 }}>
              <div>Browser</div>
              <div>  └── useRealTimeData.js (setInterval + Math.random)</div>
              <div>        └── In-memory state (no backend)</div>
              <div></div>
              <div>React Components</div>
              <div>  └── stateProviderData.js (static JSON)</div>
              <div>  └── feedbackData.js (static JSON)</div>
              <div>  └── planData.js (static JSON)</div>
            </div>
          </div>
          <div>
            <p style={{ color: '#22C55E', fontWeight: 700, fontSize: 12, marginBottom: 12, letterSpacing: 1 }}>
              PRODUCTION TARGET
            </p>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748B', lineHeight: 2 }}>
              <div style={{ color: '#22C55E' }}>AT&T OSS/BSS  →  Kafka topics</div>
              <div>  ├── att.subscriber.events (real-time signups/churns)</div>
              <div>  ├── att.revenue.stream (billing events)</div>
              <div>  └── att.network.metrics (usage/performance)</div>
              <div></div>
              <div style={{ color: '#22C55E' }}>event-streaming-service  →  WebSocket</div>
              <div>  └── React Dashboard (live push, no polling)</div>
              <div></div>
              <div style={{ color: '#22C55E' }}>External APIs</div>
              <div>  ├── FCC Broadband Data Collection API</div>
              <div>  ├── AT&T VoC / Qualtrics NPS feed</div>
              <div>  └── AT&T Product Catalog API (OPUS)</div>
            </div>
          </div>
        </div>
      </SECTION>

      <div style={{
        textAlign: 'center', padding: '20px 0 0',
        color: '#334155', fontSize: 12,
      }}>
        Last reviewed: June 2026 · AT&T Business & Strategy Team · Internal Prototype v1.0
      </div>
    </div>
  );
}
