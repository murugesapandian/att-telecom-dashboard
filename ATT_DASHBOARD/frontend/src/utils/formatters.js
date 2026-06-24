export const formatNumber = (n) => {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
};

export const formatPercent = (n, decimals = 1) =>
  `${parseFloat(n).toFixed(decimals)}%`;

export const formatCurrency = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);

export const formatScore = (n) => parseFloat(n).toFixed(1);

export const formatPopulation = (n) => {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  return `${(n / 1e3).toFixed(0)}K`;
};

export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).format(date instanceof Date ? date : new Date(date));

export const formatTrend = (trend) => {
  const isPositive = trend.startsWith('+');
  return { value: trend, isPositive };
};
