import { deepClone, normalizeCollection, normalizeHistoricalContext } from '../contracts/data-contracts.js';
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
    getTimeline() {
      return eventStore.all();
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
        timeline: this.getTimeline(),
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
        ...this.getTimeline().map((item) => ({ id: `search-${item.id}`, type: 'Timeline', title: item.title, body: item.body, route: item.route || '/reports/executive-timeline', meta: `${item.date} · ${item.department}` })),
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
      const timeline = this.getTimeline();
      const context = this.getContext(runtime);
      const graph = this.getKnowledgeGraph(runtime);
      return {
        status: this.isInitialized() ? 'Initialised' : 'Not initialised',
        historicalContext: context.deterministic.slice(0, 4),
        strategicGoals: goals.slice(0, 4),
        recentDecisions: decisions.slice(0, 4),
        milestones: eventStore.milestones(4),
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
      return {
        historicalContext: context.deterministic.slice(0, 3),
        previousDecisions: this.getDecisions().slice(0, 3),
        goalProgress: this.getGoals().slice(0, 3),
        milestones: eventStore.milestones(3),
        summaryCards: [
          { label: 'Memory events', value: String(this.getTimeline().length), body: 'Permanent executive timeline coverage.' },
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
        timeline: this.getTimeline(),
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
