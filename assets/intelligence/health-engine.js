import { average, clamp, healthLabel, parseCurrency, parsePercent, weightedScore } from './engine-utils.js';

function metricLookup(metrics = []) {
  return Object.fromEntries(
    metrics
      .filter((entry) => Array.isArray(entry) && entry.length >= 2)
      .map(([label, value]) => [String(label), value])
  );
}

function scoreFromGrowth(percent) {
  return clamp(70 + percent * 1.4);
}

function scoreFromMargin(percent, trend) {
  return clamp(percent + 25 + Math.min(trend, 8));
}

function scoreFromRunway(months, ratio) {
  return clamp(58 + months * 6 + ratio * 12);
}

export function createHealthEngine(config) {
  const thresholds = config.thresholds.health;
  const weights = config.weights.health;

  return Object.freeze({
    evaluate({ executive, finance, marketing, approvals, operations = {} }) {
      const revenueGrowth = parsePercent(finance.metrics?.find((item) => item.key === 'revenue')?.trend);
      const profitTrend = parsePercent(finance.metrics?.find((item) => item.key === 'profit')?.trend);
      const grossMargin = parsePercent(finance.kpis?.groups?.[1]?.[1]?.[0]?.[1]);
      const runwayMonths = parsePercent(finance.metrics?.find((item) => item.key === 'cash')?.trend || finance.kpis?.groups?.[2]?.[1]?.[1]?.[1]);
      const currentCash = parseCurrency(finance.metrics?.find((item) => item.key === 'cash')?.value);
      const forecastCash = parseCurrency(finance.forecasts?.cash);
      const expenseDrift = parsePercent(finance.kpis?.groups?.[4]?.[1]?.[1]?.[1]);
      const workingCapitalRisk = finance.kpis?.groups?.[3]?.[1]?.[2]?.[1] || 'Medium';
      const approvalCount = Object.values(approvals.groups || {}).reduce((sum, entries) => sum + entries.length, 0);

      const cfoComponents = {
        revenueMomentum: scoreFromGrowth(revenueGrowth),
        marginQuality: scoreFromMargin(grossMargin, profitTrend),
        cashResilience: scoreFromRunway(runwayMonths, forecastCash && currentCash ? forecastCash / currentCash : 0.8),
        workingCapital: clamp(workingCapitalRisk.includes('Medium') ? 74 : 82),
        governance: clamp(88 - approvalCount * 1.2 - Math.max(expenseDrift, 0) * 0.4)
      };
      const cfoScore = weightedScore(Object.entries(cfoComponents), weights.cfo);

      const healthDelta = (marketing.dashboard?.healthScore || 0) - (marketing.dashboard?.previousScore || 0);
      const visitors = parseCurrency(marketing.dashboard?.metrics?.visitors);
      const leads = parseCurrency(marketing.dashboard?.metrics?.leads);
      const enquiries = parseCurrency(marketing.dashboard?.metrics?.enquiries);
      const signups = parseCurrency(marketing.dashboard?.metrics?.signups);
      const platformRankings = marketing.socialOverview?.rankings || [];
      const topPlatform = platformRankings[0]?.score || 86;
      const bottomPlatform = platformRankings[platformRankings.length - 1]?.score || 58;
      const campaignRoi = parsePercent(marketing.campaignPerformance?.roi);
      const websiteMetrics = metricLookup(marketing.websiteAnalytics?.metrics || []);
      const websiteDataSource = marketing.websiteAnalytics?.dataSource || {};
      const websiteSnapshotMeta = marketing.websiteAnalytics?.snapshotMeta || {};
      const youtubeMetrics = metricLookup(marketing.platforms?.youtube?.stats || []);
      const youtubeDataSource = marketing.platforms?.youtube?.dataSource || {};
      const youtubeSnapshotMeta = marketing.platforms?.youtube?.snapshotMeta || {};
      const websiteSessions = parseCurrency(websiteMetrics.Sessions || marketing.dashboard?.metrics?.visitors);
      const websiteSessionGrowth = Number(websiteSnapshotMeta.sessionsDeltaPct ?? healthDelta * 2 ?? 0);
      const websiteConversionRate = parsePercent(websiteMetrics['Conversion Rate']);
      const websiteBookings = parseCurrency(websiteMetrics['Fitting Bookings']);
      const websiteEnquiries = parseCurrency(websiteMetrics['Contact Form Enquiries'] || marketing.dashboard?.metrics?.enquiries);
      const websiteSignups = parseCurrency(websiteMetrics['Email Sign-ups'] || marketing.dashboard?.metrics?.signups);
      const youtubeSubscribers = parseCurrency(youtubeMetrics.Subscribers);
      const youtubeViews28Days = parseCurrency(youtubeMetrics['Views (28 days)'] || youtubeMetrics.Views);
      const youtubeAverageViews = parseCurrency(youtubeMetrics['Average Views / Video']);
      const youtubeUploads = Number(youtubeSnapshotMeta.uploadsLast28Days || 0);
      const youtubeGrowthPct = parsePercent(youtubeMetrics['Audience Growth']);
      const liveSourceCount = Number(websiteDataSource.state === 'live-ga4') + Number(youtubeDataSource.state === 'live-youtube');

      const cmoComponents = {
        audienceMomentum: clamp(
          58
          + Math.min((websiteSessions || visitors) / 180, 18)
          + Math.min(youtubeSubscribers / 5000, 14)
          + liveSourceCount * 4
        ),
        engagementQuality: clamp(
          56
          + Math.min(parseCurrency(marketing.dashboard?.metrics?.engagement) / 2200, 12)
          + Math.min(youtubeViews28Days / 12000, 16)
          + Math.min(youtubeAverageViews / 2500, 10)
          + Math.min(topPlatform / 10, 8)
        ),
        conversionStrength: clamp(
          40
          + Math.min(leads / 5, 10)
          + Math.min((websiteEnquiries || enquiries) / 2.5, 16)
          + Math.min((websiteSignups || signups) / 45, 10)
          + Math.min(websiteBookings * 2, 12)
          + Math.min(websiteConversionRate * 8, 12)
        ),
        channelFocus: clamp(66 + (topPlatform - bottomPlatform) * 0.35 + liveSourceCount * 5),
        executionCadence: clamp(
          52
          + Math.max(websiteSessionGrowth, 0) * 0.9
          + Math.min(youtubeUploads * 2.6, 18)
          + Math.min(Math.max(youtubeGrowthPct, 0) * 4, 10)
          + campaignRoi * 4
          + (marketing.campaignPerformance?.activeCampaigns || 0) * 2
        )
      };
      const cmoScore = weightedScore(Object.entries(cmoComponents), weights.cmo);

      const businessModules = executive.businessHealthScore?.modules || [];
      const customerTrust = businessModules.find((item) => item.module === 'Customer Experience')?.score || 84;
      const operationsCapacity = Number(operations.metrics?.capacityTodayPct || 72);
      const operationsWeekCapacity = Number(operations.metrics?.capacityThisWeekPct || 81);
      const operationsRisks = Number(operations.metrics?.schedulingRisks || 0);
      const openBookingSlots = Number(operations.metrics?.availableBookingSlots || 0);
      const operationsScore = average([
        businessModules.find((item) => item.module === 'Operations')?.score || 80,
        businessModules.find((item) => item.module === 'Projects')?.score || 77,
        clamp(88 - Math.max(operationsCapacity - 70, 0) * 0.7 - operationsRisks * 4 + Math.min(openBookingSlots * 3, 8)),
        clamp(86 - Math.max(operationsWeekCapacity - 80, 0) * 0.5 - operationsRisks * 3)
      ]);
      const governance = clamp(86 - approvalCount * 0.8);

      const ceoComponents = {
        finance: cfoScore,
        marketing: cmoScore,
        customerTrust,
        operationsDelivery: operationsScore,
        governance
      };
      const ceoScore = weightedScore(Object.entries(ceoComponents), weights.ceo);
      const overallScore = weightedScore(
        [
          ['ceo', ceoScore],
          ['cfo', cfoScore],
          ['cmo', cmoScore]
        ],
        weights.overall
      );

      return {
        ceo: {
          score: Math.round(ceoScore),
          label: healthLabel(ceoScore, thresholds),
          components: ceoComponents
        },
        cfo: {
          score: Math.round(cfoScore),
          label: healthLabel(cfoScore, thresholds),
          components: cfoComponents
        },
        cmo: {
          score: Math.round(cmoScore),
          label: healthLabel(cmoScore, thresholds),
          components: cmoComponents
        },
        overall: {
          score: Math.round(overallScore),
          label: healthLabel(overallScore, thresholds)
        }
      };
    }
  });
}
