import {
  normalizeApproval,
  normalizeCollection,
  normalizeDepartmentSummary,
  normalizeKpi,
  normalizeOpportunity,
  normalizeRisk
} from '../contracts/data-contracts.js';

export function createFinanceService(registry) {
  return Object.freeze({
    getWorkspace() {
      const provider = registry.getDomainProvider('finance');
      const raw = provider.getFinanceWorkspace();
      return {
        ...raw,
        metrics: normalizeCollection(raw.metrics || [], normalizeKpi).map((item, index) => ({ ...item, key: raw.metrics?.[index]?.key || item.id, detail: raw.metrics?.[index]?.detail || '' })),
        priorities: raw.workspace?.priorities || [],
        opportunities: normalizeCollection(raw.opportunities || [], normalizeOpportunity),
        risks: normalizeCollection(raw.risks || [], normalizeRisk),
        healthBreakdown: normalizeCollection(raw.healthBreakdown || [], normalizeDepartmentSummary),
        decisionJournal: raw.decisionJournal || [],
        weeklyBriefing: {
          ...raw.weeklyBriefing,
          pendingApprovals: normalizeCollection(raw.weeklyBriefing?.pendingApprovals || [], normalizeApproval)
        }
      };
    }
  });
}
