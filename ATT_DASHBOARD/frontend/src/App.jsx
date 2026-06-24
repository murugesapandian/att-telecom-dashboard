import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import OverviewDashboard from './components/Overview/OverviewDashboard';
import USAStateMap from './components/USAMap/USAStateMap';
import ProviderAnalytics from './components/ProviderAnalytics/ProviderAnalytics';
import CustomerFeedback from './components/CustomerFeedback/CustomerFeedback';
import PlanComparison from './components/PlanComparison/PlanComparison';
import DocumentExport from './components/Documentation/DocumentExport';
import DataDisclaimer from './components/DataDisclaimer/DataDisclaimer';
import LogViewer from './components/LogViewer/LogViewer';
import { useRealTimeData } from './hooks/useRealTimeData';
import logger from './services/LoggingService';
import './App.css';

const PAGE_META = {
  '/':              { title: 'Executive Overview',          subtitle: 'AT&T Business Intelligence Dashboard — Real-time Telecom Analytics' },
  '/usa-map':       { title: 'USA State Map',               subtitle: 'Interactive market share visualization across all 50 states' },
  '/provider-analytics': { title: 'Provider Analytics',    subtitle: 'State-by-state competitive analysis and trend data' },
  '/customer-feedback':  { title: 'Customer Feedback',     subtitle: 'Sentiment analysis and satisfaction scores — Top 5 providers' },
  '/plan-comparison':    { title: 'Plan Comparison',       subtitle: 'Wireless & broadband plan analysis across all major providers' },
  '/documentation':      { title: 'Architecture & Documentation', subtitle: 'Technical architecture, business cases, and deployment guide' },
  '/data-sources':       { title: 'Data Sources & Transparency', subtitle: 'Full disclosure of all data origins and simulation methods' },
};

const AppContent = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { liveData, lastUpdated, isLive, setIsLive } = useRealTimeData(3000);
  const location = useLocation();
  const meta = PAGE_META[location.pathname] || PAGE_META['/'];
  const prevPath = useRef(null);

  // Log every navigation event
  useEffect(() => {
    logger.nav(location.pathname, prevPath.current);
    prevPath.current = location.pathname;
  }, [location.pathname]);

  // Log live feed toggle
  const handleToggleLive = () => {
    const next = !isLive;
    setIsLive(next);
    logger.click('Header', 'LIVE_FEED_TOGGLE', { enabled: next });
  };

  // Log sidebar toggle
  const handleSidebarToggle = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    logger.click('Sidebar', 'SIDEBAR_TOGGLE', { collapsed: next });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0E1A' }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          lastUpdated={lastUpdated}
          isLive={isLive}
          onToggleLive={handleToggleLive}
        />

        <main style={{ flex: 1, overflowY: 'auto', background: '#0A0E1A' }}>
          <Routes>
            <Route path="/"                    element={<OverviewDashboard liveData={liveData} />} />
            <Route path="/usa-map"             element={<USAStateMap liveData={liveData} />} />
            <Route path="/provider-analytics"  element={<ProviderAnalytics liveData={liveData} />} />
            <Route path="/customer-feedback"   element={<CustomerFeedback />} />
            <Route path="/plan-comparison"     element={<PlanComparison />} />
            <Route path="/documentation"       element={<DocumentExport />} />
            <Route path="/data-sources"        element={<DataDisclaimer />} />
          </Routes>
        </main>
      </div>

      {/* Global floating log viewer — always visible regardless of route */}
      <LogViewer />
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
