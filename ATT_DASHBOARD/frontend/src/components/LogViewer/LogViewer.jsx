import React, { useState, useEffect, useRef } from 'react';
import logger, { CATEGORIES_LIST } from '../../services/LoggingService';

const LEVEL_COLORS = {
  DEBUG: '#64748B',
  INFO:  '#00A8E0',
  WARN:  '#F59E0B',
  ERROR: '#EF4444',
};

const LEVEL_BG = {
  DEBUG: 'rgba(100,116,139,0.12)',
  INFO:  'rgba(0,168,224,0.12)',
  WARN:  'rgba(245,158,11,0.12)',
  ERROR: 'rgba(239,68,68,0.15)',
};

export default function LogViewer() {
  const [open, setOpen]         = useState(false);
  const [logs, setLogs]         = useState([]);
  const [level, setLevel]       = useState('ALL');
  const [category, setCategory] = useState('ALL');
  const [search, setSearch]     = useState('');
  const [paused, setPaused]     = useState(false);
  const [stats, setStats]       = useState({});
  const [tab, setTab]           = useState('LIVE');
  const listRef = useRef(null);
  const pausedRef = useRef(false);

  pausedRef.current = paused;

  useEffect(() => {
    setLogs(logger.getLogs());
    setStats(logger.getStats());

    const unsub = logger.subscribe((entry) => {
      if (!pausedRef.current) {
        setLogs(logger.getLogs({ level: level === 'ALL' ? undefined : level,
                                 category: category === 'ALL' ? undefined : category,
                                 search: search || undefined }));
        setStats(logger.getStats());
      }
    });
    return unsub;
  }, [level, category, search]);

  useEffect(() => {
    if (!paused && listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [logs, paused]);

  const filtered = logger.getLogs({
    level:    level    === 'ALL' ? undefined : level,
    category: category === 'ALL' ? undefined : category,
    search:   search || undefined,
    limit: 300,
  });

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => { setOpen(o => !o); logger.click('LogViewer', 'TOGGLE', { opened: !open }); }}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          background: open ? '#EF4444' : '#00A8E0',
          color: '#fff', border: 'none', borderRadius: 12,
          padding: '10px 18px', fontWeight: 700, fontSize: 13,
          cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', gap: 8,
          transition: 'all 0.2s',
        }}
      >
        <span style={{ fontSize: 16 }}>📋</span>
        {open ? 'Close Logs' : 'Dev Logs'}
        {stats.byLevel?.ERROR > 0 && (
          <span style={{
            background: '#EF4444', borderRadius: 999,
            fontSize: 10, padding: '2px 6px', fontWeight: 800,
          }}>
            {stats.byLevel.ERROR} ERR
          </span>
        )}
      </button>

      {/* Log panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 80, right: 24, zIndex: 9998,
          width: 680, height: 520,
          background: '#0D1117', border: '1px solid #21262D',
          borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          fontFamily: 'monospace',
        }}>

          {/* Header */}
          <div style={{
            padding: '12px 16px', background: '#161B22',
            borderBottom: '1px solid #21262D',
            display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          }}>
            <span style={{ color: '#00A8E0', fontWeight: 700, fontSize: 14 }}>
              AT&T Dashboard Logs
            </span>
            <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
              {['LIVE', 'STATS'].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  background: tab === t ? '#00A8E0' : 'transparent',
                  color: tab === t ? '#fff' : '#64748B',
                  border: '1px solid #21262D', borderRadius: 6,
                  padding: '3px 10px', fontSize: 11, cursor: 'pointer',
                }}>
                  {t}
                </button>
              ))}
              <button onClick={() => setPaused(p => !p)} style={{
                background: paused ? '#F59E0B22' : 'transparent',
                color: paused ? '#F59E0B' : '#64748B',
                border: '1px solid #21262D', borderRadius: 6,
                padding: '3px 10px', fontSize: 11, cursor: 'pointer',
              }}>
                {paused ? '▶ Resume' : '⏸ Pause'}
              </button>
              <button onClick={() => { logger.clearLogs(); setLogs([]); }} style={{
                background: 'transparent', color: '#64748B',
                border: '1px solid #21262D', borderRadius: 6,
                padding: '3px 10px', fontSize: 11, cursor: 'pointer',
              }}>
                Clear
              </button>
              <button onClick={() => logger.exportLogs()} style={{
                background: 'transparent', color: '#64748B',
                border: '1px solid #21262D', borderRadius: 6,
                padding: '3px 10px', fontSize: 11, cursor: 'pointer',
              }}>
                Export
              </button>
            </div>
          </div>

          {/* Filters */}
          <div style={{
            padding: '8px 16px', background: '#161B22',
            borderBottom: '1px solid #21262D',
            display: 'flex', gap: 8, alignItems: 'center',
          }}>
            <select value={level} onChange={e => setLevel(e.target.value)} style={{
              background: '#0D1117', color: '#94A3B8', border: '1px solid #21262D',
              borderRadius: 6, padding: '4px 8px', fontSize: 11,
            }}>
              <option value="ALL">All Levels</option>
              {['DEBUG','INFO','WARN','ERROR'].map(l => (
                <option key={l} value={l} style={{ color: LEVEL_COLORS[l] }}>{l}</option>
              ))}
            </select>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{
              background: '#0D1117', color: '#94A3B8', border: '1px solid #21262D',
              borderRadius: 6, padding: '4px 8px', fontSize: 11,
            }}>
              <option value="ALL">All Categories</option>
              {CATEGORIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search actions / data..."
              style={{
                flex: 1, background: '#0D1117', color: '#94A3B8',
                border: '1px solid #21262D', borderRadius: 6,
                padding: '4px 10px', fontSize: 11, outline: 'none',
              }}
            />
            <span style={{ color: '#475569', fontSize: 11, whiteSpace: 'nowrap' }}>
              {filtered.length} entries
            </span>
          </div>

          {/* Content */}
          {tab === 'LIVE' ? (
            <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#475569', marginTop: 80, fontSize: 13 }}>
                  No logs yet. Interact with the dashboard to generate events.
                </div>
              ) : filtered.map(log => (
                <LogRow key={log.id} log={log} />
              ))}
            </div>
          ) : (
            <StatsPanel stats={logger.getStats()} />
          )}
        </div>
      )}
    </>
  );
}

function LogRow({ log }) {
  const [expanded, setExpanded] = useState(false);
  const hasData = log.data && Object.keys(log.data).length > 0;

  return (
    <div
      onClick={() => hasData && setExpanded(e => !e)}
      style={{
        padding: '4px 16px',
        borderBottom: '1px solid #0D1117',
        background: expanded ? LEVEL_BG[log.level] : 'transparent',
        cursor: hasData ? 'pointer' : 'default',
        transition: 'background 0.15s',
      }}
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', fontSize: 11 }}>
        <span style={{ color: '#475569', flexShrink: 0, width: 80 }}>
          {log.timestamp.slice(11, 23)}
        </span>
        <span style={{
          color: LEVEL_COLORS[log.level], fontWeight: 700,
          flexShrink: 0, width: 44,
        }}>
          {log.level}
        </span>
        <span style={{ color: '#64748B', flexShrink: 0, width: 110 }}>
          {log.category}
        </span>
        <span style={{ color: '#E2E8F0', flex: 1 }}>
          {log.action}
        </span>
        {log.route && log.route !== '/' && (
          <span style={{ color: '#334155', flexShrink: 0, fontSize: 10 }}>
            {log.route}
          </span>
        )}
        {hasData && (
          <span style={{ color: '#334155', fontSize: 10 }}>{expanded ? '▲' : '▼'}</span>
        )}
      </div>
      {expanded && hasData && (
        <pre style={{
          margin: '4px 0 4px 154px', fontSize: 10,
          color: '#64748B', background: '#0D1117',
          padding: '6px 10px', borderRadius: 6,
          overflow: 'auto', maxHeight: 200,
        }}>
          {JSON.stringify(log.data, null, 2)}
        </pre>
      )}
    </div>
  );
}

function StatsPanel({ stats }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 16, fontSize: 12, color: '#94A3B8' }}>
      <p style={{ color: '#00A8E0', fontWeight: 700, marginBottom: 12 }}>
        Session: {stats.sessionId}
      </p>
      <p style={{ marginBottom: 16 }}>Total events: <strong style={{ color: '#E2E8F0' }}>{stats.total}</strong></p>

      <div style={{ marginBottom: 16 }}>
        <p style={{ color: '#64748B', marginBottom: 8 }}>BY LEVEL</p>
        {stats.byLevel && Object.entries(stats.byLevel).map(([lvl, cnt]) => (
          <div key={lvl} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ color: LEVEL_COLORS[lvl], width: 50 }}>{lvl}</span>
            <div style={{
              height: 6, borderRadius: 3,
              background: LEVEL_COLORS[lvl],
              width: `${Math.min(100, (cnt / (stats.total || 1)) * 100 * 3)}%`,
              opacity: 0.7,
            }} />
            <span style={{ color: '#64748B' }}>{cnt}</span>
          </div>
        ))}
      </div>

      <div>
        <p style={{ color: '#64748B', marginBottom: 8 }}>BY CATEGORY</p>
        {stats.byCategory && Object.entries(stats.byCategory)
          .sort(([,a],[,b]) => b - a)
          .map(([cat, cnt]) => (
          <div key={cat} style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
            <span style={{ width: 120, color: '#475569' }}>{cat}</span>
            <div style={{
              height: 6, borderRadius: 3, background: '#00A8E0',
              width: `${Math.min(100, (cnt / (stats.total || 1)) * 200)}%`,
              opacity: 0.5, alignSelf: 'center',
            }} />
            <span style={{ color: '#64748B' }}>{cnt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
