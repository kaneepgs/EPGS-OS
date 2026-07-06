import { average, parseCurrency, parsePercent, parseRangeMidpoint } from './engine-utils.js';

function metricLookup(metrics = []) {
  return Object.fromEntries(
    metrics
      .filter((entry) => Array.isArray(entry) && entry.length >= 2)
      .map(([label, value]) => [String(label), value])
  );
}

export function createCorrelationEngine({ confidenceEngine }) {
  return Object.freeze({
    evaluate({ executive, finance, marketing, communications, approvals, operations = {} }, { health }) {
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
      const communicationsMetrics = communications?.metrics || {};
      const inboxSummary = communications?.summary || {};
      const inboxItems = communications?.inboxItems || [];
      const unreadCriticalEmails = Number(communicationsMetrics.unreadCritical || 0);
      const waitingCustomerReplies = Number(communicationsMetrics.waitingCustomerReplies || 0);
      const supplierIssues = Number(communicationsMetrics.supplierIssues || 0);
      const financeEmails = Number(communicationsMetrics.financeEmails || 0);
      const bookingRequests = Number(communicationsMetrics.bookingRequests || 0);
      const needsReply = Number(communicationsMetrics.needsReply || 0);
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
      const websiteSecondaryActions = Number(websiteSnapshotMeta.secondaryTotal ?? parseCurrency(websiteMetrics['Click Phone Number']));
      const websiteEnquiries = parseCurrency(websiteMetrics['Contact Form Enquiries']);
      const websiteSignups = parseCurrency(websiteMetrics['Email Sign-ups']);
      const websiteConversionActions = websiteBookings + websiteSecondaryActions + websiteEnquiries + websiteSignups;
      const sessionsDeltaPct = Number(websiteSnapshotMeta.sessionsDeltaPct ?? 0);
      const isLiveGa4 = websiteDataSource.state === 'live-ga4';
      const youtubeMetrics = metricLookup(marketing.platforms?.youtube?.stats || []);
      const youtubeDataSource = marketing.platforms?.youtube?.dataSource || {};
      const youtubeSnapshotMeta = marketing.platforms?.youtube?.snapshotMeta || {};
      const youtubeSubscribers = parseCurrency(youtubeMetrics.Subscribers);
      const youtubeViews28Days = parseCurrency(youtubeMetrics['Views (28 days)']);
      const youtubeVideosPublished = parseCurrency(youtubeMetrics['Videos Published']);
      const youtubeSubscribersGained = parseCurrency(youtubeMetrics['Subscribers Gained']);
      const youtubeGrowthPct = parsePercent(youtubeMetrics['Audience Growth']);
      const youtubeAverageViews = parseCurrency(youtubeMetrics['Average Views / Video']);
      const isLiveYouTube = youtubeDataSource.state === 'live-youtube';
      const topYoutubeVideo = marketing.platforms?.youtube?.topContent?.[0] || marketing.contentLibrary?.items?.find((item) => item.platform === 'YouTube')?.title || 'the strongest tracked YouTube upload';
      const socialRankings = marketing.socialOverview?.rankings || [];
      const topSocialPlatform = socialRankings[0] || null;
      const weakestSocialPlatform = socialRankings[socialRankings.length - 1] || null;
      const socialAverageScore = average(socialRankings.map((item) => Number(item.score || 0)));
      const socialAverageGrowth = average(socialRankings.map((item) => parsePercent(item.growth, 0)));
      const socialAttribution = marketing.campaignPerformance?.attribution || {};
      const attributionTouchpoints = socialAttribution.touchpoints || [];
      const competitorBenchmark = marketing.competitorAnalysis?.benchmark || {};
      const competitorGrowthAvg = parsePercent(competitorBenchmark.competitorGrowthAvg, 0);
      const epGrowthAvg = parsePercent(competitorBenchmark.epGrowthAvg, 0);
      const liveSocialPlatforms = ['instagram', 'facebook', 'linkedin', 'x']
        .map((key) => marketing.platforms?.[key]?.dataSource?.state || '')
        .filter((state) => String(state).startsWith('live-')).length;

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
          executiveSummary: 'GA4 now confirms live website demand, but the synced fitting-booking and secondary action events are currently flat, so leadership has stronger traffic visibility than conversion visibility right now.',
          supportingEvidence: [
            `Sessions total ${websiteMetrics.Sessions || '—'} with ${websiteMetrics['New Users'] || '—'} new users.`,
            `Bounce rate is ${websiteMetrics['Bounce Rate'] || '—'}.`,
            `Fitting bookings ${websiteMetrics['Fitting Bookings'] || '0'}, secondary actions ${websiteSnapshotMeta.secondaryTotal ?? websiteMetrics['Click Phone Number'] ?? '0'}.`,
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

      if (isLiveYouTube && youtubeSubscribers > 0) {
        const confidence = confidenceEngine.score({ evidenceCount: 5, metricCoverage: 0.94, crossFunctional: 1, consistency: 0.89 });
        correlations.push({
          id: 'youtube-live-momentum',
          title: 'Live YouTube confirms video-led authority is compounding',
          executiveSummary: `YouTube is now live with ${youtubeMetrics.Subscribers || '—'} subscribers, ${youtubeMetrics['Views (28 days)'] || '—'} tracked views over the active window, and ${youtubeMetrics['Subscribers Gained'] || '—'} net subscriber movement. Leadership now has direct visibility into the channel that is most likely reinforcing authority, traffic quality, and downstream demand.`,
          supportingEvidence: [
            `Data source: ${youtubeDataSource.label || 'YouTube snapshot'}.`,
            `Tracked window: ${youtubeMetrics['Tracked Window'] || youtubeSnapshotMeta.historyCoverageLabel || 'Current live sync'}.`,
            `Videos published total ${youtubeMetrics['Videos Published'] || '—'}.`,
            `Audience growth ${youtubeMetrics['Audience Growth'] || '—'}.`,
            `Top tracked video: ${topYoutubeVideo}.`
          ],
          businessImpact: 'CMO → Website demand → Executive authority',
          financialImpact: 'Live YouTube channel data improves confidence that proof-led content is strengthening demand quality rather than only adding surface-level reach.',
          responsibleDepartment: 'CEO / CMO',
          prioritySignal: { financialImpact: 83, customerImpact: 78, strategicImportance: 91, timeSensitivity: 76, confidence: confidence.score },
          confidence,
          tone: youtubeGrowthPct >= 0 ? 'good' : 'warn'
        });
      }

      if (isLiveGa4 && isLiveYouTube && youtubeViews28Days > 0 && websiteSessions > 0) {
        const confidence = confidenceEngine.score({ evidenceCount: 6, metricCoverage: 0.97, crossFunctional: 1, consistency: 0.9 });
        correlations.push({
          id: 'youtube-website-demand-loop',
          title: 'YouTube visibility is reinforcing website demand',
          executiveSummary: `Live YouTube visibility is running at ${youtubeMetrics['Views (28 days)'] || '—'} while GA4 sessions are ${websiteMetrics.Sessions || '—'} and ${sessionsDeltaPct >= 0 ? 'up' : 'down'} ${Math.abs(sessionsDeltaPct).toFixed(1)}% versus the prior period. The strongest current evidence suggests video-led authority is helping sustain website demand rather than acting as an isolated awareness channel.`,
          supportingEvidence: [
            `YouTube tracked views: ${youtubeMetrics['Views (28 days)'] || '—'}.`,
            `Website sessions: ${websiteMetrics.Sessions || '—'}.`,
            `Session change versus prior period: ${sessionsDeltaPct >= 0 ? '+' : '-'}${Math.abs(sessionsDeltaPct).toFixed(1)}%.`,
            `Top tracked YouTube video: ${topYoutubeVideo}.`
          ],
          businessImpact: 'YouTube → Website demand → Executive confidence',
          financialImpact: 'The business can invest with more confidence in proof-led content when the strongest visibility channel is also lining up with healthier website demand.',
          responsibleDepartment: 'CEO / CMO',
          prioritySignal: { financialImpact: 86, customerImpact: 78, strategicImportance: 92, timeSensitivity: 74, confidence: confidence.score },
          confidence,
          tone: sessionsDeltaPct >= 0 ? 'good' : 'warn'
        });
      }

      if (isLiveYouTube && isLiveGa4 && youtubeViews28Days > 0 && youtubeSnapshotMeta.uploadsLast28Days > 0 && websiteSessions > 0) {
        const confidence = confidenceEngine.score({ evidenceCount: 5, metricCoverage: 0.92, crossFunctional: 1, consistency: 0.85 });
        correlations.push({
          id: 'youtube-publishing-consistency',
          title: 'Publishing consistency is helping sustain growth across YouTube and the website',
          executiveSummary: `${youtubeMetrics['Publishing Activity'] || `${youtubeVideosPublished} upload${youtubeVideosPublished === 1 ? '' : 's'} in the last 28 days`} is now visible alongside ${websiteMetrics.Sessions || '—'} website sessions. The opportunity is to protect cadence while live traffic is compounding, so the content engine keeps feeding both authority growth and website demand.`,
          supportingEvidence: [
            `Uploads in the active window: ${youtubeMetrics['Publishing Activity'] || youtubeSnapshotMeta.uploadsLast28Days || '—'}.`,
            `Views over the active window: ${youtubeMetrics['Views (28 days)'] || '—'}.`,
            `Website sessions over the current GA4 period: ${websiteMetrics.Sessions || '—'}.`,
            `Subscribers gained: ${youtubeMetrics['Subscribers Gained'] || '—'}.`,
            `Average views per video: ${youtubeMetrics['Average Views / Video'] || '—'}.`,
            `Top tracked video: ${topYoutubeVideo}.`
          ],
          businessImpact: 'Publishing cadence → Authority growth → Website demand',
          financialImpact: 'A steadier publishing rhythm should make current website traffic and video momentum more repeatable without adding channel complexity.',
          responsibleDepartment: 'CMO',
          prioritySignal: { financialImpact: 79, customerImpact: 74, strategicImportance: 88, timeSensitivity: 82, confidence: confidence.score },
          confidence,
          tone: 'good'
        });
      }

      if (isLiveGa4 && websiteSessions > 0) {
        const confidence = confidenceEngine.score({ evidenceCount: 5, metricCoverage: 0.94, crossFunctional: 1, consistency: 0.86 });
        correlations.push({
          id: 'website-fitting-conversion-link',
          title: 'Website traffic is outpacing fitting conversion capture',
          executiveSummary: `GA4 sessions are ${websiteMetrics.Sessions || '—'} in the current live window, with fitting bookings at ${websiteMetrics['Fitting Bookings'] || '0'} and secondary actions at ${websiteSnapshotMeta.secondaryTotal ?? websiteMetrics['Click Phone Number'] ?? '0'}. The signal is strong enough to say the next marketing gain likely comes from turning existing traffic into clearer booking intent, not from chasing more attention first.`,
          supportingEvidence: [
            `Sessions: ${websiteMetrics.Sessions || '—'}.`,
            `Users: ${websiteMetrics.Users || websiteMetrics['Website Visitors'] || '—'}.`,
            `Bookings: ${websiteMetrics['Fitting Bookings'] || '0'}.`,
            `Secondary actions: ${websiteSnapshotMeta.secondaryTotal ?? websiteMetrics['Click Phone Number'] ?? '0'}.`,
            `Conversion rate: ${websiteMetrics['Conversion Rate'] || '0.0%'}.`
          ],
          businessImpact: 'Website traffic → Enquiries → Revenue quality',
          financialImpact: 'The fastest commercial upside is probably conversion work on the current website path rather than additional top-of-funnel expansion.',
          responsibleDepartment: 'CMO / Sales / Website',
          prioritySignal: { financialImpact: 85, customerImpact: 83, strategicImportance: 87, timeSensitivity: 80, confidence: confidence.score },
          confidence,
          tone: 'warn'
        });
      }

      if (isLiveYouTube && youtubeAverageViews > 0) {
        const topVideo = marketing.platforms?.youtube?.snapshotMeta?.topVideo || marketing.platforms?.youtube?.topContent?.[0] || topYoutubeVideo;
        const confidence = confidenceEngine.score({ evidenceCount: 5, metricCoverage: 0.9, crossFunctional: 0.9, consistency: 0.84 });
        correlations.push({
          id: 'content-opportunity-proof-loop',
          title: 'High-performing video content should be reused as the next conversion asset',
          executiveSummary: `The current YouTube benchmark is ${topYoutubeVideo}, with ${youtubeMetrics['Average Views / Video'] || '—'} average views per video and ${youtubeMetrics['Views (28 days)'] || '—'} tracked visibility overall. The most obvious marketing opportunity is to reuse the strongest proof-led video themes inside website CTAs, email follow-up, and short-form cutdowns instead of treating the win as platform-specific.`,
          supportingEvidence: [
            `Top tracked video: ${topVideo}.`,
            `Average views per video: ${youtubeMetrics['Average Views / Video'] || '—'}.`,
            `Tracked views across the current window: ${youtubeMetrics['Views (28 days)'] || '—'}.`,
            `Website sessions currently: ${websiteMetrics.Sessions || marketing.dashboard?.metrics?.visitors || '—'}.`
          ],
          businessImpact: 'Content performance → Website conversion → Marketing leverage',
          financialImpact: 'Repurposing the strongest proof-led content should improve conversion quality faster than creating more low-signal content across weaker channels.',
          responsibleDepartment: 'CMO',
          prioritySignal: { financialImpact: 81, customerImpact: 79, strategicImportance: 84, timeSensitivity: 75, confidence: confidence.score },
          confidence,
          tone: 'good'
        });
      }

      if (socialRankings.length) {
        const confidence = confidenceEngine.score({ evidenceCount: 5, metricCoverage: 0.91, crossFunctional: 1, consistency: 0.86 });
        correlations.push({
          id: 'social-momentum-stack',
          title: 'The social estate now has a clear performance hierarchy',
          executiveSummary: `${topSocialPlatform?.platform || 'The strongest social channel'} is leading the social estate at ${topSocialPlatform?.score || '—'}/100 while ${weakestSocialPlatform?.platform || 'the weakest channel'} remains the lightest-return channel. The opportunity is to sequence one proof-led story across Instagram, Facebook, LinkedIn, and X instead of treating every platform as an equal planning problem.`,
          supportingEvidence: socialRankings.map((item) => `${item.platform}: ${item.score}/100 with ${item.growth} growth.`),
          businessImpact: 'Social performance → Channel focus → Marketing efficiency',
          financialImpact: 'Better social channel focus should improve content return and reduce the amount of effort wasted on low-signal distribution.',
          responsibleDepartment: 'CMO / Content',
          prioritySignal: { financialImpact: 78, customerImpact: 72, strategicImportance: 86, timeSensitivity: 76, confidence: confidence.score },
          confidence,
          tone: socialAverageScore >= 75 ? 'good' : 'warn'
        });
      }

      if (socialRankings.some((item) => String(item.platform).toLowerCase().includes('linkedin'))) {
        const linkedIn = socialRankings.find((item) => String(item.platform).toLowerCase().includes('linkedin'));
        const confidence = confidenceEngine.score({ evidenceCount: 4, metricCoverage: 0.85, crossFunctional: 0.85, consistency: 0.82 });
        correlations.push({
          id: 'linkedin-authority-gap',
          title: 'LinkedIn has authority value, but it should stay deliberate',
          executiveSummary: `LinkedIn is currently running at ${linkedIn?.score || '—'}/100 with ${linkedIn?.growth || '—'} growth. It has enough strategic value to justify attention, but only if it is used as a premium trust surface rather than treated like another generic posting slot.`,
          supportingEvidence: [
            `LinkedIn score: ${linkedIn?.score || '—'}/100.`,
            `LinkedIn growth: ${linkedIn?.growth || '—'}.`,
            `The current marketing mix already includes higher-reach channels for volume and awareness.`
          ],
          businessImpact: 'Executive authority → Trust-building → Lead quality',
          financialImpact: 'The right LinkedIn asset can strengthen premium positioning and improve downstream conversion quality more than a high volume of lower-signal posts.',
          responsibleDepartment: 'CMO / Founder Brand',
          prioritySignal: { financialImpact: 67, customerImpact: 71, strategicImportance: 82, timeSensitivity: 64, confidence: confidence.score },
          confidence,
          tone: linkedIn?.score >= 70 ? 'info' : 'warn'
        });
      }

      if (weakestSocialPlatform && String(weakestSocialPlatform.platform).toLowerCase().includes('x')) {
        const confidence = confidenceEngine.score({ evidenceCount: 4, metricCoverage: 0.88, crossFunctional: 0.8, consistency: 0.89 });
        correlations.push({
          id: 'x-channel-drag',
          title: 'X is the weakest social return channel in the current stack',
          executiveSummary: `${weakestSocialPlatform.platform} is currently the weakest social return channel at ${weakestSocialPlatform.score}/100. Unless it serves a very specific positioning or conversation purpose, the better move is likely to reallocate part of that effort into the strongest proof-led channels and website conversion work.`,
          supportingEvidence: [
            `${weakestSocialPlatform.platform} score: ${weakestSocialPlatform.score}/100.`,
            `Growth: ${weakestSocialPlatform.growth}.`,
            `Top social channel: ${topSocialPlatform?.platform || '—'} at ${topSocialPlatform?.score || '—'}/100.`
          ],
          businessImpact: 'Content effort → Channel selection → Return on execution',
          financialImpact: 'Reducing low-return channel effort should free time for higher-value content and conversion work without increasing team workload.',
          responsibleDepartment: 'CMO / Content Ops',
          prioritySignal: { financialImpact: 72, customerImpact: 58, strategicImportance: 79, timeSensitivity: 83, confidence: confidence.score },
          confidence,
          tone: 'warn'
        });
      }

      if (competitorBenchmark.summary) {
        const confidence = confidenceEngine.score({ evidenceCount: 4, metricCoverage: 0.84, crossFunctional: 0.92, consistency: 0.83 });
        correlations.push({
          id: 'competitor-pressure-window',
          title: 'Competitor benchmarking should sharpen EP’s premium positioning',
          executiveSummary: `${competitorBenchmark.summary} The right response is not more generic output; it is to lean harder into premium proof, trust, and high-conviction educational themes where EP can feel more distinctive than larger or noisier competitors.`,
          supportingEvidence: [
            `EP average social growth: ${competitorBenchmark.epGrowthAvg || '—'}.`,
            `Competitor growth baseline: ${competitorBenchmark.competitorGrowthAvg || '—'}.`,
            `Strongest EP channel: ${competitorBenchmark.leader || topSocialPlatform?.platform || '—'}.`,
            `Weakest EP channel: ${competitorBenchmark.laggard || weakestSocialPlatform?.platform || '—'}.`
          ],
          businessImpact: 'Competitor benchmarking → Positioning → Marketing strategy',
          financialImpact: 'Better benchmark-aware positioning should improve the odds that content effort compounds into brand preference instead of blending into the market noise.',
          responsibleDepartment: 'CEO / CMO',
          prioritySignal: { financialImpact: 73, customerImpact: 76, strategicImportance: 84, timeSensitivity: 68, confidence: confidence.score },
          confidence,
          tone: epGrowthAvg >= competitorGrowthAvg ? 'good' : 'warn'
        });
      }

      if (attributionTouchpoints.length) {
        const confidence = confidenceEngine.score({ evidenceCount: 4, metricCoverage: 0.86, crossFunctional: 1, consistency: 0.84 });
        correlations.push({
          id: 'attribution-clarity-gap',
          title: 'Attribution is strong enough to guide decisions, but not strong enough to overcomplicate',
          executiveSummary: `${socialAttribution.summary || 'The attribution view is now visible across the marketing estate.'} The best use of this layer is to clarify which channels and themes deserve more effort next, without pretending the system has native closed-loop precision yet.`,
          supportingEvidence: attributionTouchpoints.slice(0, 5).map((item) => `${item.channel}: ${item.share}${item.note ? ` — ${item.note}` : ''}`),
          businessImpact: 'Attribution visibility → Channel decisions → Commercial focus',
          financialImpact: `Decision-grade attribution should help protect and grow the currently tracked ${socialAttribution.revenueAttributed || marketing.campaignPerformance?.revenueAttribution || 'attributed demand'} without adding avoidable complexity.`,
          responsibleDepartment: 'CMO / Website',
          prioritySignal: { financialImpact: 76, customerImpact: 64, strategicImportance: 82, timeSensitivity: 70, confidence: confidence.score },
          confidence,
          tone: liveSocialPlatforms > 0 || isLiveGa4 || isLiveYouTube ? 'good' : 'info'
        });
      }


      if (waitingCustomerReplies > 0) {
        const confidence = confidenceEngine.score({ evidenceCount: 4, metricCoverage: 0.89, crossFunctional: 1, consistency: 0.85 });
        correlations.push({
          id: 'gmail-customer-reply-backlog',
          title: 'Customer reply backlog is now affecting executive responsiveness',
          executiveSummary: `${waitingCustomerReplies} customer conversation${waitingCustomerReplies === 1 ? '' : 's'} currently need replies. The CEO now has enough inbox evidence to treat response speed as a commercial issue rather than a background admin task.`,
          supportingEvidence: [
            inboxSummary.dailySummary || 'Executive Inbox summary available.',
            `${waitingCustomerReplies} customer replies are waiting.`,
            `${bookingRequests} booking request${bookingRequests === 1 ? '' : 's'} are currently visible.`,
            `${unreadCriticalEmails} unread critical email${unreadCriticalEmails === 1 ? '' : 's'} remain in the queue.`
          ],
          businessImpact: 'Customer conversations → Booking conversion → Executive trust',
          financialImpact: 'Faster inbox response should improve conversion capture from already-visible demand without needing more marketing spend.',
          responsibleDepartment: 'CEO / Customer Success / Sales',
          prioritySignal: { financialImpact: 82, customerImpact: 90, strategicImportance: 81, timeSensitivity: 88, confidence: confidence.score },
          confidence,
          tone: 'warn'
        });
      }

      if (supplierIssues > 0) {
        const confidence = confidenceEngine.score({ evidenceCount: 3, metricCoverage: 0.84, crossFunctional: 0.9, consistency: 0.82 });
        correlations.push({
          id: 'gmail-supplier-issue-delay',
          title: 'Supplier conversations now deserve executive follow-through',
          executiveSummary: `${supplierIssues} supplier issue${supplierIssues === 1 ? '' : 's'} are sitting in the Executive Inbox, suggesting that margin, timing, or service continuity may now be shaped by email follow-through rather than only by dashboard metrics.`,
          supportingEvidence: [
            `${supplierIssues} supplier issue${supplierIssues === 1 ? '' : 's'} visible in the inbox.`,
            `Largest supplier spend is ${finance.suppliers?.[0]?.spendMonth || 'visible in finance workspace'}.`,
            `Profit trend remains ${finance.metrics?.find((item) => item.key === 'profit')?.trend || 'under review'}.`
          ],
          businessImpact: 'Supplier communication → Margin quality → Operating continuity',
          financialImpact: 'Slow supplier follow-through can leak into renewal timing, invoice approvals, or margin pressure faster than the dashboard alone reveals.',
          responsibleDepartment: 'CFO / COO',
          prioritySignal: { financialImpact: 86, customerImpact: 52, strategicImportance: 80, timeSensitivity: 79, confidence: confidence.score },
          confidence,
          tone: 'warn'
        });
      }

      if (financeEmails > 0) {
        const confidence = confidenceEngine.score({ evidenceCount: 3, metricCoverage: 0.83, crossFunctional: 0.75, consistency: 0.84 });
        correlations.push({
          id: 'gmail-finance-approval-outstanding',
          title: 'Finance-sensitive email is now shaping approval timing',
          executiveSummary: `${financeEmails} finance-related email${financeEmails === 1 ? '' : 's'} are visible in the Executive Inbox. Approval quality now depends partly on how quickly finance threads are triaged, not just on the static approval queue.`,
          supportingEvidence: [
            `${financeEmails} finance threads in the inbox.`,
            `${approvalCount} total approval items across the workspace.`,
            `Cash forecast is ${finance.forecasts?.cash || 'under review'}.`
          ],
          businessImpact: 'Finance communication → Approval timing → Cash confidence',
          financialImpact: 'Inbox-led finance delays can reduce visibility and slow decision speed around cash, invoices, or reconciliations.',
          responsibleDepartment: 'CFO',
          prioritySignal: { financialImpact: 84, customerImpact: 42, strategicImportance: 79, timeSensitivity: 82, confidence: confidence.score },
          confidence,
          tone: 'warn'
        });
      }

      if (bookingRequests > 0) {
        const confidence = confidenceEngine.score({ evidenceCount: 4, metricCoverage: 0.87, crossFunctional: 1, consistency: 0.86 });
        correlations.push({
          id: 'gmail-booking-request-flow',
          title: 'The inbox is holding direct booking demand',
          executiveSummary: `${bookingRequests} booking request${bookingRequests === 1 ? '' : 's'} are currently visible in Gmail, which means part of the next revenue gain may come from faster inbox conversion rather than from acquiring more top-of-funnel attention.`,
          supportingEvidence: [
            `${bookingRequests} booking requests are currently visible.`,
            `${needsReply} total conversations need a reply or follow-up.`,
            `Website bookings currently show ${websiteMetrics['Fitting Bookings'] || marketing.dashboard?.metrics?.enquiries || '—'} fitting-booking actions.`
          ],
          businessImpact: 'Inbox demand → Booking conversion → Revenue quality',
          financialImpact: 'Responding faster to existing booking demand should improve near-term revenue capture without adding new acquisition cost.',
          responsibleDepartment: 'CEO / Sales',
          prioritySignal: { financialImpact: 80, customerImpact: 88, strategicImportance: 83, timeSensitivity: 90, confidence: confidence.score },
          confidence,
          tone: 'good'
        });
      }

      if (healthDelta > 0 && revenueTrend > 0) {
        const confidence = confidenceEngine.score({ evidenceCount: 4, metricCoverage: 0.9, crossFunctional: 1, consistency: 0.92 });
        correlations.push({
          id: 'marketing-revenue-growth',
          title: 'Marketing momentum is translating into top-line demand',
          executiveSummary: 'Marketing health improved while revenue also moved higher, which suggests awareness and trust-building activity are feeding commercial demand rather than just vanity reach.',
          supportingEvidence: [`Marketing health moved from ${marketing.dashboard?.previousScore} to ${marketing.dashboard?.healthScore}.`, `Revenue trend is ${finance.metrics?.find((item) => item.key === 'revenue')?.trend}.`, `Website visitors are ${marketing.dashboard?.metrics?.visitors}.`, `Booking demand total ${marketing.dashboard?.metrics?.enquiries}.`],
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
          executiveSummary: 'Website attention is strong, but conversion into fitting bookings and secondary actions is not rising at the same speed, which points to a commercial friction point rather than an awareness problem.',
          supportingEvidence: [
            `Website visitors total ${isLiveGa4 ? (websiteMetrics.Users || websiteMetrics['Website Visitors'] || '—') : marketing.dashboard?.metrics?.visitors}.`,
            `Leads total ${marketing.dashboard?.metrics?.leads}.`,
            `Secondary conversion actions total ${isLiveGa4 ? (websiteSnapshotMeta.secondaryTotal ?? websiteMetrics['Click Phone Number'] ?? '0') : marketing.dashboard?.metrics?.enquiries}.`,
            `Best-performing channel remains ${marketing.dashboard?.bestPlatform}.`
          ],
          businessImpact: 'Marketing → Website → Sales / Customer Journey',
          financialImpact: 'Improving the website path could convert more of the current traffic into higher-value fitting enquiries without requiring more media effort.',
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
