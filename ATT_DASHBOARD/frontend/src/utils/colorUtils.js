import { scaleLinear } from 'd3-scale';

export const PROVIDER_COLOR_MAP = {
  "AT&T": "#00A8E0",
  "Verizon": "#CD040B",
  "T-Mobile": "#E20074",
  "Comcast/Xfinity": "#CC0000",
  "Comcast": "#CC0000",
  "Charter/Spectrum": "#0072CE",
  "Spectrum": "#0072CE",
  "Cox": "#00897B",
  "Cox Communications": "#00897B",
  "Dish/Boost Mobile": "#E36F1E",
  "Boost": "#E36F1E",
  "UScellular": "#28B8E4",
  "Frontier": "#6B21A8",
  "Lumen": "#F59E0B",
  "Others": "#6B7280",
};

export const LEADER_COLORS = {
  "AT&T": "#00A8E0",
  "Verizon": "#CD040B",
  "T-Mobile": "#E20074",
  "Comcast": "#CC0000",
  "Spectrum": "#0072CE",
};

export const ATT_HEAT_SCALE = scaleLinear()
  .domain([10, 25, 42])
  .range(["#1E3A5F", "#0057A6", "#00A8E0"]);

export const OPPORTUNITY_COLORS = {
  low: "#10B981",
  medium: "#F59E0B",
  high: "#EF4444",
};

export const getProviderColor = (name) =>
  PROVIDER_COLOR_MAP[name] || "#6B7280";

export const getLeaderColor = (leader) =>
  LEADER_COLORS[leader] || "#6B7280";

export const getATTHeatColor = (attShare) => {
  if (attShare >= 35) return "#00C8FF";
  if (attShare >= 28) return "#00A8E0";
  if (attShare >= 20) return "#0057A6";
  if (attShare >= 14) return "#003D7A";
  return "#1A2535";
};

export const getOpportunityColor = (level) =>
  OPPORTUNITY_COLORS[level] || "#6B7280";

export const scoreToColor = (score) => {
  if (score >= 4.0) return "#10B981";
  if (score >= 3.5) return "#F59E0B";
  return "#EF4444";
};

export const CHART_COLORS = [
  "#00A8E0", "#CD040B", "#E20074", "#CC0000", "#0072CE",
  "#00897B", "#E36F1E", "#28B8E4", "#6B21A8", "#F59E0B",
];
