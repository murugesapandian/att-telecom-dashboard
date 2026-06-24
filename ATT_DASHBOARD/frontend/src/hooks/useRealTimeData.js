import { useState, useEffect, useCallback } from 'react';
import { STATE_PROVIDER_DATA } from '../data/stateProviderData';

const generateNoise = (base, amplitude = 2) =>
  Math.max(0, Math.min(100, base + (Math.random() - 0.5) * amplitude));

export const useRealTimeData = (intervalMs = 3000) => {
  const [liveData, setLiveData] = useState(STATE_PROVIDER_DATA);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLive, setIsLive] = useState(true);
  const [updateCount, setUpdateCount] = useState(0);

  const tick = useCallback(() => {
    setLiveData(prev =>
      prev.map(state => {
        const drift = (Math.random() - 0.5) * 0.8;
        return {
          ...state,
          att: Math.max(5, Math.min(55, state.att + drift)),
          verizon: generateNoise(state.verizon, 0.8),
          tmobile: generateNoise(state.tmobile, 0.8),
          comcast: generateNoise(state.comcast, 0.5),
          spectrum: generateNoise(state.spectrum, 0.5),
        };
      })
    );
    setLastUpdated(new Date());
    setUpdateCount(c => c + 1);
  }, []);

  useEffect(() => {
    if (!isLive) return;
    const timer = setInterval(tick, intervalMs);
    return () => clearInterval(timer);
  }, [isLive, intervalMs, tick]);

  return { liveData, lastUpdated, isLive, setIsLive, updateCount };
};

export const useKPIMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalSubscribers: 134500000,
    attMarketShare: 27.2,
    statesLeading: 18,
    npsScore: 12,
    revenueQ: 30.1,
    fiberSubscribers: 8200000,
    networkUptime: 99.91,
    churnRate: 1.02,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalSubscribers: prev.totalSubscribers + Math.floor(Math.random() * 500 - 100),
        attMarketShare: Math.max(26, Math.min(28, prev.attMarketShare + (Math.random() - 0.5) * 0.05)),
        networkUptime: Math.max(99.8, Math.min(99.99, prev.networkUptime + (Math.random() - 0.5) * 0.01)),
        churnRate: Math.max(0.8, Math.min(1.3, prev.churnRate + (Math.random() - 0.5) * 0.02)),
        fiberSubscribers: prev.fiberSubscribers + Math.floor(Math.random() * 200 - 50),
      }));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return metrics;
};

export const useRealtimeSubscriberFeed = () => {
  const [feed, setFeed] = useState([]);
  const states = ['TX', 'CA', 'FL', 'NY', 'GA', 'IL', 'PA', 'OH', 'NC', 'WA'];
  const actions = ['New subscriber', 'Plan upgrade', 'Fiber activation', 'Port-in', '5G migration'];
  const providers = ['AT&T Fiber', 'AT&T 5G', 'AT&T Mobile', 'AT&T Business'];

  useEffect(() => {
    const timer = setInterval(() => {
      const newEvent = {
        id: Date.now(),
        state: states[Math.floor(Math.random() * states.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        service: providers[Math.floor(Math.random() * providers.length)],
        time: new Date().toLocaleTimeString(),
        value: `$${(Math.random() * 100 + 40).toFixed(2)}`,
      };
      setFeed(prev => [newEvent, ...prev].slice(0, 20));
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return feed;
};
