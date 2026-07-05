import { normalizeCollection, normalizeHistoricalContext, parseCompactNumber } from '../contracts/data-contracts.js';

export class ContextStore {
  constructor(memoryStore) {
    this.memoryStore = memoryStore;
  }

  recurringIssues() {
    return normalizeCollection(this.memoryStore.getContext().recurringIssues || [], normalizeHistoricalContext);
  }

  historicalTrends() {
    return normalizeCollection(this.memoryStore.getContext().historicalTrends || [], normalizeHistoricalContext);
  }

  strategicThemes() {
    return (this.memoryStore.getContext().strategicThemes || []).map((item) => String(item));
  }

  highlights() {
    return normalizeCollection(this.memoryStore.getContext().memoryHighlights || [], normalizeHistoricalContext);
  }

  deterministicContext({ finance, marketing } = {}) {
    const contexts = [];
    const trends = this.historicalTrends();
    const recurring = this.recurringIssues();

    const usersMetric = marketing?.websiteAnalytics?.metrics?.find?.(([label]) => label === 'Users' || label === 'Website Visitors')?.[1];
    const revenueMetric = finance?.metrics?.find?.((item) => item.key === 'revenue')?.value;
    const currentUsers = parseCompactNumber(usersMetric);
    const currentRevenue = parseCompactNumber(revenueMetric);

    const trafficTrend = trends.find((item) => item.id === 'trend-traffic-consecutive-growth');
    if (trafficTrend && currentUsers >= 5000) {
      contexts.push({
        ...trafficTrend,
        title: 'Website traffic is still compounding against the recent trendline',
        summary: `This is now the third consecutive month website traffic has increased, and the current workspace is still tracking that same demand pattern.`
      });
    }

    const revenueTrend = trends.find((item) => item.id === 'trend-revenue-quarter-record');
    if (revenueTrend && currentRevenue >= 46800) {
      contexts.push({
        ...revenueTrend,
        title: 'Revenue is still above the previous quarterly benchmark',
        summary: 'Revenue has now exceeded the previous quarterly record pace, so the key leadership question is quality and flexibility rather than whether growth exists at all.'
      });
    }

    recurring.forEach((item) => contexts.push(item));
    return contexts;
  }
}
