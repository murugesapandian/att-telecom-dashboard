import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import OverviewDashboard from './components/Overview/OverviewDashboard';
import USAStateMap from './components/USAMap/USAStateMap';
import ProviderAnalytics from './components/ProviderAnalytics/ProviderAnalytics';
import CustomerFeedback from './components/CustomerFeedback/CustomerFeedback';
import PlanComparison from './components/PlanComparison/PlanComparison';
import DocumentExport from './components/Documentation/DocumentExport';
import { useRealTimeData } from './hooks/useRealTimeData';
import './App.css';

const PAGE_META = {
  '/': { title: 'Executive Overview', subtitle: 'AT&T Business Intelligence Dashboard — Real-time Telecom Analytics' },
  '/usa-map': { title: 'USA State Map', subtitle: 'Interactive market share visualization across all 50 states' },
  '/provider-analytics': { title: 'Provider Analytics', subtitle: 'State-by-state competitive analysis and trend data' },
  '/customer-feedback': { title: 'Customer Feedback', subtitle: 'Sentiment analysis and satisfaction scores — Top 5 providers' },
  '/plan-comparison': { title: 'Plan Comparison', subtitle: 'Wireless & broadband plan analysis across all major providers' },
  '/documentation': { title: 'Architecture & Documentation', subtitle: 'Technical architecture, business cases, and deployment guide' },
};

const AppContent = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { liveData, lastUpdated, isLive, setIsLive } = useRealTimeData(3000);
  const location = useLocation();
  const meta = PAGE_META[location.pathname] || PAGE_META['/'];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0E1A' }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(p => !p)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          lastUpdated={lastUpdated}
          isLive={isLive}
          onToggleLive={() => setIsLive(p => !p)}
        />

        <main style={{ flex: 1, overflowY: 'auto', background: '#0A0E1A' }}>
          <Routes>
            <Route path="/" element={<OverviewDashboard liveData={liveData} />} />
            <Route path="/usa-map" element={<USAStateMap liveData={liveData} />} />
            <Route path="/provider-analytics" element={<ProviderAnalytics liveData={liveData} />} />
            <Route path="/customer-feedback" element={<CustomerFeedback />} />
            <Route path="/plan-comparison" element={<PlanComparison />} />
            <Route path="/documentation" element={<DocumentExport />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
