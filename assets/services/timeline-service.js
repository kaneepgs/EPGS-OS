import { deepClone, normalizeCollection, normalizeTimelineEvent } from '../contracts/data-contracts.js';

export function createTimelineService(registry) {
  return Object.freeze({
    getBusinessTimeline() {
      const provider = registry.getDomainProvider('timeline');
      if (typeof provider.getBusinessTimeline === 'function') {
        return normalizeCollection(provider.getBusinessTimeline() || [], normalizeTimelineEvent);
      }
      if (typeof provider.getOperationsWorkspace === 'function') {
        return normalizeCollection(provider.getOperationsWorkspace()?.timelineEvents || [], normalizeTimelineEvent);
      }
      const ceo = typeof provider.getCeoDashboard === 'function' ? provider.getCeoDashboard() : { businessTimeline: [] };
      return normalizeCollection(ceo.businessTimeline || [], normalizeTimelineEvent);
    },
    getOperationsWorkspace() {
      const provider = registry.getDomainProvider('operations') || registry.getDomainProvider('timeline');
      if (typeof provider.getOperationsWorkspace === 'function') {
        return deepClone(provider.getOperationsWorkspace() || {});
      }
      return {};
    }
  });
}
