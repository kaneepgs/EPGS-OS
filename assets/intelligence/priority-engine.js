import { clamp, thresholdLabel } from './engine-utils.js';

export function createPriorityEngine(config) {
  const weights = config.weights.priority;
  const thresholds = config.thresholds.priority;

  function calculate(factors = {}) {
    const score = clamp(
      (factors.financialImpact || 0) * weights.financialImpact +
        (factors.customerImpact || 0) * weights.customerImpact +
        (factors.strategicImportance || 0) * weights.strategicImportance +
        (factors.timeSensitivity || 0) * weights.timeSensitivity +
        (factors.confidence || 0) * weights.confidence
    );
    return {
      score: Math.round(score),
      label: thresholdLabel(score, thresholds, { high: 'High', medium: 'Medium', low: 'Low' })
    };
  }

  return Object.freeze({
    calculate,
    rank(recommendations = []) {
      return recommendations
        .map((item) => {
          const priority = calculate(item.priorityFactors || {});
          return { ...item, priority: priority.label, priorityScore: priority.score };
        })
        .sort((a, b) => b.priorityScore - a.priorityScore);
    }
  });
}
