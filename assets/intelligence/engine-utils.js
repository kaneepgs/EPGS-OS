export function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
}

export function average(values = []) {
  const valid = values.filter((value) => Number.isFinite(value));
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0;
}

export function parseNumber(value, fallback = 0) {
  if (typeof value === 'number') return value;
  if (value == null) return fallback;
  const source = String(value).trim().replace(/,/g, '');
  if (!source) return fallback;
  const match = source.match(/-?\d+(?:\.\d+)?/);
  if (!match) return fallback;
  let number = Number.parseFloat(match[0]);
  if (/m/i.test(source)) number *= 1000000;
  else if (/k/i.test(source)) number *= 1000;
  return number;
}

export function parsePercent(value, fallback = 0) {
  return parseNumber(value, fallback);
}

export function parseCurrency(value, fallback = 0) {
  return parseNumber(value, fallback);
}

export function parseRangeMidpoint(value, fallback = 0) {
  if (value == null) return fallback;
  const source = String(value).replace(/,/g, '');
  const matches = [...source.matchAll(/-?\d+(?:\.\d+)?/g)].map((item) => Number.parseFloat(item[0]));
  if (!matches.length) return fallback;
  if (matches.length === 1) return matches[0] * (/k/i.test(source) ? 1000 : 1);
  const multiplier = /k/i.test(source) ? 1000 : 1;
  return ((matches[0] + matches[1]) / 2) * multiplier;
}

export function weightedScore(entries = [], weights = {}) {
  return clamp(
    entries.reduce((sum, [key, value]) => sum + clamp(value) * (weights[key] || 0), 0)
  );
}

export function thresholdLabel(score, thresholds, labels = {}) {
  if (score >= thresholds.high) return labels.high || 'High';
  if (score >= thresholds.medium) return labels.medium || 'Medium';
  return labels.low || 'Low';
}

export function healthLabel(score, thresholds) {
  if (score >= thresholds.strong) return 'Strong';
  if (score >= thresholds.stable) return 'Stable';
  if (score >= thresholds.watch) return 'Needs attention';
  return 'At risk';
}

export function priorityTone(priority = '') {
  const value = String(priority).toLowerCase();
  if (value === 'high') return 'risk';
  if (value === 'medium') return 'warn';
  return 'good';
}

export function confidenceLabel(score, thresholds) {
  if (score >= thresholds.high) return 'High';
  if (score >= thresholds.medium) return 'Medium';
  return 'Low';
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value || 0);
}

export function nowTimestamp() {
  return new Date().toISOString();
}
