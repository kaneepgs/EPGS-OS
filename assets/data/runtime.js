import { APP_CONFIG, currentModeConfig } from '../config/app-config.js';
import { buildReleaseWorkspace } from '../config/release-config.js';
import { RAW_MOCK_DATA } from './mock-data.js';
import { loadGeneratedGa4Snapshot, loadGeneratedYouTubeSnapshot, loadGeneratedGmailSnapshot } from './live-data-loader.js';
import { createProviderRegistry } from '../providers/provider-registry.js';
import { createTimelineService } from '../services/timeline-service.js';
import { createApprovalService } from '../services/approval-service.js';
import { createFinanceService } from '../services/finance-service.js';
import { createMarketingService } from '../services/marketing-service.js';
import { createCommunicationsService } from '../services/communications-service.js';
import { createReportService } from '../services/report-service.js';
import { createExecutiveService } from '../services/executive-service.js';
import { createIntegrationService } from '../services/integration-service.js';
import { createIntelligenceService } from '../services/intelligence-service.js';
import { createMemoryService } from '../memory/memory-service.js';

const GA4_SNAPSHOT = await loadGeneratedGa4Snapshot();
const YOUTUBE_SNAPSHOT = await loadGeneratedYouTubeSnapshot();
const GMAIL_SNAPSHOT = await loadGeneratedGmailSnapshot();
const providerRegistry = createProviderRegistry({ source: RAW_MOCK_DATA, mode: APP_CONFIG.mode, ga4Snapshot: GA4_SNAPSHOT, youtubeSnapshot: YOUTUBE_SNAPSHOT, gmailSnapshot: GMAIL_SNAPSHOT });
const LIVE_DATA_SUMMARY = providerRegistry.getLiveDataSummary();
const timelineService = createTimelineService(providerRegistry);
const approvalService = createApprovalService(providerRegistry);
const financeService = createFinanceService(providerRegistry);
const marketingService = createMarketingService(providerRegistry);
const communicationsService = createCommunicationsService(providerRegistry);
const reportService = createReportService(providerRegistry);
const executiveService = createExecutiveService(providerRegistry, { timelineService });
const memoryService = createMemoryService();
const intelligenceService = createIntelligenceService({
  executive: executiveService,
  finance: financeService,
  marketing: marketingService,
  communications: communicationsService,
  approval: approvalService,
  report: reportService,
  timeline: timelineService,
  memory: memoryService
});
const integrationService = createIntegrationService(providerRegistry, {
  executiveService,
  financeService,
  marketingService,
  communicationsService,
  approvalService,
  reportService,
  timelineService,
  intelligenceService,
  memoryService
});
const INTELLIGENCE = intelligenceService.getWorkspace();
const RELEASE_DATA = buildReleaseWorkspace({ liveData: LIVE_DATA_SUMMARY });

export const SERVICES = Object.freeze({
  executive: executiveService,
  finance: financeService,
  marketing: marketingService,
  communications: communicationsService,
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
const COMMUNICATIONS_DATA = communicationsService.getWorkspace();
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

function parseMetricNumber(value, fallback = 0) {
  if (typeof value === 'number') return value;
  if (value == null) return fallback;
  const source = String(value).trim().replace(/,/g, '');
  if (!source) return fallback;
  const match = source.match(/-?\d+(?:\.\d+)?/);
  if (!match) return fallback;
  let number = Number.parseFloat(match[0]);
  if (/\d(?:\.\d+)?\s*m\b/i.test(source)) number *= 1000000;
  else if (/\d(?:\.\d+)?\s*k\b/i.test(source)) number *= 1000;
  return number;
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
}

function toneFromScore(score) {
  if (score >= 85) return 'good';
  if (score >= 72) return 'info';
  if (score >= 62) return 'warn';
  return 'risk';
}

function youtubeMetricLookup(stats = []) {
  return Object.fromEntries(
    stats
      .filter((entry) => Array.isArray(entry) && entry.length >= 2)
      .map(([label, value]) => [String(label), value])
  );
}

function buildMarketingSourceStatus(marketing = {}) {
  const website = marketing.websiteAnalytics?.dataSource || {};
  const youtube = marketing.platforms?.youtube?.dataSource || {};
  const isLiveGa4 = website.state === 'live-ga4';
  const isLiveYouTube = youtube.state === 'live-youtube';
  const liveCount = Number(isLiveGa4) + Number(isLiveYouTube);

  return {
    liveCount,
    totalTracked: 2,
    label: liveCount === 2 ? 'Hybrid live marketing intelligence active' : liveCount === 1 ? 'Partially live marketing intelligence active' : 'Marketing intelligence is demo-led',
    body: liveCount === 2
      ? 'GA4 Website Analytics and YouTube are live through generated local snapshots, while the rest of the marketing estate remains in Demo Mode.'
      : liveCount === 1
        ? 'One marketing provider path is live and the rest of the marketing estate remains in Demo Mode.'
        : 'All marketing views are still using the demo baseline until a local GA4 or YouTube snapshot is available.',
    tone: liveCount === 2 ? 'good' : liveCount === 1 ? 'info' : 'warn',
    cards: [
      {
        label: 'Website Analytics',
        status: isLiveGa4 ? 'Live GA4 snapshot' : 'Demo fallback',
        body: website.body || 'Website Analytics source state unavailable.',
        tone: isLiveGa4 ? 'good' : 'warn'
      },
      {
        label: 'YouTube',
        status: isLiveYouTube ? 'Live YouTube snapshot' : 'Demo fallback',
        body: youtube.body || 'YouTube source state unavailable.',
        tone: isLiveYouTube ? 'good' : 'warn'
      },
      {
        label: 'Other channels',
        status: 'Demo Mode',
        body: 'Instagram, Facebook, LinkedIn, X, and campaign-level attribution remain demo-only in v1.1.',
        tone: 'neutral'
      }
    ]
  };
}

function buildMarketingHealthScore(marketing = {}, intelligence = {}, sourceStatus = buildMarketingSourceStatus(marketing)) {
  const websiteMetrics = metricLookup(marketing.websiteAnalytics?.metrics || []);
  const websiteMeta = marketing.websiteAnalytics?.snapshotMeta || {};
  const youtubeMetrics = youtubeMetricLookup(marketing.platforms?.youtube?.stats || []);
  const youtubeMeta = marketing.platforms?.youtube?.snapshotMeta || {};
  const topYoutubeItem = (marketing.contentLibrary?.items || [])
    .filter((item) => item.platform === 'YouTube')
    .sort((left, right) => parseMetricNumber(right.views) - parseMetricNumber(left.views))[0];
  const sessions = Number(websiteMeta.sessions || parseMetricNumber(websiteMetrics.Sessions));
  const sessionGrowth = Number(websiteMeta.sessionsDeltaPct ?? 0);
  const subscribers = Number(youtubeMeta.subscribers || parseMetricNumber(youtubeMetrics.Subscribers));
  const views28Days = Number(youtubeMeta.viewsLast28Days || parseMetricNumber(youtubeMetrics['Views (28 days)']));
  const uploadsLast28Days = Number(youtubeMeta.uploadsLast28Days || 0);
  const averageViews = Number(youtubeMeta.averageViewsPerVideo || parseMetricNumber(youtubeMetrics['Average Views / Video']));
  const bookings = Number(websiteMeta.bookings || parseMetricNumber(websiteMetrics['Fitting Bookings']));
  const enquiries = Number(websiteMeta.enquiries || parseMetricNumber(websiteMetrics['Contact Form Enquiries']));
  const signups = Number(websiteMeta.signups || parseMetricNumber(websiteMetrics['Email Sign-ups']));
  const conversionRate = Number(websiteMeta.conversionRate ?? parseMetricNumber(websiteMetrics['Conversion Rate']));
  const topVideoViews = parseMetricNumber(topYoutubeItem?.views);
  const contentPerformance = clamp(54 + Math.min(averageViews / 1800, 24) + Math.min(topVideoViews / 4500, 18));

  const components = [
    {
      label: 'Website sessions',
      value: websiteMetrics.Sessions || marketing.dashboard?.metrics?.visitors || '—',
      score: clamp(52 + Math.min(sessions / 180, 38)),
      body: 'Current live or demo website demand volume.'
    },
    {
      label: 'Session growth',
      value: Number.isFinite(sessionGrowth) ? formatDelta(sessionGrowth) : '—',
      score: clamp(58 + Math.max(sessionGrowth, -10) * 1.4),
      body: 'Movement versus the prior website period.'
    },
    {
      label: 'YouTube subscribers',
      value: youtubeMetrics.Subscribers || '—',
      score: clamp(50 + Math.min(subscribers / 3200, 34)),
      body: 'Authority-channel audience scale.'
    },
    {
      label: 'Recent YouTube views',
      value: youtubeMetrics['Views (28 days)'] || '—',
      score: clamp(50 + Math.min(views28Days / 7000, 34)),
      body: 'Tracked visibility over the active window.'
    },
    {
      label: 'Publishing cadence',
      value: youtubeMetrics['Publishing Activity'] || `${uploadsLast28Days} uploads in last 28 days`,
      score: clamp(50 + uploadsLast28Days * 3.8),
      body: 'Consistency of recent video output.'
    },
    {
      label: 'Content performance',
      value: topYoutubeItem?.views || youtubeMetrics['Average Views / Video'] || '—',
      score: contentPerformance,
      body: topYoutubeItem?.title ? `Top content: ${topYoutubeItem.title}.` : 'How strongly the best-performing proof content is landing.'
    },
    {
      label: 'Conversion capture',
      value: conversionRate > 0 ? `${conversionRate.toFixed(1)}%` : `${bookings + enquiries} key actions`,
      score: clamp(38 + Math.min(conversionRate * 10, 24) + Math.min((bookings + enquiries) * 1.5, 20) + Math.min(signups / 40, 12)),
      body: 'Bookings, enquiries, sign-ups, and conversion quality.'
    }
  ];

  const positiveSignals = [sessionGrowth > 0, views28Days > 150000, uploadsLast28Days >= 4].filter(Boolean).length;

  return {
    score: intelligence.health?.cmo?.score || Math.round(components.reduce((sum, item) => sum + item.score, 0) / components.length),
    label: intelligence.health?.cmo?.label || 'Stable',
    trend: sessionGrowth > 0 ? `Up ${formatDelta(sessionGrowth)} on website demand while YouTube remains the strongest authority channel.` : 'Mixed: authority remains strong, but website demand is not clearly improving.',
    confidence: sourceStatus.liveCount === 2 ? 'High' : sourceStatus.liveCount === 1 ? 'Medium' : 'Low',
    sourceStatus: `${sourceStatus.liveCount}/${sourceStatus.totalTracked} marketing provider paths live`,
    tone: toneFromScore(intelligence.health?.cmo?.score || 0),
    summary: positiveSignals >= 2
      ? 'Marketing is performing like a real executive growth system now: live website demand and live YouTube authority are visible together, but conversion capture still needs tightening.'
      : 'Marketing has promising signals, but the dashboard still needs either more live coverage or stronger conversion capture before confidence should increase materially.',
    components,
    sourceCards: sourceStatus.cards
  };
}

function buildMarketingIntelligenceReport({ marketing = {}, intelligence = {}, memory = {}, health = {}, sourceStatus = {}, website = {}, youtube = {} }) {
  const correlations = intelligence.correlations || [];
  const memoryTimeline = memory.timeline || [];
  const findings = correlations.filter((item) => [
    'ga4-live-demand-signal',
    'youtube-live-momentum',
    'youtube-website-demand-loop',
    'youtube-publishing-consistency',
    'website-enquiry-conversion-link',
    'content-opportunity-proof-loop'
  ].includes(item.id));
  const recommendations = (intelligence.recommendations || []).filter((item) => /CMO|Sales|Website/.test(item.suggestedOwner || '')).slice(0, 4);
  const marketingMilestones = [
    memoryTimeline.find((item) => /website milestone/i.test(item.category) || /live ga4 window/i.test(item.title)),
    memoryTimeline.find((item) => /youtube milestone/i.test(item.category)),
    memoryTimeline.find((item) => /content milestone/i.test(item.category)),
    memoryTimeline.find((item) => /campaign performance/i.test(item.category))
  ].filter((item, index, array) => item && array.findIndex((entry) => entry && entry.id === item.id) === index);

  return {
    title: 'Marketing Intelligence Report',
    subtitle: 'EP Intelligence v1.1 — Marketing Intelligence',
    summary: `Marketing health is ${health.score || '—'}/100 (${health.label || 'Stable'}) with ${health.sourceStatus || sourceStatus.label || 'hybrid source coverage'}. The strongest live signal is that YouTube authority and website demand are now visible together, while the clearest unresolved issue is turning that traffic into more booking intent.`,
    sourceStatus,
    health,
    ga4Summary: {
      title: website.source?.label || 'Website Analytics source',
      body: website.summary || marketing.websiteAnalytics?.summary || 'Website analytics summary unavailable.'
    },
    youtubeSummary: {
      title: youtube.source?.label || 'YouTube source',
      body: youtube.summary || marketing.platforms?.youtube?.dataSource?.body || 'YouTube summary unavailable.'
    },
    crossChannelFindings: findings,
    opportunities: recommendations.map((item) => ({
      title: item.recommendation,
      body: item.expectedBenefit,
      owner: item.suggestedOwner,
      priority: item.priority,
      tone: item.tone || 'warn'
    })),
    risks: correlations.filter((item) => item.tone === 'warn' || item.tone === 'risk').slice(0, 4).map((item) => ({
      title: item.title,
      body: item.financialImpact || item.executiveSummary,
      tone: item.tone || 'warn'
    })),
    recommendedActions: recommendations,
    memoryMilestones: marketingMilestones
  };
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

function buildCeoYoutubeIntelligence(youtubePlatform = {}) {
  const metrics = youtubeMetricLookup(youtubePlatform.stats || []);
  const source = youtubePlatform.dataSource || { label: 'Demo fallback active', body: 'YouTube is using demo data.', tone: 'warn', state: 'demo-fallback' };
  const snapshotMeta = youtubePlatform.snapshotMeta || {};

  return {
    source,
    summary: source.state === 'live-youtube'
      ? `Live YouTube channel data is now active for ${source.channelId || 'the configured channel'}. The CEO can now see subscriber movement, tracked view momentum, publishing cadence, and top-video performance without leaving EP Intelligence.`
      : 'YouTube intelligence is currently using demo data until a local live snapshot is available.',
    channelId: source.channelId || '',
    syncedAt: source.syncedAt || null,
    isLive: source.state === 'live-youtube',
    kpis: [
      {
        iconName: 'sparkles',
        label: 'Subscribers',
        value: metrics.Subscribers || '—',
        body: 'Current channel size as a direct executive trust and authority signal.',
        meta: source.label
      },
      {
        iconName: 'grid',
        label: 'Total Views',
        value: metrics['Total Views'] || '—',
        body: 'All-time channel visibility, useful for understanding accumulated authority.',
        meta: source.label
      },
      {
        iconName: 'trending-up',
        label: 'Views (28 days)',
        value: metrics['Views (28 days)'] || '—',
        body: 'Tracked recent visibility used to judge current content momentum.',
        meta: snapshotMeta.historyCoverageLabel || source.label
      },
      {
        iconName: 'target',
        label: 'Subscribers Gained',
        value: metrics['Subscribers Gained'] || '—',
        body: 'Tracked subscriber movement over the active local history window.',
        meta: snapshotMeta.historyCoverageLabel || source.label
      },
      {
        iconName: 'book-open',
        label: 'Videos Published',
        value: metrics['Videos Published'] || '—',
        body: 'Publishing volume helps the CEO judge consistency, not just isolated hits.',
        meta: source.label
      },
      {
        iconName: 'pulse',
        label: 'Audience Growth',
        value: metrics['Audience Growth'] || '—',
        body: 'Subscriber growth rate over the active tracking window.',
        meta: snapshotMeta.historyCoverageLabel || source.label
      }
    ]
  };
}

const CEO_WEBSITE_INTELLIGENCE = buildCeoWebsiteIntelligence(CMO_DATA.websiteAnalytics);
const CEO_YOUTUBE_INTELLIGENCE = buildCeoYoutubeIntelligence(CMO_DATA.platforms?.youtube);
const MEMORY_DATA = memoryService.getWorkspace({
  executive: CEO_DATA,
  finance: CFO_DATA,
  marketing: CMO_DATA,
  communications: COMMUNICATIONS_DATA,
  approvals: flattenApprovalGroups(approvalService.getWorkspace().groups),
  recommendations: INTELLIGENCE.recommendations,
  risks: CEO_DATA.executiveRisks,
  opportunities: CEO_DATA.executiveOpportunities
});
const MARKETING_SOURCE_STATUS = buildMarketingSourceStatus(CMO_DATA);
const MARKETING_HEALTH = buildMarketingHealthScore(CMO_DATA, INTELLIGENCE, MARKETING_SOURCE_STATUS);
const MARKETING_INTELLIGENCE_REPORT = buildMarketingIntelligenceReport({
  marketing: CMO_DATA,
  intelligence: INTELLIGENCE,
  memory: MEMORY_DATA,
  health: MARKETING_HEALTH,
  sourceStatus: MARKETING_SOURCE_STATUS,
  website: CEO_WEBSITE_INTELLIGENCE,
  youtube: CEO_YOUTUBE_INTELLIGENCE
});

export const WORKSPACE_DATA = Object.freeze({
  brand: executiveService.getBrand(),
  ceo: {
    ...CEO_DATA,
    businessTimeline: [...INTELLIGENCE.timelineEvents, ...MEMORY_DATA.timeline, ...CEO_DATA.businessTimeline],
    intelligence: INTELLIGENCE.ceo,
    websiteIntelligence: CEO_WEBSITE_INTELLIGENCE,
    youtubeIntelligence: CEO_YOUTUBE_INTELLIGENCE,
    marketingIntelligence: {
      health: MARKETING_HEALTH,
      report: MARKETING_INTELLIGENCE_REPORT,
      sourceStatus: MARKETING_SOURCE_STATUS
    },
    memory: MEMORY_DATA.dashboard,
    executiveInbox: COMMUNICATIONS_DATA,
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
  communications: COMMUNICATIONS_DATA,
  cmo: {
    ...CMO_DATA,
    dashboard: {
      ...CMO_DATA.dashboard,
      healthScore: INTELLIGENCE.health.cmo.score,
      summary: INTELLIGENCE.narratives.departmentSummaries.cmo.summary,
      aiSummary: INTELLIGENCE.cmo.aiSummary,
      weeklyBriefing: INTELLIGENCE.cmo.weeklyBriefing,
      marketingHealth: MARKETING_HEALTH
    },
    socialOverview: {
      ...CMO_DATA.socialOverview,
      sourceStatus: MARKETING_SOURCE_STATUS
    },
    websiteAnalytics: {
      ...CMO_DATA.websiteAnalytics,
      sourceStatus: MARKETING_SOURCE_STATUS
    },
    contentLibrary: {
      ...CMO_DATA.contentLibrary,
      sourceStatus: MARKETING_SOURCE_STATUS
    },
    aiMarketingAdvisor: {
      ...CMO_DATA.aiMarketingAdvisor,
      executiveSummary: INTELLIGENCE.cmo.executiveSummary,
      weeklyBriefing: INTELLIGENCE.cmo.weeklyBriefing
    },
    reports: {
      ...CMO_DATA.reports,
      sourceStatus: MARKETING_SOURCE_STATUS,
      marketingIntelligence: MARKETING_INTELLIGENCE_REPORT
    },
    intelligence: INTELLIGENCE.cmo
  },
  approvals: approvalService.getWorkspace(),
  reports: {
    ...REPORT_DATA,
    intelligence: INTELLIGENCE.reports,
    memory: MEMORY_DATA.reports,
    communications: COMMUNICATIONS_DATA,
    marketingIntelligence: MARKETING_INTELLIGENCE_REPORT
  },
  aiAssistant: {
    ...AI_DATA,
    askWorkspace: INTELLIGENCE.aiAssistant,
    intelligence: INTELLIGENCE.aiAssistant,
    communications: COMMUNICATIONS_DATA,
    memory: MEMORY_DATA
  },
  memory: MEMORY_DATA,
  intelligence: INTELLIGENCE,
  placeholders: executiveService.getPlaceholderModules(),
  settings: {
    ...integrationService.getSettingsWorkspace(providerRegistry.getDomainProvider('settings').getSettingsWorkspace(), MEMORY_DATA),
    release: RELEASE_DATA
  },
  shortcuts: executiveService.getShortcuts()
});

export const APP_RUNTIME = Object.freeze({
  config: {
    ...APP_CONFIG,
    activeMode: currentModeConfig(),
    liveData: LIVE_DATA_SUMMARY
  },
  release: RELEASE_DATA,
  providers: providerRegistry.listProviders(),
  bindings: providerRegistry.describeBindings(),
  integrations: integrationService.getIntegrationStatus(),
  architecture: integrationService.getProviderArchitecture(),
  intelligence: {
    version: INTELLIGENCE.engine.version,
    modules: INTELLIGENCE.engine.modules,
    generatedAt: INTELLIGENCE.generatedAt,
    insightCount: INTELLIGENCE.insights.executive.length,
    recommendationCount: INTELLIGENCE.recommendations.length,
    marketingHealthScore: MARKETING_HEALTH.score,
    marketingSourceStatus: MARKETING_HEALTH.sourceStatus,
    inboxVisibleItems: COMMUNICATIONS_DATA.counts.visible
  },
  memory: {
    initialized: MEMORY_DATA.initialized,
    timelineCount: MEMORY_DATA.timeline.length,
    decisionCount: MEMORY_DATA.decisions.length,
    goalCount: MEMORY_DATA.goals.length,
    graphNodes: MEMORY_DATA.graph.summary.nodeCount,
    graphEdges: MEMORY_DATA.graph.summary.edgeCount
  },
  communications: {
    visibleItems: COMMUNICATIONS_DATA.counts.visible,
    completedItems: COMMUNICATIONS_DATA.counts.completed,
    account: COMMUNICATIONS_DATA.providerSummary.account,
    health: COMMUNICATIONS_DATA.providerSummary.health
  }
});
