import React, { useState, useEffect } from 'react';
import { formatDate } from '../../utils/formatters';

const Header = ({ title, subtitle, lastUpdated, isLive, onToggleLive }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header style={{
      height: 64,
      background: 'rgba(13,21,38,0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #1E2D45',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#E2E8F0' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{subtitle}</div>}
      </div>

      {/* Live indicator */}
      <button
        onClick={onToggleLive}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 14px', borderRadius: 20,
          background: isLive ? 'rgba(16,185,129,0.12)' : 'rgba(100,116,139,0.12)',
          border: `1px solid ${isLive ? 'rgba(16,185,129,0.4)' : 'rgba(100,116,139,0.3)'}`,
          color: isLive ? '#10B981' : '#64748B',
          cursor: 'pointer', fontSize: 12, fontWeight: 600,
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: isLive ? '#10B981' : '#64748B',
          animation: isLive ? 'pulse 2s infinite' : 'none',
        }} />
        {isLive ? 'LIVE' : 'PAUSED'}
      </button>

      {/* Last update */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 14px', borderRadius: 20,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid #1E2D45',
      }}>
        <span style={{ fontSize: 11, color: '#64748B' }}>Updated:</span>
        <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }}>
          {formatDate(lastUpdated || now)}
        </span>
      </div>

      {/* Time */}
      <div style={{
        padding: '6px 14px', borderRadius: 20,
        background: 'rgba(0,168,224,0.08)',
        border: '1px solid rgba(0,168,224,0.2)',
        fontSize: 12, fontFamily: 'JetBrains Mono, monospace',
        color: '#00A8E0', fontWeight: 600, letterSpacing: '0.5px',
      }}>
        {formatDate(now)}
      </div>

      {/* User avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'linear-gradient(135deg, #00A8E0, #0057A6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer',
        boxShadow: '0 0 12px rgba(0,168,224,0.3)',
      }}>
        PM
      </div>
    </header>
  );
};

export default Header;
