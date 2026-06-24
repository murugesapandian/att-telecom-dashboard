// Central logging service — captures every UI action, API call, navigation, and error.
// Stores in memory, broadcasts to subscribers, and ships to backend /api/logs.

const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };

const CATEGORIES = {
  NAVIGATION:    'NAVIGATION',
  USER_ACTION:   'USER_ACTION',
  CHART:         'CHART',
  MAP:           'MAP',
  API_CALL:      'API_CALL',
  REALTIME:      'REALTIME',
  KAFKA:         'KAFKA',
  PERFORMANCE:   'PERFORMANCE',
  DATA_LOAD:     'DATA_LOAD',
  ERROR:         'ERROR',
  SYSTEM:        'SYSTEM',
};

class LoggingService {
  constructor() {
    this.logs     = [];
    this.listeners = [];
    this.maxLogs  = 1000;
    this.sessionId = this._genId();
    this.startTime = Date.now();
    this._seq = 0;

    // Capture unhandled errors automatically
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (e) =>
        this.error('WINDOW', 'UNHANDLED_ERROR', { message: e.message, filename: e.filename, lineno: e.lineno })
      );
      window.addEventListener('unhandledrejection', (e) =>
        this.error('WINDOW', 'UNHANDLED_PROMISE_REJECTION', { reason: String(e.reason) })
      );
    }

    this.info('SYSTEM', 'SESSION_STARTED', {
      sessionId: this.sessionId,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
      timestamp: new Date().toISOString(),
    });
  }

  _genId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  _entry(level, category, action, data = {}) {
    this._seq += 1;
    return {
      id:        this._genId(),
      seq:       this._seq,
      timestamp: new Date().toISOString(),
      elapsed:   `${((Date.now() - this.startTime) / 1000).toFixed(2)}s`,
      level,
      category,
      action,
      data,
      sessionId: this.sessionId,
      route:     typeof window !== 'undefined' ? window.location.pathname : '/',
    };
  }

  _push(entry) {
    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) this.logs.length = this.maxLogs;
    this.listeners.forEach(fn => { try { fn(entry); } catch (_) {} });
    this._ship(entry);

    // Also write to browser console with color coding
    const colors = { INFO: '#00A8E0', WARN: '#F59E0B', ERROR: '#EF4444', DEBUG: '#64748B' };
    const c = colors[entry.level] || '#94A3B8';
    console.log(
      `%c[${entry.level}] %c${entry.category}:${entry.action}`,
      `color:${c};font-weight:700`,
      'color:#94A3B8',
      entry.data && Object.keys(entry.data).length ? entry.data : ''
    );
  }

  async _ship(entry) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
        keepalive: true,
      });
    } catch (_) {
      // Backend logging is best-effort — never break the UI
    }
  }

  // ── Public API ───────────────────────────────────────────
  debug(category, action, data)  { this._push(this._entry('DEBUG', category, action, data)); }
  info (category, action, data)  { this._push(this._entry('INFO',  category, action, data)); }
  warn (category, action, data)  { this._push(this._entry('WARN',  category, action, data)); }
  error(category, action, data)  { this._push(this._entry('ERROR', category, action, data)); }

  // Convenience wrappers for common patterns
  nav(route, from)                    { this.info(CATEGORIES.NAVIGATION,  'ROUTE_CHANGE',        { to: route, from }); }
  click(component, element, detail)   { this.info(CATEGORIES.USER_ACTION, 'CLICK',               { component, element, ...detail }); }
  hover(component, target)            { this.debug(CATEGORIES.USER_ACTION,'HOVER',               { component, target }); }
  filter(component, filterKey, value) { this.info(CATEGORIES.USER_ACTION, 'FILTER_CHANGE',       { component, filterKey, value }); }
  chartInteract(chart, event, data)   { this.info(CATEGORIES.CHART,       event,                 { chart, ...data }); }
  mapClick(stateId, stateName, mode)  { this.info(CATEGORIES.MAP,         'STATE_SELECTED',      { stateId, stateName, mode }); }
  mapHover(stateId)                   { this.debug(CATEGORIES.MAP,        'STATE_HOVERED',       { stateId }); }
  dataLoad(source, count, ms)         { this.info(CATEGORIES.DATA_LOAD,   'DATA_LOADED',         { source, count, durationMs: ms }); }
  apiCall(endpoint, method, status)   { this.info(CATEGORIES.API_CALL,    'REQUEST',             { endpoint, method, status }); }
  realtimeUpdate(type, count)         { this.debug(CATEGORIES.REALTIME,   'UPDATE_RECEIVED',     { type, count }); }
  kafkaEvent(topic, eventType, key)   { this.info(CATEGORIES.KAFKA,       'EVENT_PUBLISHED',     { topic, eventType, key }); }
  perf(component, metric, ms)         { this.info(CATEGORIES.PERFORMANCE, 'METRIC',              { component, metric, durationMs: ms }); }

  // ── Subscriber pattern ───────────────────────────────────
  subscribe(fn) {
    this.listeners.push(fn);
    return () => { this.listeners = this.listeners.filter(l => l !== fn); };
  }

  getLogs({ level, category, search, limit = 200 } = {}) {
    let result = this.logs;
    if (level && level !== 'ALL')      result = result.filter(l => l.level === level);
    if (category && category !== 'ALL') result = result.filter(l => l.category === category);
    if (search)                         result = result.filter(l =>
      l.action.includes(search.toUpperCase()) ||
      l.category.includes(search.toUpperCase()) ||
      JSON.stringify(l.data).toLowerCase().includes(search.toLowerCase())
    );
    return result.slice(0, limit);
  }

  clearLogs() { this.logs = []; this.listeners.forEach(fn => fn(null)); }

  exportLogs() {
    const json = JSON.stringify(this.logs, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `att-dashboard-logs-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
    this.info('SYSTEM', 'LOGS_EXPORTED', { count: this.logs.length });
  }

  getStats() {
    const counts = { DEBUG: 0, INFO: 0, WARN: 0, ERROR: 0 };
    const catCounts = {};
    this.logs.forEach(l => {
      counts[l.level] = (counts[l.level] || 0) + 1;
      catCounts[l.category] = (catCounts[l.category] || 0) + 1;
    });
    return { total: this.logs.length, byLevel: counts, byCategory: catCounts, sessionId: this.sessionId };
  }
}

export const CATEGORIES_LIST = Object.values(CATEGORIES);
export default new LoggingService();
