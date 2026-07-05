export const EXECUTIVE_MEMORY_SEED = Object.freeze({
  version: '0.1.0',
  retention: {
    timelineHistory: '24 months',
    completedDecisions: 'Keep permanently in executive memory',
    archivedGoals: 'Keep 18 months after completion',
    memoryCategories: ['timeline', 'decisions', 'goals', 'historical-context', 'risks', 'opportunities', 'recurring-issues']
  },
  timelineEvents: [
    {
      id: 'mem-revenue-record-q1',
      date: '2026-03-31',
      time: 'Q1 close',
      title: 'Quarterly revenue record set',
      body: 'The business closed the quarter at £43.2k average monthly revenue, establishing the benchmark the CEO now uses for growth quality.',
      category: 'Revenue milestone',
      department: 'Finance',
      impact: 'High',
      relatedEntities: ['goal-monthly-revenue-50k', 'kpi-revenue', 'decision-price-discipline'],
      status: 'Closed',
      route: '/reports/executive-timeline'
    },
    {
      id: 'mem-youtube-proof-series-launch',
      date: '2026-04-08',
      time: 'Apr 2026',
      title: 'Proof-led YouTube series launched',
      body: 'The content strategy shifted toward premium proof and educational fitting content, creating the current video-led demand engine.',
      category: 'Campaign launch',
      department: 'Marketing',
      impact: 'High',
      relatedEntities: ['goal-youtube-100k', 'decision-video-proof-series', 'kpi-website-users'],
      status: 'Closed',
      route: '/reports/executive-timeline'
    },
    {
      id: 'mem-website-traffic-april',
      date: '2026-04-30',
      time: 'Apr close',
      title: 'Website traffic moved above 16k users',
      body: 'Website performance began compounding behind video-led content, creating the first clear run of stronger monthly demand.',
      category: 'Website milestone',
      department: 'Marketing / Website',
      impact: 'Medium',
      relatedEntities: ['goal-booking-conversion', 'trend-traffic-consecutive-growth', 'kpi-website-users'],
      status: 'Closed',
      route: '/reports/executive-timeline'
    },
    {
      id: 'mem-website-traffic-may',
      date: '2026-05-31',
      time: 'May close',
      title: 'Website traffic moved above 18k users',
      body: 'The second consecutive month of traffic growth suggested that content quality was driving a sustained demand pattern, not a one-off spike.',
      category: 'Website milestone',
      department: 'Marketing / Website',
      impact: 'Medium',
      relatedEntities: ['trend-traffic-consecutive-growth', 'goal-booking-conversion', 'kpi-website-users'],
      status: 'Closed',
      route: '/reports/executive-timeline'
    },
    {
      id: 'mem-website-traffic-june',
      date: '2026-06-30',
      time: 'Jun close',
      title: 'Website traffic moved above 20k users',
      body: 'Traffic growth extended into a third consecutive month, strengthening the case that the business now has a repeatable audience momentum loop.',
      category: 'Website milestone',
      department: 'Marketing / Website',
      impact: 'High',
      relatedEntities: ['trend-traffic-consecutive-growth', 'goal-booking-conversion', 'kpi-website-users'],
      status: 'Closed',
      route: '/reports/executive-timeline'
    },
    {
      id: 'mem-supplier-review-trigger',
      date: '2026-06-29',
      time: 'This month',
      title: 'Supplier concentration escalated into an executive issue',
      body: 'Supplier cost growth moved from an operational concern into a margin-protection decision for leadership.',
      category: 'Supplier change',
      department: 'Finance / Operations',
      impact: 'High',
      relatedEntities: ['decision-supplier-review', 'risk-supplier-concentration', 'goal-monthly-revenue-50k'],
      status: 'Active',
      route: '/reports/executive-timeline'
    },
    {
      id: 'mem-ga4-live-enabled',
      date: '2026-07-05',
      time: 'Today',
      title: 'GA4 executive website memory enabled',
      body: 'Website Analytics can now hydrate from a generated GA4 snapshot and the CEO dashboard can reference live demand movement.',
      category: 'System milestone',
      department: 'Marketing / Executive',
      impact: 'Medium',
      relatedEntities: ['goal-booking-conversion', 'trend-traffic-consecutive-growth', 'kpi-website-users'],
      status: 'Active',
      route: '/reports/executive-timeline'
    }
  ],
  decisions: [
    {
      id: 'decision-video-proof-series',
      date: '2026-04-08',
      title: 'Commit to a proof-led YouTube content strategy',
      summary: 'Leadership shifted the content mix toward proof-led, high-trust fitting content rather than broader low-intent posting.',
      reason: 'Video content showed the strongest combination of authority, reach quality, and downstream website demand.',
      expectedOutcome: 'Increase brand trust, website traffic quality, and enquiry volume through more premium educational content.',
      actualOutcome: 'Website traffic and YouTube momentum both improved; the next bottleneck became conversion rather than reach.',
      owner: 'CMO',
      department: 'Marketing',
      relatedKpis: ['Website Users', 'Sessions', 'Booking Conversion'],
      linkedGoalIds: ['goal-youtube-100k', 'goal-booking-conversion'],
      linkedTimelineEventIds: ['mem-youtube-proof-series-launch'],
      status: 'Completed',
      route: '/reports/decision-journal'
    },
    {
      id: 'decision-supplier-review',
      date: '2026-06-29',
      title: 'Escalate supplier concentration review',
      summary: 'The largest supplier relationship moved onto the executive agenda because margin softness was no longer acceptable as background noise.',
      reason: 'Supplier spend rose faster than gross profit contribution, making concentration strategically relevant.',
      expectedOutcome: 'Reduce margin leakage and improve planning flexibility through better terms or revised purchasing discipline.',
      actualOutcome: 'Negotiation prep is underway; financial upside is still pending.',
      owner: 'CFO / COO',
      department: 'Finance / Operations',
      relatedKpis: ['Profit', 'Gross Margin', 'Cash Position'],
      linkedGoalIds: ['goal-monthly-revenue-50k'],
      linkedTimelineEventIds: ['mem-supplier-review-trigger'],
      status: 'Active',
      route: '/reports/decision-journal'
    },
    {
      id: 'decision-collections-discipline',
      date: '2026-07-01',
      title: 'Tighten collections discipline on concentrated overdue balances',
      summary: 'Leadership agreed that receivables timing should shape near-term approvals more than fresh discretionary spend.',
      reason: 'A small number of overdue invoices were exerting outsized influence on flexibility.',
      expectedOutcome: 'Accelerate cash receipts and reduce the need for defensive approval sequencing.',
      actualOutcome: 'Still in flight; the issue remains recurring and is being tracked as a live executive memory item.',
      owner: 'CFO / Sales',
      department: 'Finance / Sales',
      relatedKpis: ['Cash Position', 'Runway', 'Open Approvals'],
      linkedGoalIds: ['goal-second-studio-optionality'],
      linkedTimelineEventIds: [],
      status: 'Active',
      route: '/reports/decision-journal'
    },
    {
      id: 'decision-ga4-live-snapshot',
      date: '2026-07-05',
      title: 'Enable live GA4 snapshot for executive website intelligence',
      summary: 'Leadership chose to add live website demand visibility without changing the wider demo-first architecture.',
      reason: 'The CEO needed real website momentum data while preserving the provider-service-intelligence structure and safe fallback behaviour.',
      expectedOutcome: 'Expose live website movement to the CEO, CMO, and reports while keeping every other surface stable.',
      actualOutcome: 'Live GA4 is now available and fallback remains automatic if the snapshot disappears.',
      owner: 'CEO / CMO',
      department: 'Executive / Marketing',
      relatedKpis: ['Website Users', 'Sessions', 'Bounce Rate'],
      linkedGoalIds: ['goal-booking-conversion'],
      linkedTimelineEventIds: ['mem-ga4-live-enabled'],
      status: 'Completed',
      route: '/reports/decision-journal'
    }
  ],
  goals: [
    {
      id: 'goal-youtube-100k',
      title: 'Reach 100k YouTube subscribers',
      summary: 'Build a defensible authority channel around proof-led premium fitting education.',
      owner: 'CMO',
      department: 'Marketing',
      deadline: '2027-03-31',
      progress: 68,
      status: 'On Track',
      target: '100k subscribers',
      currentValue: '68.4k subscribers',
      linkedMetrics: ['Subscribers', 'Watch Time', 'Website Users'],
      linkedDecisionIds: ['decision-video-proof-series'],
      route: '/reports/strategic-goals'
    },
    {
      id: 'goal-monthly-revenue-50k',
      title: 'Sustain £50k monthly revenue',
      summary: 'Turn recent growth into a stable revenue baseline without sacrificing margin discipline.',
      owner: 'CEO / CFO',
      department: 'Executive / Finance',
      deadline: '2026-09-30',
      progress: 83,
      status: 'At Risk',
      target: '£50k monthly revenue',
      currentValue: '£46.8k monthly revenue',
      linkedMetrics: ['Revenue', 'Profit', 'Cash Position'],
      linkedDecisionIds: ['decision-supplier-review', 'decision-collections-discipline'],
      route: '/reports/strategic-goals'
    },
    {
      id: 'goal-second-studio-optionality',
      title: 'Preserve the option to open a second studio',
      summary: 'Protect cash flexibility and strategic clarity so expansion can be considered from a position of strength.',
      owner: 'CEO',
      department: 'Executive',
      deadline: '2027-06-30',
      progress: 41,
      status: 'Needs Review',
      target: 'Expansion readiness pack approved',
      currentValue: 'Cash timing and conversion work still underway',
      linkedMetrics: ['Cash Position', 'Runway', 'Booking Conversion'],
      linkedDecisionIds: ['decision-collections-discipline'],
      route: '/reports/strategic-goals'
    },
    {
      id: 'goal-booking-conversion',
      title: 'Improve booking conversion from existing demand',
      summary: 'Turn current traffic momentum into stronger booking and enquiry outcomes before chasing more top-of-funnel volume.',
      owner: 'CMO / Website Lead',
      department: 'Marketing / Website',
      deadline: '2026-08-31',
      progress: 57,
      status: 'On Track',
      target: '4.2% booking conversion',
      currentValue: '3.2% booking conversion',
      linkedMetrics: ['Website Users', 'Sessions', 'Booking Conversion', 'Bounce Rate'],
      linkedDecisionIds: ['decision-video-proof-series', 'decision-ga4-live-snapshot'],
      route: '/reports/strategic-goals'
    },
    {
      id: 'goal-multilingual-channels',
      title: 'Prepare multilingual channel expansion',
      summary: 'Define the playbook for future multilingual education and authority content without diffusing the current core strategy.',
      owner: 'CEO / CMO',
      department: 'Executive / Marketing',
      deadline: '2027-01-31',
      progress: 22,
      status: 'Planned',
      target: 'Pilot expansion brief approved',
      currentValue: 'Opportunity under review',
      linkedMetrics: ['Subscribers', 'International Reach', 'Website Users'],
      linkedDecisionIds: [],
      route: '/reports/strategic-goals'
    }
  ],
  context: {
    recurringIssues: [
      {
        id: 'context-collections',
        title: 'Collections timing keeps returning as an executive constraint',
        summary: 'Receivables timing has now appeared across multiple finance decisions and still shapes approval confidence.',
        department: 'Finance / Sales',
        linkedDecisionIds: ['decision-collections-discipline'],
        severity: 'High',
        route: '/ai-assistant/memory-context'
      },
      {
        id: 'context-conversion-gap',
        title: 'Demand quality is outrunning booking conversion',
        summary: 'Traffic and reach keep improving, but booking conversion remains the most important unresolved commercial bottleneck.',
        department: 'Marketing / Website',
        linkedDecisionIds: ['decision-video-proof-series', 'decision-ga4-live-snapshot'],
        severity: 'Medium',
        route: '/ai-assistant/memory-context'
      }
    ],
    historicalTrends: [
      {
        id: 'trend-traffic-consecutive-growth',
        title: 'Website traffic increased for three consecutive months',
        summary: 'Traffic moved from 16.1k in April to 18.4k in May and 20.1k in June before the current live GA4 period.',
        department: 'Marketing / Website',
        comparison: 'consecutive-growth',
        referenceValues: ['Apr 16.1k', 'May 18.4k', 'Jun 20.1k'],
        route: '/ai-assistant/memory-context'
      },
      {
        id: 'trend-revenue-quarter-record',
        title: 'Current revenue is running above the prior quarterly benchmark',
        summary: 'The prior quarterly benchmark was £43.2k average monthly revenue; the current monthly run-rate is now above that mark.',
        department: 'Finance',
        comparison: 'record-beat',
        referenceValues: ['Q1 avg £43.2k', 'Current £46.8k'],
        route: '/ai-assistant/memory-context'
      }
    ],
    strategicThemes: [
      'Protect flexibility before adding new fixed commitments.',
      'Use proof-led authority content as the growth engine, but prioritise conversion quality next.',
      'Keep approvals selective so leadership attention stays on the handful of decisions that materially change momentum.'
    ],
    memoryHighlights: [
      {
        id: 'highlight-ga4-live',
        title: 'Live website intelligence is now available',
        body: 'GA4 data can now inform executive context without turning the wider product into a live-integration system.',
        tone: 'good',
        route: '/ai-assistant/memory-context'
      },
      {
        id: 'highlight-supplier-pressure',
        title: 'Supplier pressure became a strategic issue, not just an operational one',
        body: 'The business keeps returning to supplier concentration as a margin-quality risk worth remembering over time.',
        tone: 'warn',
        route: '/reports/decision-journal'
      },
      {
        id: 'highlight-conversion-gap',
        title: 'Traffic momentum is not yet matched by booking conversion',
        body: 'The memory layer should keep this visible so leadership does not mistake reach for value capture.',
        tone: 'risk',
        route: '/reports/strategic-goals'
      }
    ]
  }
});
