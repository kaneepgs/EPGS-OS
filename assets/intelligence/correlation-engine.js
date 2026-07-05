import { parseCurrency, parsePercent, parseRangeMidpoint } from './engine-utils.js';

function metricLookup(metrics = []) {
  return Object.fromEntries(
    metrics
      .filter((entry) => Array.isArray(entry) && entry.length >= 2)
      .map(([label, value]) => [String(label), value])
  );
}

export function createCorrelationEngine({ confidenceEngine }) {
  return Object.freeze({
    evaluate({ executive, finance, marketing, approvals }, { health }) {
      const revenueTrend = parsePercent(finance.metrics?.find((item) => item.key === 'revenue')?.trend);
      const profitTrend = parsePercent(finance.metrics?.find((item) => item.key === 'profit')?.trend);
      const currentCash = parseCurrency(finance.metrics?.find((item) => item.key === 'cash')?.value);
      const forecastCash = parseCurrency(finance.forecasts?.cash);
      const visitors = parseCurrency(marketing.dashboard?.metrics?.visitors);
      const leads = parseCurrency(marketing.dashboard?.metrics?.leads);
      const enquiries = parseCurrency(marketing.dashboard?.metrics?.enquiries);
      const healthDelta = (marketing.dashboard?.healthScore || 0) - (marketing.dashboard?.previousScore || 0);
      const expenseDrift = parsePercent(finance.kpis?.groups?.[4]?.[1]?.[1]?.[1]);
      const supplierYoy = parsePercent(finance.suppliers?.[0]?.yoy);
      const approvalCount = Object.values(approvals.groups || {}).reduce((sum, entries) => sum + entries.length, 0);
      const projectScore = executive.departmentHealth?.find((item) => item.department === 'Projects')?.score || 77;
      const websiteMetrics = metricLookup(marketing.websiteAnalytics?.metrics || []);
      const websiteDataSource = marketing.websiteAnalytics?.dataSource || {};
      const websiteSnapshotMeta = marketing.websiteAnalytics?.snapshotMeta || {};
      const websiteUsers = parseCurrency(websiteMetrics.Users || websiteMetrics['Website Visitors']);
      const websiteSessions = parseCurrency(websiteMetrics.Sessions);
      const websiteNewUsers = parseCurrency(websiteMetrics['New Users']);
      const websiteReturningUsers = parseCurrency(websiteMetrics['Returning Visitors']);
      const websiteBounceRate = parsePercent(websiteMetrics['Bounce Rate']);
      const websiteConversionRate = parsePercent(websiteMetrics['Conversion Rate']);
      const websiteBookings = parseCurrency(websiteMetrics['Fitting Bookings']);
      const websiteEnquiries = parseCurrency(websiteMetrics['Contact Form Enquiries']);
      const websiteSignups = parseCurrency(websiteMetrics['Email Sign-ups']);
      const sessionsDeltaPct = Number(websiteSnapshotMeta.sessionsDeltaPct ?? 0);
      const isLiveGa4 = websiteDataSource.state === 'live-ga4';

      const correlations = [];

      if (isLiveGa4 && websiteSessions > 0) {
        const confidence = confidenceEngine.score({ evidenceCount: 5, metricCoverage: 0.96, crossFunctional: 1, consistency: 0.91 });
        correlations.push({
          id: 'ga4-live-demand-signal',
          title: 'Live GA4 confirms website demand is rising',
          executiveSummary: `GA4 is now live and sessions are ${sessionsDeltaPct >= 0 ? 'up' : 'down'} ${Math.abs(sessionsDeltaPct).toFixed(1)}% versus the prior period, with ${websiteMetrics.Users || websiteMetrics['Website Visitors'] || '—'} users and ${websiteMetrics['New Users'] || '—'} new users. Leadership now has real website momentum data rather than placeholder marketing traffic.`,
          supportingEvidence: [
            `Data source: ${websiteDataSource.label || 'Website Analytics'}.`,
            `Sessions total ${websiteMetrics.Sessions || '—'}.`,
            `Users total ${websiteMetrics.Users || websiteMetrics['Website Visitors'] || '—'}.`,
            `New users total ${websiteMetrics['New Users'] || '—'}.`,
            `Bounce rate is ${websiteMetrics['Bounce Rate'] || '—'}.`
          ],
          businessImpact: 'CEO → Marketing → Website demand visibility',
          financialImpact: 'Live website demand data improves confidence in where attention is compounding and where leadership should expect conversion pressure next.',
          responsibleDepartment: 'CEO / CMO',
          prioritySignal: { financialImpact: 84, customerImpact: 73, strategicImportance: 88, timeSensitivity: 79, confidence: confidence.score },
          confidence,
          tone: sessionsDeltaPct >= 0 ? 'good' : 'warn'
        });
      }

      if (isLiveGa4 && websiteSessions > 0 && websiteConversionRate <= 0.1) {
        const confidence = confidenceEngine.score({ evidenceCount: 5, metricCoverage: 0.93, crossFunctional: 1, consistency: 0.87 });
        correlations.push({
          id: 'ga4-conversion-visibility-gap',
          title: 'Live traffic is visible, but conversion capture remains weak',
          executiveSummary: 'GA4 now confirms live website demand, but the synced booking, enquiry, and signup events are currently flat, so leadership has stronger traffic visibility than conversion visibility right now.',
          supportingEvidence: [
            `Sessions total ${websiteMetrics.Sessions || '—'} with ${websiteMetrics['New Users'] || '—'} new users.`,
            `Bounce rate is ${websiteMetrics['Bounce Rate'] || '—'}.`,
            `Bookings ${websiteMetrics['Fitting Bookings'] || '0'}, enquiries ${websiteMetrics['Contact Form Enquiries'] || '0'}, sign-ups ${websiteMetrics['Email Sign-ups'] || '0'}.`,
            `Conversion rate is ${websiteMetrics['Conversion Rate'] || '0.0%'}.`
          ],
          businessImpact: 'Website → Conversion visibility → Revenue quality',
          financialImpact: 'Traffic gains may continue to outpace decision-grade commercial attribution until conversion capture becomes stronger or cleaner.',
          responsibleDepartment: 'CEO / CMO / Website',
          prioritySignal: { financialImpact: 82, customerImpact: 77, strategicImportance: 86, timeSensitivity: 81, confidence: confidence.score },
          confidence,
          tone: 'warn'
        });
      }

      if (healthDelta > 0 && revenueTrend > 0) {
        const confidence = confidenceEngine.score({ evidenceCount: 4, metricCoverage: 0.9, crossFunctional: 1, consistency: 0.92 });
        correlations.push({
          id: 'marketing-revenue-growth',
          title: 'Marketing momentum is translating into top-line demand',
          executiveSummary: 'Marketing health improved while revenue also moved higher, which suggests awareness and trust-building activity are feeding commercial demand rather than just vanity reach.',
          supportingEvidence: [`Marketing health moved from ${marketing.dashboard?.previousScore} to ${marketing.dashboard?.healthScore}.`, `Revenue trend is ${finance.metrics?.find((item) => item.key === 'revenue')?.trend}.`, `Website visitors are ${marketing.dashboard?.metrics?.visitors}.`, `Booking enquiries total ${marketing.dashboard?.metrics?.enquiries}.`],
          businessImpact: 'Marketing → Website → Revenue',
          financialImpact: `Supports current revenue momentum and protects approximately ${finance.metrics?.find((item) => item.key === 'revenue')?.value} of monthly demand quality.`,
          responsibleDepartment: 'CEO / CMO',
          prioritySignal: { financialImpact: 82, customerImpact: 74, strategicImportance: 80, timeSensitivity: 66, confidence: confidence.score },
          confidence,
          tone: 'good'
        });
      }

      if (healthDelta > 0 && profitTrend < 0) {
        const confidence = confidenceEngine.score({ evidenceCount: 4, metricCoverage: 0.88, crossFunctional: 1, consistency: 0.84 });
        correlations.push({
          id: 'marketing-profit-gap',
          title: 'Growth is outpacing margin conversion',
          executiveSummary: 'Marketing and revenue both improved, but profit softened, which means the business is acquiring demand faster than it is preserving margin quality.',
          supportingEvidence: [`Revenue is ${finance.metrics?.find((item) => item.key === 'revenue')?.trend}.`, `Profit is ${finance.metrics?.find((item) => item.key === 'profit')?.trend}.`, `Supplier cost pressure is visible in the finance workspace.`, `Marketing health remains positive at ${marketing.dashboard?.healthScore}.`],
          businessImpact: 'Marketing → Revenue → Profitability',
          financialImpact: 'Without tighter cost and conversion discipline, top-line gains may continue to leak before they become healthy profit.',
          responsibleDepartment: 'CEO / CFO / CMO',
          prioritySignal: { financialImpact: 90, customerImpact: 68, strategicImportance: 88, timeSensitivity: 78, confidence: confidence.score },
          confidence,
          tone: 'warn'
        });
      }

      if ((isLiveGa4 ? websiteUsers > 5000 : visitors > 20000) && enquiries < leads * 0.45) {
        const confidence = confidenceEngine.score({ evidenceCount: 4, metricCoverage: 0.86, crossFunctional: 1, consistency: 0.8 });
        correlations.push({
          id: 'website-conversion-gap',
          title: 'Traffic is improving faster than booking conversion',
          executiveSummary: 'Website attention is strong, but conversion into booking enquiries is not rising at the same speed, which points to a commercial friction point rather than an awareness problem.',
          supportingEvidence: [
            `Website visitors total ${isLiveGa4 ? (websiteMetrics.Users || websiteMetrics['Website Visitors'] || '—') : marketing.dashboard?.metrics?.visitors}.`,
            `Leads total ${marketing.dashboard?.metrics?.leads}.`,
            `Booking enquiries total ${isLiveGa4 ? (websiteMetrics['Contact Form Enquiries'] || '0') : marketing.dashboard?.metrics?.enquiries}.`,
            `Best-performing channel remains ${marketing.dashboard?.bestPlatform}.`
          ],
          businessImpact: 'Marketing → Website → Sales / Customer Journey',
          financialImpact: 'Improving the website path could convert more of the current traffic into higher-value enquiries without requiring more media effort.',
          responsibleDepartment: 'CMO / Sales',
          prioritySignal: { financialImpact: 76, customerImpact: 82, strategicImportance: 78, timeSensitivity: 72, confidence: confidence.score },
          confidence,
          tone: 'warn'
        });
      }

      if (profitTrend < 0 && expenseDrift > 0) {
        const confidence = confidenceEngine.score({ evidenceCount: 3, metricCoverage: 0.82, crossFunctional: 0.6, consistency: 0.86 });
        correlations.push({
          id: 'profit-expense-pressure',
          title: 'Profit softness is being driven by expense drift',
          executiveSummary: 'Profit declined while operating expense drift increased, which means margin pressure is coming from cost discipline rather than from revenue weakness.',
          supportingEvidence: [`Profit is ${finance.metrics?.find((item) => item.key === 'profit')?.trend}.`, `Expense drift is ${finance.kpis?.groups?.[4]?.[1]?.[1]?.[1]}.`, `Gross margin is ${finance.kpis?.groups?.[1]?.[1]?.[0]?.[1]}.`],
          businessImpact: 'Finance → Operations',
          financialImpact: 'Addressing expense drift is one of the clearest routes to recovering margin quality without slowing healthy demand.',
          responsibleDepartment: 'CFO / COO',
          prioritySignal: { financialImpact: 92, customerImpact: 45, strategicImportance: 80, timeSensitivity: 74, confidence: confidence.score },
          confidence,
          tone: 'risk'
        });
      }

      if (forecastCash < currentCash && supplierYoy > 15) {
        const confidence = confidenceEngine.score({ evidenceCount: 4, metricCoverage: 0.84, crossFunctional: 0.75, consistency: 0.88 });
        correlations.push({
          id: 'cash-supplier-pressure',
          title: 'Future cash flexibility is sensitive to supplier inflation',
          executiveSummary: 'Forecast cash closes below the current balance while supplier spend is still increasing, which means timing flexibility could tighten even though the business feels healthy today.',
          supportingEvidence: [`Current cash is ${finance.metrics?.find((item) => item.key === 'cash')?.value}.`, `Forecast cash is ${finance.forecasts?.cash}.`, `Largest supplier year-on-year spend is ${finance.suppliers?.[0]?.yoy}.`, `Cash timing risk is already estimated at ${finance.risks?.[0]?.impact}.`],
          businessImpact: 'Finance → Suppliers → Cash',
          financialImpact: `Supplier timing pressure could absorb roughly ${finance.risks?.[0]?.impact || formatCurrency(parseRangeMidpoint('£6k–£8k'))}.`,
          responsibleDepartment: 'CFO',
          prioritySignal: { financialImpact: 94, customerImpact: 38, strategicImportance: 86, timeSensitivity: 84, confidence: confidence.score },
          confidence,
          tone: 'risk'
        });
      }

      if (approvalCount >= 10 && projectScore < 80) {
        const confidence = confidenceEngine.score({ evidenceCount: 3, metricCoverage: 0.7, crossFunctional: 1, consistency: 0.74 });
        correlations.push({
          id: 'approval-project-bottleneck',
          title: 'Approval load is increasing the risk of execution drag',
          executiveSummary: 'The approval queue is large while project health remains only moderate, which means decision latency may be starting to slow execution quality.',
          supportingEvidence: [`Open approvals total ${approvalCount}.`, `Projects health score is ${projectScore}.`, `Several executive priorities already depend on explicit approval sequencing.`],
          businessImpact: 'Approvals → Projects → Operations',
          financialImpact: `Delays do not yet threaten the business, but they can postpone value capture and slow the return from current growth activity.`,
          responsibleDepartment: 'CEO / COO',
          prioritySignal: { financialImpact: 61, customerImpact: 64, strategicImportance: 77, timeSensitivity: 73, confidence: confidence.score },
          confidence,
          tone: 'warn'
        });
      }

      return correlations.map((item, index) => ({ ...item, order: index + 1, healthContext: health.overall.score }));
    }
  });
}
