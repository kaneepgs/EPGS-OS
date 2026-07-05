import { normalizeExecutiveInsight } from '../contracts/data-contracts.js';
import { nowTimestamp } from './engine-utils.js';

function insightFromCorrelation(entry, suggestedActions = []) {
  return normalizeExecutiveInsight({
    title: entry.title,
    executiveSummary: entry.executiveSummary,
    supportingEvidence: entry.supportingEvidence,
    confidenceScore: entry.confidence.score,
    confidence: entry.confidence.label,
    businessImpact: entry.businessImpact,
    financialImpact: entry.financialImpact,
    suggestedActions,
    responsibleDepartment: entry.responsibleDepartment,
    priority: entry.priority,
    timestamp: nowTimestamp()
  });
}

export function createInsightEngine() {
  return Object.freeze({
    evaluate({ executive, finance, marketing }, { correlations, recommendations, health }) {
      const recommendationLookup = Object.fromEntries(recommendations.map((item) => [item.id, item]));
      const executiveInsights = correlations.slice(0, 5).map((entry) =>
        insightFromCorrelation(entry, [
          recommendationLookup['collections-discipline']?.recommendation,
          recommendationLookup['website-conversion-sprint']?.recommendation,
          recommendationLookup['supplier-term-review']?.recommendation
        ].filter(Boolean))
      );

      const cfoInsights = [
        insightFromCorrelation(correlations.find((item) => item.id === 'cash-supplier-pressure') || correlations.find((item) => item.id === 'gmail-finance-approval-outstanding') || correlations[0], [recommendationLookup['collections-discipline']?.recommendation, recommendationLookup['supplier-term-review']?.recommendation, recommendationLookup['gmail-finance-triage']?.recommendation].filter(Boolean)),
        insightFromCorrelation(correlations.find((item) => item.id === 'profit-expense-pressure') || correlations.find((item) => item.id === 'gmail-supplier-issue-delay') || correlations[1] || correlations[0], [recommendationLookup['supplier-term-review']?.recommendation, recommendationLookup['gmail-supplier-response-plan']?.recommendation].filter(Boolean)),
        normalizeExecutiveInsight({
          title: 'Finance health remains solid but selective',
          executiveSummary: `CFO health scores ${health.cfo.score}/100 because revenue resilience and cash runway remain supportive, even though collections speed and cost discipline still need active management.`,
          supportingEvidence: [finance.metrics?.find((item) => item.key === 'revenue')?.value, finance.metrics?.find((item) => item.key === 'cash')?.trend, finance.kpis?.groups?.[1]?.[1]?.[0]?.[1]].filter(Boolean),
          confidenceScore: 84,
          confidence: 'High',
          businessImpact: 'Finance → Governance',
          financialImpact: 'Improves decision confidence around spend control, approvals, and short-term flexibility.',
          suggestedActions: [recommendationLookup['collections-discipline']?.recommendation, recommendationLookup['supplier-term-review']?.recommendation].filter(Boolean),
          responsibleDepartment: 'CFO',
          priority: 'High',
          timestamp: nowTimestamp()
        })
      ].filter(Boolean);

      const cmoInsights = [
        insightFromCorrelation(correlations.find((item) => item.id === 'youtube-live-momentum') || correlations.find((item) => item.id === 'marketing-revenue-growth') || correlations[0], [recommendationLookup['video-proof-expansion']?.recommendation, recommendationLookup['youtube-cadence-protect']?.recommendation].filter(Boolean)),
        insightFromCorrelation(correlations.find((item) => item.id === 'youtube-website-demand-loop') || correlations.find((item) => item.id === 'content-opportunity-proof-loop') || correlations[0], [recommendationLookup['video-proof-expansion']?.recommendation, recommendationLookup['website-conversion-sprint']?.recommendation].filter(Boolean)),
        insightFromCorrelation(correlations.find((item) => item.id === 'website-enquiry-conversion-link') || correlations.find((item) => item.id === 'website-conversion-gap') || correlations[0], [recommendationLookup['website-conversion-sprint']?.recommendation].filter(Boolean)),
        normalizeExecutiveInsight({
          title: 'Marketing health is improving with clearer channel winners',
          executiveSummary: `CMO health scores ${health.cmo.score}/100 because live GA4 and live YouTube now make marketing momentum clearer, but value capture will improve fastest if the strongest proof-led content is reused more deliberately inside website conversion paths.`,
          supportingEvidence: [marketing.dashboard?.bestPlatform, marketing.dashboard?.worstPlatform, marketing.dashboard?.metrics?.visitors, marketing.dashboard?.metrics?.enquiries, marketing.websiteAnalytics?.dataSource?.label, marketing.platforms?.youtube?.dataSource?.label].filter(Boolean),
          confidenceScore: 82,
          confidence: 'High',
          businessImpact: 'Marketing → Revenue Quality',
          financialImpact: 'Better channel focus should increase lead quality without requiring broad-based content expansion.',
          suggestedActions: [recommendationLookup['video-proof-expansion']?.recommendation, recommendationLookup['website-conversion-sprint']?.recommendation].filter(Boolean),
          responsibleDepartment: 'CMO',
          priority: 'High',
          timestamp: nowTimestamp()
        })
      ].filter(Boolean);

      const reportInsights = executiveInsights.slice(0, 4);

      const topInsight = executiveInsights[0] || normalizeExecutiveInsight({
        title: 'Executive insight unavailable',
        executiveSummary: 'The intelligence engine did not produce a top insight.',
        supportingEvidence: [],
        confidenceScore: 40,
        confidence: 'Low',
        businessImpact: 'Executive intelligence',
        financialImpact: 'None',
        suggestedActions: [],
        responsibleDepartment: 'CEO',
        priority: 'Low',
        timestamp: nowTimestamp()
      });

      return {
        topInsight,
        executive: executiveInsights,
        cfo: cfoInsights,
        cmo: cmoInsights,
        reports: reportInsights
      };
    }
  });
}
