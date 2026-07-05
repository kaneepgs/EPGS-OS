import { normalizeCollection, normalizeTimelineEvent } from '../contracts/data-contracts.js';

export function createTimelineService(registry) {
  return Object.freeze({
    getBusinessTimeline() {
      const provider = registry.getDomainProvider('timeline');
      const ceo = provider.getCeoDashboard();
      return normalizeCollection(ceo.businessTimeline || [], normalizeTimelineEvent);
    }
  });
}
