import { clamp, confidenceLabel } from './engine-utils.js';

export function createConfidenceEngine(config) {
  const thresholds = config.thresholds.confidence;
  return Object.freeze({
    score({ evidenceCount = 0, metricCoverage = 0.5, crossFunctional = 0, consistency = 0.7, penalty = 0 } = {}) {
      const value = clamp(42 + evidenceCount * 9 + metricCoverage * 22 + crossFunctional * 10 + consistency * 12 - penalty);
      return {
        score: Math.round(value),
        label: confidenceLabel(value, thresholds)
      };
    }
  });
}
