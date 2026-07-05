import { average, clamp, healthLabel, parseCurrency, parsePercent, weightedScore } from './engine-utils.js';

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
    evaluate({ executive, finance, marketing, approvals }) {
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

      const cmoComponents = {
        audienceMomentum: clamp(72 + healthDelta * 4 + Math.min(visitors / 1500, 12)),
        engagementQuality: clamp(64 + Math.min(parseCurrency(marketing.dashboard?.metrics?.engagement) / 2000, 18) + Math.min(topPlatform / 8, 10)),
        conversionStrength: clamp(62 + Math.min(leads / 4, 18) + Math.min(enquiries / 2.5, 12) + Math.min(signups / 30, 8)),
        channelFocus: clamp(70 + (topPlatform - bottomPlatform) * 0.35),
        executionCadence: clamp(60 + campaignRoi * 6 + (marketing.campaignPerformance?.activeCampaigns || 0) * 4)
      };
      const cmoScore = weightedScore(Object.entries(cmoComponents), weights.cmo);

      const businessModules = executive.businessHealthScore?.modules || [];
      const customerTrust = businessModules.find((item) => item.module === 'Customer Experience')?.score || 84;
      const operations = average([
        businessModules.find((item) => item.module === 'Operations')?.score || 80,
        businessModules.find((item) => item.module === 'Projects')?.score || 77
      ]);
      const governance = clamp(86 - approvalCount * 0.8);

      const ceoComponents = {
        finance: cfoScore,
        marketing: cmoScore,
        customerTrust,
        operationsDelivery: operations,
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
