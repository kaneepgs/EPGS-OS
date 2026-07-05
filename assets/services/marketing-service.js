import {
  normalizeApproval,
  normalizeCollection,
  normalizeInsight,
  normalizeKpi,
  normalizeOpportunity,
  normalizeRisk,
  normalizeTimelineEvent
} from '../contracts/data-contracts.js';

export function createMarketingService(registry) {
  return Object.freeze({
    getWorkspace() {
      const provider = registry.getDomainProvider('marketing');
      const raw = provider.getMarketingWorkspace();
      return {
        ...raw,
        dashboard: {
          ...raw.dashboard,
          summaryCards: normalizeCollection(raw.dashboard?.summaryCards || [], normalizeKpi),
          platformHighlights: normalizeCollection(raw.dashboard?.platformHighlights || [], normalizeInsight),
          approvals: normalizeCollection(raw.dashboard?.approvals || [], normalizeApproval),
          opportunities: normalizeCollection(raw.dashboard?.opportunities || [], normalizeOpportunity),
          risks: normalizeCollection(raw.dashboard?.risks || [], normalizeRisk)
        },
        socialOverview: {
          ...raw.socialOverview,
          priorityActions: normalizeCollection(raw.socialOverview?.priorityActions || [], normalizeInsight)
        },
        marketingCalendar: {
          ...raw.marketingCalendar,
          upcoming: normalizeCollection(raw.marketingCalendar?.upcoming || [], normalizeTimelineEvent)
        },
        aiMarketingAdvisor: raw.aiMarketingAdvisor
      };
    }
  });
}
