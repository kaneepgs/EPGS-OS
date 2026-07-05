import { APP_CONFIG, currentModeConfig } from '../config/app-config.js';
import { buildReleaseWorkspace } from '../config/release-config.js';
import { RAW_MOCK_DATA } from './mock-data.js';
import { loadGeneratedGa4Snapshot, loadGeneratedYouTubeSnapshot, loadGeneratedSocialSnapshot, loadGeneratedGmailSnapshot, loadGeneratedCalendarSnapshot } from './live-data-loader.js';
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
import { createActionService } from '../services/action-service.js';
import { createMemoryService } from '../memory/memory-service.js';

const GA4_SNAPSHOT = await loadGeneratedGa4Snapshot();
const YOUTUBE_SNAPSHOT = await loadGeneratedYouTubeSnapshot();
const SOCIAL_SNAPSHOT = await loadGeneratedSocialSnapshot();
const GMAIL_SNAPSHOT = await loadGeneratedGmailSnapshot();
const CALENDAR_SNAPSHOT = await loadGeneratedCalendarSnapshot();
const providerRegistry = createProviderRegistry({ source: RAW_MOCK_DATA, mode: APP_CONFIG.mode, ga4Snapshot: GA4_SNAPSHOT, youtubeSnapshot: YOUTUBE_SNAPSHOT, socialSnapshot: SOCIAL_SNAPSHOT, gmailSnapshot: GMAIL_SNAPSHOT, calendarSnapshot: CALENDAR_SNAPSHOT });
const LIVE_DATA_SUMMARY = providerRegistry.getLiveDataSummary();
const timelineService = createTimelineService(providerRegistry);
const approvalService = createApprovalService(providerRegistry);
const financeService = createFinanceService(providerRegistry);
const marketingService = createMarketingService(providerRegistry);
const communicationsService = createCommunicationsService(providerRegistry);
const reportService = createReportService(providerRegistry);
const executiveService = createExecutiveService(providerRegistry, { timelineService });
const memoryService = createMemoryService();
let cachedIntelligenceWorkspace = { recommendations: [] };
const actionService = createActionService({
  executiveService,
  financeService,
  marketingService,
  communicationsService,
  approvalService,
  reportService,
  timelineService,
  memoryService,
  intelligenceProvider: () => cachedIntelligenceWorkspace
});
const intelligenceService = createIntelligenceService({
  executive: executiveService,
  finance: financeService,
  marketing: marketingService,
  communications: communicationsService,
  approval: approvalService,
  report: reportService,
  timeline: timelineService,
  memory: memoryService,
  actions: actionService
});
cachedIntelligenceWorkspace = intelligenceService.getWorkspace();
const integrationService = createIntegrationService(providerRegistry, {
  executiveService,
  financeService,
  marketingService,
  communicationsService,
  approvalService,
  reportService,
  timelineService,
  intelligenceService,
  memoryService,
  actionService
});
const INTELLIGENCE = intelligenceService.getWorkspace();
const ACTIONS_DATA = actionService.getWorkspace();
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
  actions: actionService,
  memory: memoryService
});

const CEO_DATA = executiveService.getCeoDashboard();
const CFO_DATA = financeService.getWorkspace();
const CMO_DATA = marketingService.getWorkspace();
const REPORT_DATA = reportService.getWorkspace();
const COMMUNICATIONS_DATA = communicationsService.getWorkspace();
const OPERATIONS_DATA = timelineService.getOperationsWorkspace();
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

function average(values = []) {
  const valid = values.filter((value) => Number.isFinite(value));
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0;
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
  const socialPlatforms = [
    ['instagram', 'Instagram'],
    ['facebook', 'Facebook'],
    ['linkedin', 'LinkedIn'],
    ['x', 'X']
  ].map(([key, label]) => {
    const platform = marketing.platforms?.[key] || {};
    const source = platform.dataSource || {};
    const isLive = String(source.state || '').startsWith('live-');
    return {
      label,
      status: isLive ? 'Live social snapshot' : 'Demo fallback',
      body: source.body || `${label} source state unavailable.`,
      tone: source.tone || (isLive ? 'good' : 'warn'),
      state: source.state || 'demo-fallback'
    };
  });

  const cards = [
    {
      label: 'Website Analytics',
      status: website.state === 'live-ga4' ? 'Live GA4 snapshot' : 'Demo fallback',
      body: website.body || 'Website Analytics source state unavailable.',
      tone: website.state === 'live-ga4' ? 'good' : 'warn',
      state: website.state || 'demo-fallback'
    },
    {
      label: 'YouTube',
      status: youtube.state === 'live-youtube' ? 'Live YouTube snapshot' : 'Demo fallback',
      body: youtube.body || 'YouTube source state unavailable.',
      tone: youtube.state === 'live-youtube' ? 'good' : 'warn',
      state: youtube.state || 'demo-fallback'
    },
    ...socialPlatforms
  ];

  const liveCount = cards.filter((item) => String(item.state).startsWith('live-')).length;
  const socialLiveCount = socialPlatforms.filter((item) => String(item.state).startsWith('live-')).length;
  const totalTracked = cards.length;

  return {
    liveCount,
    totalTracked,
    socialLiveCount,
    label:
      liveCount === totalTracked
        ? 'Fully live marketing intelligence active'
        : liveCount >= 3
          ? 'Mostly live marketing intelligence active'
          : liveCount >= 1
            ? 'Hybrid live marketing intelligence active'
            : 'Marketing intelligence is demo-led',
    body:
      liveCount === totalTracked
        ? 'GA4, YouTube, Instagram, Facebook, LinkedIn, and X are all flowing through live snapshot-backed provider paths.'
        : liveCount >= 3
          ? `Several marketing provider paths are now live, including ${socialLiveCount}/4 social platforms, while the remaining channels safely stay in Demo Mode.`
          : liveCount >= 1
            ? `At least one marketing provider path is live, while the rest of the estate safely stays demo-backed. Social coverage currently has ${socialLiveCount}/4 live platform paths.`
            : 'All marketing views are still using the demo baseline until local snapshot files are supplied.',
    tone: liveCount >= 3 ? 'good' : liveCount >= 1 ? 'info' : 'warn',
    cards
  };
}

function buildMarketingAttributionSummary(marketing = {}) {
  const existing = marketing.campaignPerformance?.attribution;
  if (existing?.touchpoints?.length) return existing;

  const rankings = marketing.socialOverview?.rankings || [];
  const totalScore = rankings.reduce((sum, item) => sum + Number(item.score || 0), 0) || 1;
  return {
    summary: `${rankings[0]?.platform || 'The strongest channel'} currently carries the clearest assisted-demand signal, while ${rankings[rankings.length - 1]?.platform || 'the weakest channel'} remains the lightest commercial return channel.`,
    revenueAttributed: marketing.campaignPerformance?.revenueAttribution || '£18.6k',
    bestAssistedChannel: rankings[0]?.platform || 'YouTube',
    bestConversionChannel: rankings[1]?.platform || rankings[0]?.platform || 'Instagram',
    weakestChannel: rankings[rankings.length - 1]?.platform || 'X',
    confidence: 'Low',
    touchpoints: rankings.map((item) => ({
      channel: item.platform,
      share: `${Math.round((Number(item.score || 0) / totalScore) * 100)}%`,
      note: item.note
    })),
    mix: rankings.map((item) => ({
      channel: item.platform,
      share: Math.round((Number(item.score || 0) / totalScore) * 100),
      note: item.note
    }))
  };
}

function buildCompetitorBenchmarkSummary(marketing = {}) {
  const existing = marketing.competitorAnalysis?.benchmark;
  if (existing?.benchmark?.length) return existing;

  const rankings = marketing.socialOverview?.rankings || [];
  const competitors = marketing.competitorAnalysis?.competitors || [];
  const competitorGrowthAvg = average(competitors.map((item) => parseMetricNumber(item.growth, 0)));
  const epGrowthAvg = average(rankings.map((item) => parseMetricNumber(item.growth, 0)));
  return {
    summary: epGrowthAvg >= competitorGrowthAvg
      ? `EP's tracked social growth is ahead of the competitor baseline, led by ${rankings[0]?.platform || 'the strongest channel'}.`
      : `EP's tracked social growth is slightly behind the competitor baseline, so the best route is to press the strongest proof-led channels harder instead of spreading effort evenly.`,
    competitorGrowthAvg: formatDelta(competitorGrowthAvg),
    epGrowthAvg: formatDelta(epGrowthAvg),
    leader: rankings[0]?.platform || 'YouTube',
    laggard: rankings[rankings.length - 1]?.platform || 'X',
    benchmark: rankings.map((item) => ({
      platform: item.platform,
      score: item.score,
      gap: `${item.score >= 72 ? '+' : ''}${item.score - 72} pts vs market baseline`,
      standing: item.score >= 85 ? 'Leader' : item.score >= 75 ? 'Competitive' : item.score >= 65 ? 'Challenger' : 'Underweight',
      note: item.note
    }))
  };
}

function buildSocialHealthScore(marketing = {}, sourceStatus = buildMarketingSourceStatus(marketing)) {
  const rankings = marketing.socialOverview?.rankings || [];
  const combined = marketing.socialOverview?.combined || {};
  const attribution = buildMarketingAttributionSummary(marketing);
  const benchmark = buildCompetitorBenchmarkSummary(marketing);
  const top = rankings[0] || {};
  const weakest = rankings[rankings.length - 1] || {};
  const averageScore = average(rankings.map((item) => Number(item.score || 0)));
  const averageGrowth = average(rankings.map((item) => parseMetricNumber(item.growth, 0)));
  const bestShare = Number(attribution.mix?.[0]?.share || 0);
  const score = Math.round(clamp(
    averageScore * 0.45
    + Math.max(averageGrowth, 0) * 4.2
    + Math.min(bestShare * 0.55, 18)
    + Math.min(sourceStatus.socialLiveCount * 5, 20)
  ));

  const components = [
    {
      label: 'Platform strength',
      value: `${Math.round(averageScore || 0)} / 100 avg`,
      score: clamp(averageScore || 0),
      body: `${top.platform || 'Top platform'} leads the current estate, while ${weakest.platform || 'the weakest platform'} is the lowest-return channel.`
    },
    {
      label: 'Audience growth',
      value: formatDelta(averageGrowth || 0),
      score: clamp(58 + Math.max(averageGrowth, -4) * 5),
      body: 'Average growth across the tracked social estate.'
    },
    {
      label: 'Cross-platform scale',
      value: combined.followers || '—',
      score: clamp(54 + Math.min(parseMetricNumber(combined.followers, 0) / 3200, 36)),
      body: 'Combined audience across YouTube, Instagram, Facebook, LinkedIn, and X.'
    },
    {
      label: 'Attribution clarity',
      value: attribution.revenueAttributed || '—',
      score: clamp(52 + Math.min((attribution.mix || []).length * 7, 26) + Math.min(bestShare * 0.35, 12)),
      body: attribution.summary
    },
    {
      label: 'Competitive position',
      value: benchmark.epGrowthAvg || '—',
      score: clamp(60 + Math.max(parseMetricNumber(benchmark.epGrowthAvg, 0) - parseMetricNumber(benchmark.competitorGrowthAvg, 0), -5) * 4),
      body: benchmark.summary
    }
  ];

  return {
    score,
    label: score >= 85 ? 'Strong' : score >= 75 ? 'Stable' : score >= 65 ? 'Needs attention' : 'At risk',
    trend: `${top.platform || 'The top channel'} leads the social estate while ${weakest.platform || 'the weakest channel'} remains the lowest-return route.`,
    confidence: sourceStatus.socialLiveCount >= 3 ? 'High' : sourceStatus.socialLiveCount >= 1 ? 'Medium' : 'Low',
    sourceStatus: `${sourceStatus.socialLiveCount}/4 live social platform paths`,
    tone: toneFromScore(score),
    summary: `Social performance is healthiest when the strongest proof-led theme is adapted across the top channels instead of being rebuilt separately for each platform. ${benchmark.summary}`,
    components,
    topPlatform: top.platform || 'YouTube',
    weakestPlatform: weakest.platform || 'X',
    sourceCards: sourceStatus.cards.filter((item) => ['Instagram', 'Facebook', 'LinkedIn', 'X'].includes(item.label)),
    attribution,
    competitorBenchmark: benchmark
  };
}

function buildMarketingHealthScore(marketing = {}, intelligence = {}, sourceStatus = buildMarketingSourceStatus(marketing)) {
  const websiteMetrics = metricLookup(marketing.websiteAnalytics?.metrics || []);
  const websiteMeta = marketing.websiteAnalytics?.snapshotMeta || {};
  const youtubeMetrics = youtubeMetricLookup(marketing.platforms?.youtube?.stats || []);
  const youtubeMeta = marketing.platforms?.youtube?.snapshotMeta || {};
  const socialHealth = buildSocialHealthScore(marketing, sourceStatus);
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
      label: 'YouTube authority',
      value: youtubeMetrics.Subscribers || '—',
      score: clamp(50 + Math.min(subscribers / 3200, 34)),
      body: 'Authority-channel audience scale and momentum.'
    },
    {
      label: 'Social Health Score',
      value: `${socialHealth.score} / 100`,
      score: socialHealth.score,
      body: socialHealth.summary
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
    },
    {
      label: 'Publishing cadence',
      value: youtubeMetrics['Publishing Activity'] || `${uploadsLast28Days} uploads in last 28 days`,
      score: clamp(50 + uploadsLast28Days * 3.8),
      body: 'Consistency of recent video output.'
    }
  ];

  const positiveSignals = [sessionGrowth > 0, views28Days > 150000, uploadsLast28Days >= 4, socialHealth.score >= 80].filter(Boolean).length;
  const intelligenceScore = intelligence.health?.cmo?.score || Math.round(components.reduce((sum, item) => sum + item.score, 0) / components.length);
  const blendedScore = Math.round(average([intelligenceScore, socialHealth.score, components.reduce((sum, item) => sum + item.score, 0) / components.length]));

  return {
    score: blendedScore,
    label: intelligence.health?.cmo?.label || (blendedScore >= 85 ? 'Strong' : blendedScore >= 75 ? 'Stable' : 'Needs attention'),
    trend: sessionGrowth > 0
      ? `Up ${formatDelta(sessionGrowth)} on website demand while ${socialHealth.topPlatform} is leading the social estate.`
      : `Mixed: ${socialHealth.topPlatform} remains strongest, but conversion capture still needs tightening.`,
    confidence: sourceStatus.liveCount >= 4 ? 'High' : sourceStatus.liveCount >= 2 ? 'Medium' : 'Low',
    sourceStatus: `${sourceStatus.liveCount}/${sourceStatus.totalTracked} tracked marketing paths live`,
    tone: toneFromScore(blendedScore),
    summary: positiveSignals >= 3
      ? 'Marketing is behaving like a coordinated executive growth system now: website demand, YouTube authority, and cross-platform social performance are visible together, but conversion capture still decides how much of that becomes commercial value.'
      : 'Marketing has promising signals, but the dashboard still needs either more live coverage or stronger conversion capture before confidence should increase materially.',
    components,
    sourceCards: sourceStatus.cards,
    socialHealth
  };
}

function buildMarketingIntelligenceReport({ marketing = {}, intelligence = {}, memory = {}, health = {}, sourceStatus = {}, website = {}, youtube = {} }) {
  const correlations = intelligence.correlations || [];
  const memoryTimeline = memory.timeline || [];
  const socialHealth = health.socialHealth || buildSocialHealthScore(marketing, sourceStatus);
  const attribution = socialHealth.attribution || buildMarketingAttributionSummary(marketing);
  const competitorBenchmark = socialHealth.competitorBenchmark || buildCompetitorBenchmarkSummary(marketing);
  const findings = correlations.filter((item) => [
    'ga4-live-demand-signal',
    'youtube-live-momentum',
    'youtube-website-demand-loop',
    'youtube-publishing-consistency',
    'website-enquiry-conversion-link',
    'content-opportunity-proof-loop',
    'social-momentum-stack',
    'linkedin-authority-gap',
    'x-channel-drag',
    'competitor-pressure-window',
    'attribution-clarity-gap'
  ].includes(item.id));
  const recommendations = (intelligence.recommendations || []).filter((item) => /CMO|Sales|Website|Content|Founder/.test(item.suggestedOwner || '')).slice(0, 6);
  const marketingMilestones = [
    memoryTimeline.find((item) => /website milestone/i.test(item.category) || /live ga4 window/i.test(item.title)),
    memoryTimeline.find((item) => /youtube milestone/i.test(item.category)),
    memoryTimeline.find((item) => /content milestone/i.test(item.category)),
    memoryTimeline.find((item) => /campaign performance/i.test(item.category))
  ].filter((item, index, array) => item && array.findIndex((entry) => entry && entry.id === item.id) === index);

  return {
    title: 'Marketing Intelligence Report',
    subtitle: 'EP Intelligence v1.1 — Social Providers v1.0',
    summary: `Marketing health is ${health.score || '—'}/100 (${health.label || 'Stable'}) with ${health.sourceStatus || sourceStatus.label || 'hybrid source coverage'}. ${socialHealth.topPlatform} leads the social estate at ${socialHealth.score}/100 social health, while the clearest unresolved issue remains turning current attention into more booking intent and cleaner attribution confidence.`,
    sourceStatus,
    health,
    socialHealth,
    ga4Summary: {
      title: website.source?.label || 'Website Analytics source',
      body: website.summary || marketing.websiteAnalytics?.summary || 'Website analytics summary unavailable.'
    },
    youtubeSummary: {
      title: youtube.source?.label || 'YouTube source',
      body: youtube.summary || marketing.platforms?.youtube?.dataSource?.body || 'YouTube summary unavailable.'
    },
    socialSummary: {
      title: 'Unified social performance',
      body: socialHealth.summary
    },
    crossChannelFindings: findings,
    competitorBenchmark,
    attribution,
    opportunities: recommendations.map((item) => ({
      title: item.recommendation,
      body: item.expectedBenefit,
      owner: item.suggestedOwner,
      priority: item.priority,
      tone: item.tone || 'warn'
    })),
    risks: correlations.filter((item) => item.tone === 'warn' || item.tone === 'risk').slice(0, 5).map((item) => ({
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
  operations: OPERATIONS_DATA,
  approvals: flattenApprovalGroups(approvalService.getWorkspace().groups),
  recommendations: INTELLIGENCE.recommendations,
  risks: CEO_DATA.executiveRisks,
  opportunities: CEO_DATA.executiveOpportunities,
  actions: ACTIONS_DATA.actions
});
const MARKETING_SOURCE_STATUS = buildMarketingSourceStatus(CMO_DATA);
const SOCIAL_HEALTH = buildSocialHealthScore(CMO_DATA, MARKETING_SOURCE_STATUS);
const MARKETING_HEALTH = { ...buildMarketingHealthScore(CMO_DATA, INTELLIGENCE, MARKETING_SOURCE_STATUS), socialHealth: SOCIAL_HEALTH };
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
      direction: `${INTELLIGENCE.health.overall.label} with deterministic executive insight coverage, ${ACTIONS_DATA.metrics.active} active actions, and ${ACTIONS_DATA.metrics.approvals} approval-stage items in queue`,
      modules: CEO_DATA.businessHealthScore.modules.map((item) => {
        if (item.module === 'Finance') return { ...item, score: INTELLIGENCE.health.cfo.score, summary: `Generated by HealthEngine: ${INTELLIGENCE.health.cfo.label.toLowerCase()} with margin, cash, working-capital weighting, and finance action backlog visibility.` };
        if (item.module === 'Marketing') return { ...item, score: INTELLIGENCE.health.cmo.score, summary: `Generated by HealthEngine: ${INTELLIGENCE.health.cmo.label.toLowerCase()} with audience, conversion, channel-focus weighting, and approval-first marketing action coverage.` };
        if (item.module === 'Operations') return { ...item, score: Math.round(INTELLIGENCE.health.ceo.components.operationsDelivery || item.score), summary: `Generated by HealthEngine: operations delivery now reflects schedule capacity, action backlog, visible fitting demand, and scheduling risk from the Operations Calendar.` };
        return item;
      })
    },
    executiveActionCentre: ACTIONS_DATA,
    todaysExecutiveQueue: ACTIONS_DATA.queues.todaysActions,
    topPriorities: ACTIONS_DATA.queues.urgent,
    pendingApprovals: ACTIONS_DATA.queues.waitingForMe,
    recentDecisions: MEMORY_DATA.dashboard.recentDecisions,
    todaysRecommendedActions: ACTIONS_DATA.queues.myQueue.slice(0, 4)
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
  operations: OPERATIONS_DATA,
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
      sourceStatus: MARKETING_SOURCE_STATUS,
      socialHealth: SOCIAL_HEALTH,
      attribution: MARKETING_INTELLIGENCE_REPORT.attribution,
      competitorBenchmark: MARKETING_INTELLIGENCE_REPORT.competitorBenchmark
    },
    websiteAnalytics: {
      ...CMO_DATA.websiteAnalytics,
      sourceStatus: MARKETING_SOURCE_STATUS
    },
    campaignPerformance: {
      ...CMO_DATA.campaignPerformance,
      attribution: MARKETING_INTELLIGENCE_REPORT.attribution
    },
    competitorAnalysis: {
      ...CMO_DATA.competitorAnalysis,
      benchmark: MARKETING_INTELLIGENCE_REPORT.competitorBenchmark
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
  actions: ACTIONS_DATA,
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
    memory: MEMORY_DATA,
    copilot: ACTIONS_DATA.copilot
  },
  executiveCopilot: ACTIONS_DATA.copilot,
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
    socialHealthScore: SOCIAL_HEALTH.score,
    marketingSourceStatus: MARKETING_HEALTH.sourceStatus,
    inboxVisibleItems: COMMUNICATIONS_DATA.counts.visible,
    operationsVisibleItems: OPERATIONS_DATA.todaySchedule?.length || 0,
    actionBacklog: ACTIONS_DATA.metrics.active,
    approvalBacklog: ACTIONS_DATA.metrics.approvals
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
  },
  operations: {
    visibleItems: OPERATIONS_DATA.todaySchedule?.length || 0,
    nextAppointment: OPERATIONS_DATA.todaySchedule?.find((item) => !item.isAllDay)?.title || '',
    calendarName: OPERATIONS_DATA.providerSummary?.calendarName || '',
    health: OPERATIONS_DATA.providerSummary?.health || ''
  },
  marketing: {
    liveSocialPlatforms: MARKETING_SOURCE_STATUS.socialLiveCount,
    topSocialPlatform: SOCIAL_HEALTH.topPlatform,
    weakestSocialPlatform: SOCIAL_HEALTH.weakestPlatform,
    attributedRevenue: MARKETING_INTELLIGENCE_REPORT.attribution?.revenueAttributed || ''
  },
  actions: {
    total: ACTIONS_DATA.metrics.total,
    active: ACTIONS_DATA.metrics.active,
    urgent: ACTIONS_DATA.metrics.urgent,
    approvals: ACTIONS_DATA.metrics.approvals
  }
});
