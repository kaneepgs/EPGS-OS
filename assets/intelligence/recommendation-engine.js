import { formatCurrency, parseRangeMidpoint } from './engine-utils.js';

export function createRecommendationEngine({ priorityEngine }) {
  return Object.freeze({
    evaluate({ finance, marketing, communications, operations, approvals }, { correlations }) {
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
          id: 'social-proof-sequencing',
          recommendation: 'Sequence Instagram, Facebook, LinkedIn, and X around the strongest proof-led theme instead of posting channel by channel',
          why: lookup['social-momentum-stack']?.executiveSummary || 'Cross-platform reach is strongest when one high-conviction proof story is adapted across the whole social estate.',
          expectedBenefit: 'Improves social efficiency, keeps the strongest message consistent, and increases the chance that authority turns into bookings rather than isolated engagement.',
          risk: 'Low',
          confidence: lookup['social-momentum-stack']?.confidence?.label || 'Medium',
          confidenceScore: lookup['social-momentum-stack']?.confidence?.score || 78,
          estimatedValue: marketing.campaignPerformance?.revenueAttribution || 'Higher cross-platform return from existing content effort',
          suggestedOwner: 'CMO / Content Lead',
          priorityFactors: { financialImpact: 79, customerImpact: 74, strategicImportance: 86, timeSensitivity: 77, confidence: lookup['social-momentum-stack']?.confidence?.score || 78 }
        },
        {
          id: 'linkedin-authority-asset',
          recommendation: 'Publish the next LinkedIn authority asset as a deliberate trust-building move, not a leftover channel post',
          why: lookup['linkedin-authority-gap']?.executiveSummary || 'LinkedIn has strategic authority value, but only when it is treated as a premium positioning surface rather than filler output.',
          expectedBenefit: 'Strengthens professional trust, improves premium brand positioning, and gives the executive team a more credible authority layer beyond pure reach channels.',
          risk: 'Low–Medium',
          confidence: lookup['linkedin-authority-gap']?.confidence?.label || 'Medium',
          confidenceScore: lookup['linkedin-authority-gap']?.confidence?.score || 74,
          estimatedValue: 'Higher downstream lead quality and stronger executive authority positioning',
          suggestedOwner: 'CMO / Founder Brand',
          priorityFactors: { financialImpact: 68, customerImpact: 73, strategicImportance: 82, timeSensitivity: 66, confidence: lookup['linkedin-authority-gap']?.confidence?.score || 74 }
        },
        {
          id: 'x-effort-reallocation',
          recommendation: 'Reduce X effort and deliberately reallocate the saved time into higher-return channels',
          why: lookup['x-channel-drag']?.executiveSummary || 'The weakest social channel should earn its place instead of quietly consuming attention.',
          expectedBenefit: 'Improves return on team effort and sharpens channel discipline without increasing overall workload.',
          risk: 'Low',
          confidence: lookup['x-channel-drag']?.confidence?.label || 'High',
          confidenceScore: lookup['x-channel-drag']?.confidence?.score || 82,
          estimatedValue: 'Recovered content time for stronger YouTube, Instagram, and website conversion work',
          suggestedOwner: 'CMO / Content Ops',
          priorityFactors: { financialImpact: 72, customerImpact: 58, strategicImportance: 79, timeSensitivity: 81, confidence: lookup['x-channel-drag']?.confidence?.score || 82 }
        },
        {
          id: 'competitor-benchmark-attack',
          recommendation: 'Use competitor benchmarking to attack with premium proof and trust instead of chasing publishing volume blindly',
          why: lookup['competitor-pressure-window']?.executiveSummary || 'Competitor pressure should sharpen positioning, not provoke scattered output.',
          expectedBenefit: 'Preserves brand clarity while improving the odds that social and content effort actually reinforces EP’s premium position.',
          risk: 'Low–Medium',
          confidence: lookup['competitor-pressure-window']?.confidence?.label || 'Medium',
          confidenceScore: lookup['competitor-pressure-window']?.confidence?.score || 75,
          estimatedValue: 'Stronger competitive positioning across the next campaign cycle',
          suggestedOwner: 'CMO / CEO',
          priorityFactors: { financialImpact: 74, customerImpact: 76, strategicImportance: 84, timeSensitivity: 70, confidence: lookup['competitor-pressure-window']?.confidence?.score || 75 }
        },
        {
          id: 'marketing-attribution-discipline',
          recommendation: 'Keep the marketing attribution view deliberately simple and decision-grade',
          why: lookup['attribution-clarity-gap']?.executiveSummary || 'Attribution is useful when it clarifies choices, not when it creates false precision.',
          expectedBenefit: 'Improves weekly decision quality around which channels, campaigns, and content themes deserve more effort next.',
          risk: 'Low',
          confidence: lookup['attribution-clarity-gap']?.confidence?.label || 'Medium',
          confidenceScore: lookup['attribution-clarity-gap']?.confidence?.score || 73,
          estimatedValue: marketing.campaignPerformance?.revenueAttribution || '£18.6k currently tracked attributed demand',
          suggestedOwner: 'CMO / Website',
          priorityFactors: { financialImpact: 77, customerImpact: 66, strategicImportance: 83, timeSensitivity: 71, confidence: lookup['attribution-clarity-gap']?.confidence?.score || 73 }
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
        },
        {
          id: 'gmail-customer-reply-sprint',
          recommendation: 'Clear the oldest customer and booking replies from the Executive Inbox today',
          why: lookup['gmail-customer-reply-backlog']?.executiveSummary || lookup['gmail-booking-request-flow']?.executiveSummary || 'The inbox is now holding direct commercial demand.',
          expectedBenefit: 'Improves trust, shortens response time, and converts existing visible demand faster.',
          risk: 'Low',
          confidence: lookup['gmail-customer-reply-backlog']?.confidence?.label || 'High',
          confidenceScore: lookup['gmail-customer-reply-backlog']?.confidence?.score || 82,
          estimatedValue: `${communications?.metrics?.waitingCustomerReplies || 0} customer replies and ${communications?.metrics?.bookingRequests || 0} booking requests moved forward`,
          suggestedOwner: 'CEO / Sales / Customer Success',
          priorityFactors: { financialImpact: 83, customerImpact: 92, strategicImportance: 80, timeSensitivity: 91, confidence: lookup['gmail-customer-reply-backlog']?.confidence?.score || 82 }
        },
        {
          id: 'gmail-supplier-response-plan',
          recommendation: 'Stage supplier email follow-through into a named approval and response plan',
          why: lookup['gmail-supplier-issue-delay']?.executiveSummary || 'Supplier conversations are now visible enough to deserve explicit ownership.',
          expectedBenefit: 'Protects margin, supplier continuity, and operating confidence before email drift becomes a hidden cost.',
          risk: 'Medium',
          confidence: lookup['gmail-supplier-issue-delay']?.confidence?.label || 'Medium',
          confidenceScore: lookup['gmail-supplier-issue-delay']?.confidence?.score || 78,
          estimatedValue: `${communications?.metrics?.supplierIssues || 0} supplier issues clarified`,
          suggestedOwner: 'CFO / COO',
          priorityFactors: { financialImpact: 85, customerImpact: 45, strategicImportance: 79, timeSensitivity: 80, confidence: lookup['gmail-supplier-issue-delay']?.confidence?.score || 78 }
        },
        {
          id: 'gmail-finance-triage',
          recommendation: 'Batch the finance-sensitive inbox threads into the next approval review block',
          why: lookup['gmail-finance-approval-outstanding']?.executiveSummary || 'Finance-sensitive email is shaping approval timing.',
          expectedBenefit: 'Improves finance visibility and keeps invoice or reconciliation threads from becoming hidden blockers.',
          risk: 'Low–Medium',
          confidence: lookup['gmail-finance-approval-outstanding']?.confidence?.label || 'Medium',
          confidenceScore: lookup['gmail-finance-approval-outstanding']?.confidence?.score || 76,
          estimatedValue: `${communications?.metrics?.financeEmails || 0} finance emails triaged`,
          suggestedOwner: 'CFO',
          priorityFactors: { financialImpact: 79, customerImpact: 38, strategicImportance: 76, timeSensitivity: 82, confidence: lookup['gmail-finance-approval-outstanding']?.confidence?.score || 76 }
        },
        {
          id: 'calendar-capacity-protect',
          recommendation: 'Protect the next high-pressure schedule block before adding more demand',
          why: lookup['calendar-capacity-pressure']?.executiveSummary || 'Operating capacity is moving into a pressure zone.',
          expectedBenefit: 'Preserves service quality, reduces overtime risk, and keeps premium bookings from eroding the experience they are meant to create.',
          risk: 'Low–Medium',
          confidence: lookup['calendar-capacity-pressure']?.confidence?.label || 'Medium',
          confidenceScore: lookup['calendar-capacity-pressure']?.confidence?.score || 78,
          estimatedValue: `${operations?.metrics?.capacityTodayPct || 0}% day capacity protected`,
          suggestedOwner: 'CEO / COO / Operations',
          priorityFactors: { financialImpact: 76, customerImpact: 88, strategicImportance: 84, timeSensitivity: 90, confidence: lookup['calendar-capacity-pressure']?.confidence?.score || 78 }
        },
        {
          id: 'calendar-booking-slot-convert',
          recommendation: 'Convert the best visible free fitting slot into booking revenue this week',
          why: lookup['calendar-free-fitting-opportunity']?.executiveSummary || 'The schedule still contains selective room for high-value fitting demand.',
          expectedBenefit: 'Improves short-term revenue capture without adding acquisition cost or overloading the operating day.',
          risk: 'Low',
          confidence: lookup['calendar-free-fitting-opportunity']?.confidence?.label || 'Medium',
          confidenceScore: lookup['calendar-free-fitting-opportunity']?.confidence?.score || 77,
          estimatedValue: `${operations?.metrics?.availableBookingSlots || 0} visible slot${operations?.metrics?.availableBookingSlots === 1 ? '' : 's'} ready for monetisation`,
          suggestedOwner: 'Sales / Operations',
          priorityFactors: { financialImpact: 81, customerImpact: 73, strategicImportance: 75, timeSensitivity: 79, confidence: lookup['calendar-free-fitting-opportunity']?.confidence?.score || 77 }
        },
        {
          id: 'calendar-compression-fix',
          recommendation: 'Reshape the most compressed part of today’s schedule before it causes delivery drag',
          why: lookup['calendar-schedule-compression']?.executiveSummary || 'Schedule compression is now visible enough to justify intervention.',
          expectedBenefit: 'Reduces rushed handoffs, protects staff energy, and lowers the chance of avoidable customer friction later in the day.',
          risk: 'Low',
          confidence: lookup['calendar-schedule-compression']?.confidence?.label || 'Medium',
          confidenceScore: lookup['calendar-schedule-compression']?.confidence?.score || 76,
          estimatedValue: `${operations?.metrics?.schedulingRisks || 0} scheduling risk${operations?.metrics?.schedulingRisks === 1 ? '' : 's'} clarified`,
          suggestedOwner: 'COO / Operations',
          priorityFactors: { financialImpact: 70, customerImpact: 84, strategicImportance: 78, timeSensitivity: 88, confidence: lookup['calendar-schedule-compression']?.confidence?.score || 76 }
        }
      ];

      return priorityEngine.rank(base);
    }
  });
}
