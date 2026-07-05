import { deepClone, normalizeCollection, normalizeHistoricalContext, normalizeMemoryEvent, parseCompactNumber } from '../contracts/data-contracts.js';
import { MemoryStore } from './memory-store.js';
import { EventStore } from './event-store.js';
import { DecisionStore } from './decision-store.js';
import { GoalStore } from './goal-store.js';
import { ContextStore } from './context-store.js';
import { buildKnowledgeGraph } from './knowledge-graph.js';

function impactTone(impact = '') {
  const value = String(impact).toLowerCase();
  if (value.includes('high')) return 'risk';
  if (value.includes('medium')) return 'warn';
  return 'good';
}

function dedupeById(entries = []) {
  return [...new Map(entries.map((item) => [item.id, item])).values()];
}

function sortTimeline(entries = []) {
  return entries.slice().sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
}

function marketingMilestones(runtime = {}) {
  const marketing = runtime.marketing || {};
  const websiteMetrics = Object.fromEntries((marketing.websiteAnalytics?.metrics || []).filter((entry) => Array.isArray(entry) && entry.length >= 2));
  const websiteSource = marketing.websiteAnalytics?.dataSource || {};
  const websiteMeta = marketing.websiteAnalytics?.snapshotMeta || {};
  const youtubePlatform = marketing.platforms?.youtube || {};
  const youtubeStats = Object.fromEntries((youtubePlatform.stats || []).filter((entry) => Array.isArray(entry) && entry.length >= 2));
  const youtubeSource = youtubePlatform.dataSource || {};
  const youtubeMeta = youtubePlatform.snapshotMeta || {};
  const topCampaign = marketing.campaignPerformance?.campaigns?.[0];
  const topVideoRecord = (runtime.marketing?.contentLibrary?.items || [])
    .filter((item) => item.platform === 'YouTube')
    .sort((left, right) => parseCompactNumber(right.views) - parseCompactNumber(left.views))[0];
  const topVideo = topVideoRecord?.title || (youtubePlatform.topContent || [])[0];
  const ga4Date = String(websiteSource.syncedAt || '').split('T')[0] || '2026-07-05';
  const youtubeDate = String(youtubeSource.syncedAt || '').split('T')[0] || ga4Date;
  const sessions = Number(websiteMeta.sessions || parseCompactNumber(websiteMetrics.Sessions));
  const users = Number(websiteMeta.users || parseCompactNumber(websiteMetrics.Users || websiteMetrics['Website Visitors']));
  const subscribers = Number(youtubeMeta.subscribers || parseCompactNumber(youtubeStats.Subscribers));
  const topVideoViews = Number((topVideoRecord && parseCompactNumber(topVideoRecord.views)) || youtubeMeta.viewsLast28Days || 0);
  const events = [];

  if (websiteSource.state === 'live-ga4' && sessions >= 6000) {
    events.push(normalizeMemoryEvent({
      id: 'mem-marketing-live-ga4-sessions-6k',
      date: ga4Date,
      time: 'Live sync',
      title: 'Website sessions moved above 6k in the live GA4 window',
      body: `The current synced GA4 period is now showing ${websiteMetrics.Sessions || '—'} sessions and ${websiteMetrics.Users || websiteMetrics['Website Visitors'] || '—'} users, confirming that live website demand is meaningful enough to drive executive marketing decisions.`,
      category: 'Website milestone',
      department: 'Marketing / Website',
      impact: 'High',
      relatedEntities: ['kpi-website-users', 'goal-booking-conversion', 'decision-ga4-live-snapshot'],
      status: 'Active',
      route: '/reports/executive-timeline'
    }));
  }

  if (youtubeSource.state === 'live-youtube' && subscribers >= 60000) {
    events.push(normalizeMemoryEvent({
      id: 'mem-marketing-youtube-subs-60k',
      date: youtubeDate,
      time: 'Live sync',
      title: 'YouTube channel moved beyond 60k subscribers',
      body: `The live YouTube snapshot now shows ${youtubeStats.Subscribers || '—'} subscribers for Elite Performance Golf Studios, reinforcing that premium proof-led video is a durable authority channel rather than a short-term spike.`,
      category: 'YouTube milestone',
      department: 'Marketing / Content',
      impact: 'High',
      relatedEntities: ['goal-youtube-100k', 'decision-video-proof-series', 'kpi-website-users'],
      status: 'Active',
      route: '/reports/executive-timeline'
    }));
  }

  if (youtubeSource.state === 'live-youtube' && topVideo && topVideoViews >= 75000) {
    events.push(normalizeMemoryEvent({
      id: 'mem-marketing-youtube-top-video-proof',
      date: topVideoRecord?.publishDate || youtubeDate,
      time: 'Recent upload',
      title: 'A proof-led YouTube video broke out as a repeatable demand asset',
      body: `${topVideo} is currently the strongest tracked YouTube asset at ${topVideoRecord?.views || youtubeStats['Views (28 days)'] || '—'} views, making it a strong candidate for repurposing into website proof, email follow-up, and future content sequencing.`,
      category: 'Content milestone',
      department: 'Marketing / Content',
      impact: 'Medium',
      relatedEntities: ['goal-booking-conversion', 'goal-youtube-100k', 'decision-video-proof-series'],
      status: 'Active',
      route: '/reports/executive-timeline'
    }));
  }

  if (topCampaign && /4\./.test(topCampaign.roi || '')) {
    events.push(normalizeMemoryEvent({
      id: 'mem-marketing-campaign-proof-series',
      date: ga4Date,
      time: 'Current cycle',
      title: `${topCampaign.title} remains the strongest active marketing campaign`,
      body: `${topCampaign.title} is currently showing ${topCampaign.roi} ROI with ${topCampaign.leads} leads and ${topCampaign.revenue} attributed revenue, making it the clearest campaign benchmark for future executive reporting.`,
      category: 'Campaign performance',
      department: 'Marketing',
      impact: 'Medium',
      relatedEntities: ['decision-video-proof-series', 'goal-booking-conversion'],
      status: 'Active',
      route: '/reports/executive-timeline'
    }));
  }

  if (websiteSource.state === 'live-ga4' && users >= 5000 && Number(websiteMeta.enquiries || 0) === 0) {
    events.push(normalizeMemoryEvent({
      id: 'mem-marketing-conversion-visibility-gap',
      date: ga4Date,
      time: 'Live sync',
      title: 'Conversion capture is lagging behind visible website demand',
      body: `Live GA4 now confirms ${websiteMetrics.Users || websiteMetrics['Website Visitors'] || '—'} users, but the current booking, enquiry, and sign-up events remain flat. This should stay visible in executive memory so leadership does not mistake traffic visibility for value capture.`,
      category: 'Conversion watchpoint',
      department: 'Marketing / Website',
      impact: 'Medium',
      relatedEntities: ['goal-booking-conversion', 'decision-ga4-live-snapshot'],
      status: 'Active',
      route: '/reports/executive-timeline'
    }));
  }

  return events;
}

export function createMemoryService() {
  const memoryStore = new MemoryStore();
  const eventStore = new EventStore(memoryStore);
  const decisionStore = new DecisionStore(memoryStore);
  const goalStore = new GoalStore(memoryStore);
  const contextStore = new ContextStore(memoryStore);

  return Object.freeze({
    isInitialized() {
      return memoryStore.isInitialized();
    },
    getRetention() {
      return memoryStore.getRetention();
    },
    getTimeline(runtime = {}) {
      return sortTimeline(dedupeById([...eventStore.all(), ...marketingMilestones(runtime)]));
    },
    getDecisions() {
      return decisionStore.all();
    },
    getGoals() {
      return goalStore.all();
    },
    getContext(runtime = {}) {
      return {
        recurringIssues: contextStore.recurringIssues(),
        historicalTrends: contextStore.historicalTrends(),
        strategicThemes: contextStore.strategicThemes(),
        memoryHighlights: contextStore.highlights(),
        deterministic: normalizeCollection(contextStore.deterministicContext(runtime), normalizeHistoricalContext)
      };
    },
    getKnowledgeGraph(runtime = {}) {
      return buildKnowledgeGraph({
        timeline: this.getTimeline(runtime),
        decisions: this.getDecisions(),
        goals: this.getGoals(),
        context: this.getContext(runtime).deterministic,
        executive: runtime.executive || {},
        approvals: runtime.approvals || [],
        recommendations: runtime.recommendations || [],
        risks: runtime.risks || [],
        opportunities: runtime.opportunities || []
      });
    },
    getSearchIndex(runtime = {}) {
      const context = this.getContext(runtime);
      const entries = [
        ...this.getTimeline(runtime).map((item) => ({ id: `search-${item.id}`, type: 'Timeline', title: item.title, body: item.body, route: item.route || '/reports/executive-timeline', meta: `${item.date} · ${item.department}` })),
        ...this.getDecisions().map((item) => ({ id: `search-${item.id}`, type: 'Decision', title: item.title, body: item.summary, route: item.route || '/reports/decision-journal', meta: `${item.date} · ${item.status}` })),
        ...this.getGoals().map((item) => ({ id: `search-${item.id}`, type: 'Goal', title: item.title, body: item.summary, route: item.route || '/reports/strategic-goals', meta: `${item.progress}% · ${item.status}` })),
        ...context.deterministic.map((item) => ({ id: `search-${item.id}`, type: 'Historical Context', title: item.title, body: item.summary, route: item.route || '/ai-assistant/memory-context', meta: item.department || 'Executive Memory' })),
        ...(runtime.recommendations || []).map((item) => ({ id: `search-${item.id}`, type: 'Recommendation', title: item.recommendation, body: item.why, route: '/ceo', meta: `${item.priority} · ${item.suggestedOwner}` }))
      ];
      return entries;
    },
    getDashboardWorkspace(runtime = {}) {
      const decisions = this.getDecisions();
      const goals = this.getGoals();
      const timeline = this.getTimeline(runtime);
      const context = this.getContext(runtime);
      const graph = this.getKnowledgeGraph(runtime);
      return {
        status: this.isInitialized() ? 'Initialised' : 'Not initialised',
        historicalContext: context.deterministic.slice(0, 4),
        strategicGoals: goals.slice(0, 4),
        recentDecisions: decisions.slice(0, 4),
        milestones: timeline.filter((entry) => /milestone|record|launch|campaign|content/i.test(`${entry.category} ${entry.title}`)).slice(0, 4),
        highlights: context.memoryHighlights.slice(0, 4),
        graph,
        summary: {
          events: timeline.length,
          decisions: decisions.length,
          goals: goals.length,
          graphNodes: graph.summary.nodeCount,
          graphEdges: graph.summary.edgeCount,
          averageGoalProgress: goalStore.summary().averageProgress
        }
      };
    },
    getReportsContext(runtime = {}) {
      const context = this.getContext(runtime);
      const decisionSummary = decisionStore.summary();
      const goalSummary = goalStore.summary();
      const timeline = this.getTimeline(runtime);
      return {
        historicalContext: context.deterministic.slice(0, 3),
        previousDecisions: this.getDecisions().slice(0, 3),
        goalProgress: this.getGoals().slice(0, 3),
        milestones: timeline.filter((entry) => /milestone|record|launch|campaign|content/i.test(`${entry.category} ${entry.title}`)).slice(0, 3),
        summaryCards: [
          { label: 'Memory events', value: String(timeline.length), body: 'Permanent executive timeline coverage.' },
          { label: 'Decisions tracked', value: String(decisionSummary.total), body: `${decisionSummary.active} still active in memory.` },
          { label: 'Goals tracked', value: String(goalSummary.total), body: `${goalSummary.averageProgress}% average progress.` },
          { label: 'Recurring issues', value: String(context.recurringIssues.length), body: 'Cross-period themes now persist beyond the current dashboard state.' }
        ],
        retention: this.getRetention(),
        graphNote: `Knowledge graph currently maps ${this.getKnowledgeGraph(runtime).summary.nodeCount} nodes and ${this.getKnowledgeGraph(runtime).summary.edgeCount} relationships.`
      };
    },
    getSettingsWorkspace(runtime = {}) {
      const retention = this.getRetention();
      const dashboard = this.getDashboardWorkspace(runtime);
      return {
        retention,
        categories: retention.memoryCategories || [],
        summary: dashboard.summary,
        graph: dashboard.graph.summary,
        storeKey: 'ep-intelligence.executive-memory.v0.1'
      };
    },
    getWorkspace(runtime = {}) {
      return deepClone({
        initialized: this.isInitialized(),
        retention: this.getRetention(),
        timeline: this.getTimeline(runtime),
        decisions: this.getDecisions(),
        goals: this.getGoals(),
        context: this.getContext(runtime),
        dashboard: this.getDashboardWorkspace(runtime),
        reports: this.getReportsContext(runtime),
        graph: this.getKnowledgeGraph(runtime),
        searchIndex: this.getSearchIndex(runtime)
      });
    },
    toneForImpact: impactTone
  });
}
