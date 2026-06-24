import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', icon: '⬡', label: 'Overview', exact: true },
  { path: '/usa-map', icon: '🗺', label: 'USA State Map' },
  { path: '/provider-analytics', icon: '📊', label: 'Provider Analytics' },
  { path: '/customer-feedback', icon: '💬', label: 'Customer Feedback' },
  { path: '/plan-comparison', icon: '📋', label: 'Plan Comparison' },
  { path: '/documentation', icon: '📄', label: 'Documentation' },
];

const Sidebar = ({ collapsed, onToggle }) => {
  return (
    <aside
      style={{
        width: collapsed ? 68 : 240,
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0D1526 0%, #0A1020 100%)',
        borderRight: '1px solid #1E2D45',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid #1E2D45',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minHeight: 72,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'linear-gradient(135deg, #00A8E0, #0057A6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 14, color: '#fff', flexShrink: 0,
          boxShadow: '0 0 20px rgba(0,168,224,0.4)',
        }}>AT&T</div>
        {!collapsed && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', letterSpacing: '0.5px' }}>Telecom Intelligence</div>
            <div style={{ fontSize: 10, color: '#00A8E0', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Business Dashboard</div>
          </div>
        )}
      </div>

      {/* Nav Section Label */}
      {!collapsed && (
        <div style={{ padding: '16px 20px 8px', fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          Analytics Modules
        </div>
      )}

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '4px 8px' }}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: collapsed ? '12px 16px' : '10px 14px',
              marginBottom: 2,
              borderRadius: 10,
              textDecoration: 'none',
              color: isActive ? '#00A8E0' : '#94A3B8',
              background: isActive ? 'rgba(0,168,224,0.12)' : 'transparent',
              border: `1px solid ${isActive ? 'rgba(0,168,224,0.25)' : 'transparent'}`,
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              justifyContent: collapsed ? 'center' : 'flex-start',
              position: 'relative',
              overflow: 'hidden',
            })}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: 3, borderRadius: '0 3px 3px 0',
                    background: '#00A8E0',
                  }} />
                )}
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid #1E2D45' }}>
        {!collapsed && (
          <div style={{
            padding: '12px', borderRadius: 10, background: 'rgba(0,168,224,0.08)',
            border: '1px solid rgba(0,168,224,0.15)',
          }}>
            <div style={{ fontSize: 10, color: '#00A8E0', fontWeight: 700, letterSpacing: '1px', marginBottom: 4 }}>LIVE DATA FEED</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 11, color: '#94A3B8' }}>Real-time streaming</span>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          style={{
            marginTop: collapsed ? 0 : 10,
            width: '100%', padding: '8px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid #1E2D45',
            borderRadius: 8, color: '#94A3B8', cursor: 'pointer', fontSize: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          {collapsed ? '→' : '← Collapse'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
