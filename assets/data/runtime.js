import { APP_CONFIG, currentModeConfig } from '../config/app-config.js';
import { RAW_MOCK_DATA } from './mock-data.js';
import { loadGeneratedGa4Snapshot } from './live-data-loader.js';
import { createProviderRegistry } from '../providers/provider-registry.js';
import { createTimelineService } from '../services/timeline-service.js';
import { createApprovalService } from '../services/approval-service.js';
import { createFinanceService } from '../services/finance-service.js';
import { createMarketingService } from '../services/marketing-service.js';
import { createReportService } from '../services/report-service.js';
import { createExecutiveService } from '../services/executive-service.js';
import { createIntegrationService } from '../services/integration-service.js';
import { createIntelligenceService } from '../services/intelligence-service.js';
import { createMemoryService } from '../memory/memory-service.js';

const GA4_SNAPSHOT = await loadGeneratedGa4Snapshot();
const providerRegistry = createProviderRegistry({ source: RAW_MOCK_DATA, mode: APP_CONFIG.mode, ga4Snapshot: GA4_SNAPSHOT });
const timelineService = createTimelineService(providerRegistry);
const approvalService = createApprovalService(providerRegistry);
const financeService = createFinanceService(providerRegistry);
const marketingService = createMarketingService(providerRegistry);
const reportService = createReportService(providerRegistry);
const executiveService = createExecutiveService(providerRegistry, { timelineService });
const memoryService = createMemoryService();
const intelligenceService = createIntelligenceService({
  executive: executiveService,
  finance: financeService,
  marketing: marketingService,
  approval: approvalService,
  report: reportService,
  timeline: timelineService,
  memory: memoryService
});
const integrationService = createIntegrationService(providerRegistry, {
  executiveService,
  financeService,
  marketingService,
  approvalService,
  reportService,
  timelineService,
  intelligenceService,
  memoryService
});
const INTELLIGENCE = intelligenceService.getWorkspace();

export const SERVICES = Object.freeze({
  executive: executiveService,
  finance: financeService,
  marketing: marketingService,
  approval: approvalService,
  report: reportService,
  timeline: timelineService,
  integration: integrationService,
  intelligence: intelligenceService,
  memory: memoryService
});

const CEO_DATA = executiveService.getCeoDashboard();
const CFO_DATA = financeService.getWorkspace();
const CMO_DATA = marketingService.getWorkspace();
const REPORT_DATA = reportService.getWorkspace();
const AI_DATA = executiveService.getAiWorkspace();

function flattenApprovalGroups(groups = {}) {
  return Object.values(groups).flat();
}

function metricLookup(metrics = []) {
  return Object.fromEntries(
    metrics
      .filter((entry) => Array.isArray(entry) && entry.length >= 2)
      .map(([label, value]) => [String(label), value])
  );
}

function formatDelta(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '—';
  return `${number >= 0 ? '+' : ''}${number.toFixed(1)}%`;
}

function buildCeoWebsiteIntelligence(websiteAnalytics = {}) {
  const metrics = metricLookup(websiteAnalytics.metrics || []);
  const source = websiteAnalytics.dataSource || { label: 'Demo fallback active', body: 'Website Analytics is using demo data.', tone: 'warn', state: 'demo-fallback' };
  const snapshotMeta = websiteAnalytics.snapshotMeta || {};
  const sessionsDelta = Number(snapshotMeta.sessionsDeltaPct);

  return {
    source,
    summary: websiteAnalytics.summary || 'Website intelligence is not currently available.',
    propertyId: source.propertyId || '',
    syncedAt: source.syncedAt || null,
    isLive: source.state === 'live-ga4',
    kpis: [
      {
        iconName: 'grid',
        label: 'Website Users',
        value: metrics.Users || metrics['Website Visitors'] || '—',
        body: 'The clearest CEO-level view of current website audience scale.',
        meta: source.label
      },
      {
        iconName: 'trending-up',
        label: 'Sessions',
        value: metrics.Sessions || '—',
        body: 'Session volume shows how much current website demand is actually arriving.',
        meta: source.label
      },
      {
        iconName: 'target',
        label: 'New Users',
        value: metrics['New Users'] || '—',
        body: 'This shows how much fresh audience the website is attracting right now.',
        meta: source.label
      },
      {
        iconName: 'home',
        label: 'Returning Users',
        value: metrics['Returning Visitors'] || '—',
        body: 'Returning visitors help the CEO judge whether trust and repeat intent are compounding.',
        meta: source.label
      },
      {
        iconName: 'pulse',
        label: 'Bounce Rate',
        value: metrics['Bounce Rate'] || '—',
        body: 'This is the quickest live signal for whether traffic is landing with enough relevance.',
        meta: source.label
      },
      {
        iconName: 'sparkles',
        label: 'Sessions vs Prior Period',
        value: Number.isFinite(sessionsDelta) ? formatDelta(sessionsDelta) : '—',
        body: Number.isFinite(sessionsDelta)
          ? 'Current session momentum compared with the prior period from the local GA4 snapshot.'
          : 'Requires a live GA4 snapshot to compare against the prior period.',
        meta: source.label
      }
    ]
  };
}

const CEO_WEBSITE_INTELLIGENCE = buildCeoWebsiteIntelligence(CMO_DATA.websiteAnalytics);
const MEMORY_DATA = memoryService.getWorkspace({
  executive: CEO_DATA,
  finance: CFO_DATA,
  marketing: CMO_DATA,
  approvals: flattenApprovalGroups(approvalService.getWorkspace().groups),
  recommendations: INTELLIGENCE.recommendations,
  risks: CEO_DATA.executiveRisks,
  opportunities: CEO_DATA.executiveOpportunities
});

export const WORKSPACE_DATA = Object.freeze({
  brand: executiveService.getBrand(),
  ceo: {
    ...CEO_DATA,
    businessTimeline: [...INTELLIGENCE.timelineEvents, ...MEMORY_DATA.timeline, ...CEO_DATA.businessTimeline],
    intelligence: INTELLIGENCE.ceo,
    websiteIntelligence: CEO_WEBSITE_INTELLIGENCE,
    memory: MEMORY_DATA.dashboard,
    businessHealthScore: {
      ...CEO_DATA.businessHealthScore,
      overall: INTELLIGENCE.health.overall.score,
      confidence: INTELLIGENCE.insights.topInsight.confidence,
      direction: `${INTELLIGENCE.health.overall.label} with deterministic executive insight coverage`,
      modules: CEO_DATA.businessHealthScore.modules.map((item) => {
        if (item.module === 'Finance') return { ...item, score: INTELLIGENCE.health.cfo.score, summary: `Generated by HealthEngine: ${INTELLIGENCE.health.cfo.label.toLowerCase()} with margin, cash, and working-capital weighting.` };
        if (item.module === 'Marketing') return { ...item, score: INTELLIGENCE.health.cmo.score, summary: `Generated by HealthEngine: ${INTELLIGENCE.health.cmo.label.toLowerCase()} with audience, conversion, and channel-focus weighting.` };
        return item;
      })
    }
  },
  cfo: {
    ...CFO_DATA,
    welcome: {
      ...CFO_DATA.welcome,
      score: INTELLIGENCE.health.cfo.score,
      label: INTELLIGENCE.health.cfo.label,
      narrative: INTELLIGENCE.narratives.departmentSummaries.cfo.summary
    },
    commentary: INTELLIGENCE.cfo.commentary,
    weeklyBriefing: INTELLIGENCE.cfo.weeklyBriefing,
    intelligence: INTELLIGENCE.cfo
  },
  cmo: {
    ...CMO_DATA,
    dashboard: {
      ...CMO_DATA.dashboard,
      healthScore: INTELLIGENCE.health.cmo.score,
      summary: INTELLIGENCE.narratives.departmentSummaries.cmo.summary,
      aiSummary: INTELLIGENCE.cmo.aiSummary,
      weeklyBriefing: INTELLIGENCE.cmo.weeklyBriefing
    },
    aiMarketingAdvisor: {
      ...CMO_DATA.aiMarketingAdvisor,
      executiveSummary: INTELLIGENCE.cmo.executiveSummary,
      weeklyBriefing: INTELLIGENCE.cmo.weeklyBriefing
    },
    intelligence: INTELLIGENCE.cmo
  },
  approvals: approvalService.getWorkspace(),
  reports: {
    ...REPORT_DATA,
    intelligence: INTELLIGENCE.reports,
    memory: MEMORY_DATA.reports
  },
  aiAssistant: {
    ...AI_DATA,
    askWorkspace: INTELLIGENCE.aiAssistant,
    intelligence: INTELLIGENCE.aiAssistant,
    memory: MEMORY_DATA
  },
  memory: MEMORY_DATA,
  intelligence: INTELLIGENCE,
  placeholders: executiveService.getPlaceholderModules(),
  settings: integrationService.getSettingsWorkspace(providerRegistry.getDomainProvider('settings').getSettingsWorkspace(), MEMORY_DATA),
  shortcuts: executiveService.getShortcuts()
});

export const APP_RUNTIME = Object.freeze({
  config: {
    ...APP_CONFIG,
    activeMode: currentModeConfig(),
    liveData: providerRegistry.getLiveDataSummary()
  },
  providers: providerRegistry.listProviders(),
  bindings: providerRegistry.describeBindings(),
  integrations: integrationService.getIntegrationStatus(),
  architecture: integrationService.getProviderArchitecture(),
  intelligence: {
    version: INTELLIGENCE.engine.version,
    modules: INTELLIGENCE.engine.modules,
    generatedAt: INTELLIGENCE.generatedAt,
    insightCount: INTELLIGENCE.insights.executive.length,
    recommendationCount: INTELLIGENCE.recommendations.length
  },
  memory: {
    initialized: MEMORY_DATA.initialized,
    timelineCount: MEMORY_DATA.timeline.length,
    decisionCount: MEMORY_DATA.decisions.length,
    goalCount: MEMORY_DATA.goals.length,
    graphNodes: MEMORY_DATA.graph.summary.nodeCount,
    graphEdges: MEMORY_DATA.graph.summary.edgeCount
  }
});
