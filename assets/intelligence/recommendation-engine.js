import { formatCurrency, parseRangeMidpoint } from './engine-utils.js';

export function createRecommendationEngine({ priorityEngine }) {
  return Object.freeze({
    evaluate({ finance, marketing, approvals }, { correlations }) {
      const lookup = Object.fromEntries(correlations.map((item) => [item.id, item]));
      const base = [
        {
          id: 'collections-discipline',
          recommendation: 'Escalate overdue receivables follow-up this week',
          why: lookup['cash-supplier-pressure']?.executiveSummary || 'Cash flexibility is still most sensitive to timing rather than topline demand.',
          expectedBenefit: 'Pulls forward cash, improves approval confidence, and protects optionality for the next 30 days.',
          risk: 'Medium',
          confidence: lookup['cash-supplier-pressure']?.confidence?.label || 'High',
          confidenceScore: lookup['cash-supplier-pressure']?.confidence?.score || 82,
          estimatedValue: finance.risks?.[0]?.impact || '£6k–£8k cash timing improvement',
          suggestedOwner: 'CFO',
          priorityFactors: { financialImpact: 94, customerImpact: 30, strategicImportance: 87, timeSensitivity: 86, confidence: lookup['cash-supplier-pressure']?.confidence?.score || 82 }
        },
        {
          id: 'website-conversion-sprint',
          recommendation: 'Tighten the website path from content traffic into fitting enquiries',
          why: lookup['website-enquiry-conversion-link']?.executiveSummary || lookup['website-conversion-gap']?.executiveSummary || 'Traffic quality is outrunning booking conversion.',
          expectedBenefit: 'Converts more existing demand into commercially meaningful enquiries without needing more reach.',
          risk: 'Low–Medium',
          confidence: lookup['website-conversion-gap']?.confidence?.label || 'Medium',
          confidenceScore: lookup['website-conversion-gap']?.confidence?.score || 76,
          estimatedValue: 'Higher enquiry conversion from current traffic base',
          suggestedOwner: 'CMO / Sales',
          priorityFactors: { financialImpact: 78, customerImpact: 84, strategicImportance: 82, timeSensitivity: 74, confidence: lookup['website-conversion-gap']?.confidence?.score || 76 }
        },
        {
          id: 'video-proof-expansion',
          recommendation: 'Extend the strongest proof-led YouTube content into website and email journeys',
          why: lookup['content-opportunity-proof-loop']?.executiveSummary || lookup['youtube-website-demand-loop']?.executiveSummary || lookup['youtube-live-momentum']?.executiveSummary || lookup['marketing-revenue-growth']?.executiveSummary || 'The strongest-performing marketing assets are already shaping demand quality.',
          expectedBenefit: 'Builds authority, supports lead quality, and compounds current revenue momentum across owned channels.',
          risk: 'Low',
          confidence: lookup['youtube-live-momentum']?.confidence?.label || lookup['marketing-revenue-growth']?.confidence?.label || 'High',
          confidenceScore: lookup['youtube-live-momentum']?.confidence?.score || lookup['marketing-revenue-growth']?.confidence?.score || 84,
          estimatedValue: marketing.campaignPerformance?.revenueAttribution || '£18.6k attributed demand support',
          suggestedOwner: 'CMO',
          priorityFactors: { financialImpact: 80, customerImpact: 76, strategicImportance: 81, timeSensitivity: 69, confidence: lookup['youtube-live-momentum']?.confidence?.score || lookup['marketing-revenue-growth']?.confidence?.score || 84 }
        },
        {
          id: 'youtube-cadence-protect',
          recommendation: 'Protect a consistent YouTube publishing cadence while live momentum is visible',
          why: lookup['youtube-publishing-consistency']?.executiveSummary || 'The strongest authority channel should not rely on sporadic output.',
          expectedBenefit: 'Preserves compounding authority, supports steady traffic generation, and reduces the risk of momentum drifting between major uploads.',
          risk: 'Low–Medium',
          confidence: lookup['youtube-publishing-consistency']?.confidence?.label || lookup['youtube-live-momentum']?.confidence?.label || 'Medium',
          confidenceScore: lookup['youtube-publishing-consistency']?.confidence?.score || lookup['youtube-live-momentum']?.confidence?.score || 78,
          estimatedValue: 'More consistent authority and demand support from the strongest content channel',
          suggestedOwner: 'CMO',
          priorityFactors: { financialImpact: 74, customerImpact: 72, strategicImportance: 85, timeSensitivity: 80, confidence: lookup['youtube-publishing-consistency']?.confidence?.score || lookup['youtube-live-momentum']?.confidence?.score || 78 }
        },
        {
          id: 'supplier-term-review',
          recommendation: 'Review the highest-cost supplier line before the next purchasing cycle',
          why: lookup['profit-expense-pressure']?.executiveSummary || 'Supplier and support costs are shaping margin quality more than demand is.',
          expectedBenefit: 'Protects profit conversion and reduces pressure on forecast cash.',
          risk: 'Medium',
          confidence: lookup['profit-expense-pressure']?.confidence?.label || 'Medium',
          confidenceScore: lookup['profit-expense-pressure']?.confidence?.score || 78,
          estimatedValue: finance.opportunities?.[1]?.profitIncrease || formatCurrency(parseRangeMidpoint('£1k–£2k')),
          suggestedOwner: 'CFO / COO',
          priorityFactors: { financialImpact: 91, customerImpact: 34, strategicImportance: 84, timeSensitivity: 77, confidence: lookup['profit-expense-pressure']?.confidence?.score || 78 }
        },
        {
          id: 'approval-load-triage',
          recommendation: 'Triage the executive approval queue into immediate, this-week, and defer buckets',
          why: lookup['approval-project-bottleneck']?.executiveSummary || 'Decision congestion is starting to become an execution risk.',
          expectedBenefit: 'Reduces decision latency, improves delivery clarity, and protects momentum across multiple departments.',
          risk: 'Low',
          confidence: lookup['approval-project-bottleneck']?.confidence?.label || 'Medium',
          confidenceScore: lookup['approval-project-bottleneck']?.confidence?.score || 70,
          estimatedValue: `${Object.values(approvals.groups || {}).reduce((sum, entries) => sum + entries.length, 0)} approvals clarified`,
          suggestedOwner: 'CEO / COO',
          priorityFactors: { financialImpact: 62, customerImpact: 58, strategicImportance: 79, timeSensitivity: 72, confidence: lookup['approval-project-bottleneck']?.confidence?.score || 70 }
        }
      ];

      return priorityEngine.rank(base);
    }
  });
}
