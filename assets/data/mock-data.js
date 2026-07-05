export const NAV_PRIMARY = [
  ['workspace', 'Workspace', 'home'],
  ['revenue', 'Revenue', 'trending-up'],
  ['profit', 'Profit', 'coins'],
  ['expenses', 'Expenses', 'receipt'],
  ['supplier-spend', 'Supplier Spend', 'building'],
  ['cash-flow', 'Cash Flow', 'wallet'],
  ['vat', 'VAT', 'shield'],
  ['forecasting', 'Forecasting', 'sparkles'],
  ['business-kpis', 'Business KPIs', 'grid'],
  ['approval-centre', 'Approval Centre', 'check-circle'],
  ['decision-journal', 'Decision Journal', 'book-open'],
  ['weekly-briefings', 'Weekly Briefings', 'presentation'],
  ['settings', 'Settings', 'settings']
];

export const NAV_SECONDARY = [
  ['financial-health', 'Financial Health Score', 'pulse'],
  ['opportunity-register', 'Opportunity Register', 'target'],
  ['risk-register', 'Risk Register', 'alert-triangle'],
  ['quarterly-review', 'Quarterly Review', 'calendar']
];

export const MODE_OPTIONS = [
  ['workspace', 'Workspace'],
  ['board', 'Board Meeting']
];

export const PAGE_META = {
  workspace: {
    title: 'CFO Workspace',
    subtitle: 'A calm, premium executive workspace for day-to-day financial leadership.'
  },
  revenue: { title: 'Revenue', subtitle: 'Demand quality, collections, mix, and forecast confidence.' },
  profit: { title: 'Profit', subtitle: 'Margin strength, cost pressure, and profitability action.' },
  expenses: { title: 'Expenses', subtitle: 'Operating cost discipline with strategic context.' },
  'supplier-spend': { title: 'Supplier Spend', subtitle: 'Supplier concentration, opportunities, and risk.' },
  'cash-flow': { title: 'Cash Flow', subtitle: 'Liquidity strength, forecast confidence, and runway.' },
  vat: { title: 'VAT', subtitle: 'VAT position, forecast, and submission-readiness confidence.' },
  forecasting: { title: 'Forecasting', subtitle: 'Executive scenarios, assumption testing, and investment thinking.' },
  'business-kpis': { title: 'Business KPIs', subtitle: 'A contextual business KPI layer with score transparency.' },
  'approval-centre': { title: 'Approval Centre', subtitle: 'Approval-first financial governance grouped by decision type.' },
  'decision-journal': { title: 'Decision Journal', subtitle: 'Searchable executive timeline of recommendations and outcomes.' },
  'weekly-briefings': { title: 'Weekly Briefings', subtitle: 'Board-style Sunday briefing experience.' },
  settings: { title: 'Settings', subtitle: 'Prototype controls for themes, preferences, and future integrations.' },
  'financial-health': { title: 'Financial Health Score', subtitle: 'Weighted score breakdown, movement, and recommendations.' },
  'opportunity-register': { title: 'Opportunity Register', subtitle: 'Permanent register of opportunities worth executive attention.' },
  'risk-register': { title: 'Risk Register', subtitle: 'Living register of business risk, mitigation, and ownership.' },
  'quarterly-review': { title: 'Quarterly Executive Review', subtitle: 'Prepared board paper for the quarter just gone.' }
};

export const MOCK_DATA = {
  brand: {
    name: 'EP Intelligence',
    workspace: 'CFO Executive Workspace',
    description: 'Executive decision support for EP Golf Studios.'
  },
  welcome: {
    greeting: 'Good morning, Kane.',
    title: 'Your Chief Financial Officer is ready.',
    score: 84,
    previousScore: 81,
    trend: '+3 points vs last month',
    label: 'Stable with near-term control actions',
    summary:
      'The business is financially healthy overall, but collections discipline and supplier cost control will decide how much freedom EP Golf Studios has over the next six weeks.',
    narrative:
      'Revenue quality is good, profit is slightly compressed by supplier and support costs, and cash remains healthy if receivables are actively managed this week.',
    snapshot: {
      revenue: '£46.8k',
      profit: '£11.6k',
      cash: '£28.1k',
      approvals: '6 waiting'
    }
  },
  homepage: {
    banner: {
      title: 'Executive Summary',
      body: 'EP Golf Studios is trading from a position of strength, but the smartest decisions this week are around collections, margin discipline, and approval sequencing rather than new discretionary spend.'
    },
    priorities: [
      {
        title: 'Review overdue invoices',
        note: 'Receivables are the fastest path to stronger short-term flexibility.',
        tone: 'warn'
      },
      {
        title: 'Pressure-test supplier spend',
        note: 'Supplier concentration is now strategically important rather than just operationally relevant.',
        tone: 'risk'
      },
      {
        title: 'Protect discretionary spend discipline',
        note: 'Cash is healthy enough for calm decisions, but not for avoidable drift.',
        tone: 'good'
      }
    ],
    quickActions: [
      'Open Approval Centre',
      'Review Supplier Spend',
      'Generate Sunday Briefing',
      'Ask why profit changed'
    ],
    favouriteReports: ['Weekly Briefings', 'Cash Flow', 'Supplier Spend'],
    recentApprovals: ['Approve supplier payment batch', 'Approve conservative Q3 forecast assumptions'],
    businessSnapshot: [
      'Demand remains healthy with premium conversion holding up.',
      'Net profit is slightly softer than last month because costs rose faster than revenue quality improved.',
      'Cash remains comfortable if collections stay disciplined.',
      'No automation is enabled; all material actions remain approval-first.'
    ]
  },
  metrics: [
    {
      key: 'revenue',
      label: 'Revenue Summary',
      value: '£46.8k',
      trend: '+8.4% vs last month',
      detail:
        'Revenue is ahead of plan and appears to be driven by strong fitting demand and better accessory conversion. The CFO lens is now on quality and collectability, not just volume.'
    },
    {
      key: 'profit',
      label: 'Profit Summary',
      value: '£11.6k',
      trend: '-3.1% vs last month',
      detail:
        'Profit remains strong, but softer than the month before because supplier and support costs grew faster than ideal.'
    },
    {
      key: 'cash',
      label: 'Cash Position',
      value: '£28.1k',
      trend: '5.4 months runway',
      detail:
        'The cash position is healthy enough for calm decision-making, provided receivables convert on time.'
    },
    {
      key: 'invoices',
      label: 'Outstanding Invoices',
      value: '£9.4k',
      trend: '4 overdue invoices',
      detail:
        'A concentrated overdue balance is slowing otherwise healthy cash timing. This is one of the highest-leverage fixes available.'
    },
    {
      key: 'bills',
      label: 'Bills To Pay',
      value: '£6.1k',
      trend: '7 due within 10 days',
      detail:
        'Bills are manageable, but approval sequencing should follow cash timing rather than default habits.'
    },
    {
      key: 'vat',
      label: 'VAT Liability',
      value: '£4.8k',
      trend: 'Provisioned',
      detail:
        'The VAT estimate is covered in the current plan, though confidence still depends on purchase-side record quality.'
    },
    {
      key: 'forecast',
      label: 'Financial Forecast',
      value: '£49.5k',
      trend: 'Revenue next month',
      detail:
        'The forecast is constructive under current assumptions, but the real value comes from challenging those assumptions actively.'
    },
    {
      key: 'supplier',
      label: 'Largest Supplier Spend',
      value: '£8.7k',
      trend: '+22.6% YoY',
      detail:
        'One supplier line is now strategically meaningful. It deserves review before it becomes embedded as normal.'
    }
  ],
  charts: {
    revenueTrend: {
      type: 'line',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      values: [34.2, 37.1, 38.8, 41.0, 43.6, 44.2, 46.8],
      suffix: 'k'
    },
    monthlyProfit: {
      type: 'line',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      values: [8.4, 9.2, 10.1, 10.5, 11.1, 12.0, 11.6],
      suffix: 'k'
    },
    cashFlow: {
      type: 'line',
      labels: ['Now', '30d', '60d', '90d'],
      values: [28.1, 21.3, 24.0, 26.4],
      suffix: 'k'
    },
    expenseTrend: {
      type: 'line',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      values: [18.2, 19.1, 20.0, 21.0, 22.4, 23.1, 24.9],
      suffix: 'k'
    },
    expenseCategories: {
      type: 'doughnut',
      labels: ['Inventory', 'Support', 'Premises', 'Software', 'Travel'],
      values: [41, 19, 17, 13, 10],
      suffix: '%'
    },
    supplierTrend: {
      type: 'line',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      values: [5.4, 5.1, 5.9, 6.3, 7.0, 8.0, 8.7],
      suffix: 'k'
    },
    supplierSpend: {
      type: 'bar',
      labels: ['Foresight', 'Titleist', 'Trackman', 'Consumables'],
      values: [8.7, 5.2, 3.8, 2.4],
      suffix: 'k'
    },
    vatHistory: {
      type: 'bar',
      labels: ['Q4', 'Q1', 'Q2', 'Q3 est'],
      values: [3.8, 4.2, 4.4, 4.8],
      suffix: 'k'
    },
    financialForecast: {
      type: 'line',
      labels: ['Base', 'Conservative', 'Upside'],
      values: [12.1, 10.6, 13.8],
      suffix: 'k'
    },
    kpiGauge: {
      type: 'doughnut',
      labels: ['Health', 'Gap'],
      values: [84, 16],
      suffix: ''
    },
    paymentMethods: {
      type: 'bar',
      labels: ['Card', 'Transfer', 'Finance', 'Cash'],
      values: [54, 24, 17, 5],
      suffix: '%'
    },
    invoiceStatus: {
      type: 'bar',
      labels: ['Paid', 'Pending', 'Overdue'],
      values: [72, 18, 10],
      suffix: '%'
    },
    historicalScores: {
      type: 'line',
      labels: ['Q4', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      values: [76, 77, 78, 79, 80, 81, 82, 84],
      suffix: ''
    }
  },
  forecasts: {
    revenue: '£49.5k',
    profit: '£12.1k',
    cash: '£24.0k',
    scenarios: [
      {
        title: 'What if collections slip by 14 days?',
        body: '30-day closing cash tightens materially, increasing the importance of staged outgoing approvals.'
      },
      {
        title: 'What if supplier costs rise another 5%?',
        body: 'Profit softens and pushes margin discipline from important to urgent.'
      },
      {
        title: 'What if bookings outperform by 10%?',
        body: 'Revenue improves, but the strategic test remains whether margin and cash quality rise with it.'
      }
    ]
  },
  approvals: {
    Accounting: [
      {
        title: 'Approve supplier payment batch',
        why: 'Three invoices fall due this week including fitting bay consumables.',
        impact: 'Preserves supplier continuity but reduces near-term cash headroom.',
        risk: 'Low–Medium',
        confidence: 'High'
      }
    ],
    Invoices: [
      {
        title: 'Approve overdue invoice escalation plan',
        why: 'Passive reminders are no longer enough for the overdue balance.',
        impact: 'Likely positive cash acceleration with minimal operational downside.',
        risk: 'Low',
        confidence: 'High'
      }
    ],
    Bills: [
      {
        title: 'Approve staged bill sequencing review',
        why: 'Some bills can be timed more intelligently against confirmed receipts.',
        impact: 'Improves cash timing while maintaining good supplier relationships.',
        risk: 'Medium',
        confidence: 'Medium'
      }
    ],
    Categorisation: [
      {
        title: 'Approve contractor spend reclassification',
        why: 'Current coding obscures whether spend is growth support or overhead.',
        impact: 'Improves forecast clarity and cost-centre understanding.',
        risk: 'Low',
        confidence: 'Medium'
      }
    ],
    Recommendations: [
      {
        title: 'Approve supplier negotiation proposal',
        why: 'One supplier line is growing faster than gross profit comfort allows.',
        impact: 'Potential £1.2k monthly margin improvement.',
        risk: 'Medium',
        confidence: 'Medium'
      }
    ],
    'Forecast assumptions': [
      {
        title: 'Approve conservative Q3 growth assumption',
        why: 'The current plan assumes healthy demand but tighter margin conversion.',
        impact: 'Creates a more prudent planning baseline.',
        risk: 'Low',
        confidence: 'Medium–High'
      }
    ]
  },
  suppliers: [
    {
      id: 'foresight-sports',
      name: 'Foresight Sports',
      spendMonth: '£8.7k',
      spendYtd: '£41.2k',
      spendLastYear: '£33.6k',
      yoy: '+22.6%',
      avgInvoice: '£2.2k',
      invoices: '4',
      lastPayment: '2026-07-01',
      category: 'Launch Monitors',
      risk: 'Medium',
      opportunity: 'Review terms, bundle strategy, and margin recovery potential.'
    },
    {
      id: 'titleist-trade',
      name: 'Titleist Trade',
      spendMonth: '£5.2k',
      spendYtd: '£28.7k',
      spendLastYear: '£25.4k',
      yoy: '+13.0%',
      avgInvoice: '£1.3k',
      invoices: '8',
      lastPayment: '2026-06-27',
      category: 'Retail Stock',
      risk: 'Low',
      opportunity: 'Improve premium mix and check stock turn contribution.'
    },
    {
      id: 'trackman-services',
      name: 'Trackman Services',
      spendMonth: '£3.8k',
      spendYtd: '£19.9k',
      spendLastYear: '£16.1k',
      yoy: '+23.6%',
      avgInvoice: '£1.9k',
      invoices: '3',
      lastPayment: '2026-06-18',
      category: 'Subscriptions & Support',
      risk: 'Medium',
      opportunity: 'Check usage and contract alignment versus operating value.'
    }
  ],
  risks: [
    {
      level: 'High',
      impact: '£6k–£8k cash timing pressure',
      probability: 'Medium',
      mitigation: 'Escalate overdue follow-up and set explicit payment dates.',
      owner: 'CFO',
      reviewDate: 'This week',
      trend: 'Worsening',
      commentary: 'Receivables concentration is the biggest near-term risk to flexibility.'
    },
    {
      level: 'Medium',
      impact: '£1k–£2k monthly margin erosion',
      probability: 'Medium',
      mitigation: 'Review contribution margin by supplier and category.',
      owner: 'CFO / COO',
      reviewDate: 'Next Sunday',
      trend: 'Stable',
      commentary: 'Supplier cost inflation is not dangerous yet, but it is strategically meaningful.'
    },
    {
      level: 'Medium',
      impact: 'Forecast confidence reduction',
      probability: 'Low–Medium',
      mitigation: 'Improve VAT and invoice coding discipline.',
      owner: 'Finance Ops',
      reviewDate: 'Month end',
      trend: 'Improving',
      commentary: 'Data quality is good enough for direction, but not perfect enough to ignore.'
    }
  ],
  opportunities: [
    {
      title: 'Speed up receivables follow-up cadence',
      description: 'A tighter collections rhythm is likely to pull forward £6.0k–£8.0k in cash without cutting growth activity.',
      revenueIncrease: '—',
      profitIncrease: '—',
      cost: 'Low',
      roi: 'High',
      timeToImplement: '1 week',
      confidence: 'High',
      strategicPriority: 'Immediate',
      status: 'Ready for approval',
      reviewDate: 'Friday',
      category: 'Cash Flow'
    },
    {
      title: 'Renegotiate a high-cost supplier relationship',
      description: 'The largest supplier line suggests room for pricing or payment-term improvement.',
      revenueIncrease: '—',
      profitIncrease: '£1.2k/month',
      cost: 'Low',
      roi: 'Medium–High',
      timeToImplement: '2–4 weeks',
      confidence: 'Medium',
      strategicPriority: 'High',
      status: 'Under review',
      reviewDate: 'Next Monday',
      category: 'Profit'
    },
    {
      title: 'Reduce low-yield discretionary operating spend',
      description: 'Travel and ad hoc support costs appear to be rising faster than their obvious commercial return.',
      revenueIncrease: '—',
      profitIncrease: '£900/month',
      cost: 'None',
      roi: 'High',
      timeToImplement: '2 weeks',
      confidence: 'Medium',
      strategicPriority: 'High',
      status: 'Requires decision',
      reviewDate: 'Wednesday',
      category: 'Cost Saving'
    }
  ],
  commentary: {
    workspace: {
      title: 'AI Executive Commentary',
      summary: 'The business is healthy, but the smartest decisions this week are about protecting flexibility rather than chasing more motion.',
      evidence: 'Revenue +8.4%, profit -3.1%, cash runway 5.4 months, supplier concentration elevated, overdue invoices still meaningful.',
      confidence: 'High',
      impact: 'Faster collections and better supplier discipline could improve both margin quality and short-term optionality.',
      risks: 'If the business focuses only on top-line confidence, it may underreact to soft margin compression.',
      alternatives: 'Push for more volume, hold the line temporarily, or slow selective spending while protecting high-return activity.',
      action: 'Approve collections escalation, review top supplier terms, and keep discretionary operating spend tightly controlled.',
      missing: 'Live bank, invoice, and booking integrations are intentionally deferred.',
      followUp: ['What if collections slip another 14 days?', 'Which supplier is actually hurting margin most?', 'Can we fund another investment this month?']
    },
    revenue: {
      title: 'Revenue Commentary',
      summary: 'Revenue is encouraging, but quality still matters more than volume alone.',
      evidence: 'Monthly revenue ahead of plan, premium conversion up, and year-on-year growth healthy in placeholder data.',
      confidence: 'High',
      impact: 'Stronger revenue supports strategic freedom only if it improves profit and cash conversion too.',
      risks: 'Revenue strength could mask collection weakness or margin softness.',
      alternatives: 'Lean into volume, protect premium mix, or prioritise higher-conversion demand only.',
      action: 'Track revenue alongside invoice status and gross margin, not as a standalone success number.',
      missing: 'Bookings Dashboard integration is not connected yet.',
      followUp: ['Is the revenue mix improving margin?', 'How much is still uncollected?', 'What does next month look like?']
    },
    profit: {
      title: 'Profit Commentary',
      summary: 'Profit remains solid, but cost pressure is reducing how much strategic confidence revenue growth should create.',
      evidence: 'Net profit down 3.1% month on month while supplier and support costs rose faster than ideal.',
      confidence: 'High',
      impact: 'If margin softness continues for another cycle, the business will feel richer than it actually is.',
      risks: 'Top-line celebration could delay necessary cost or supplier action.',
      alternatives: 'Absorb pressure temporarily, renegotiate upstream, or reduce lower-value spend.',
      action: 'Protect gross margin first, then challenge discretionary and supplier-heavy lines.',
      missing: 'Live invoice-level and supplier-level profitability data is not connected yet.',
      followUp: ['Which cost centre moved most?', 'Can margin recover without cutting growth?', 'Where is the easiest profit gain?']
    },
    expenses: {
      title: 'Expense Commentary',
      summary: 'Expense growth is manageable, but several variable lines are becoming habits rather than choices.',
      evidence: 'Monthly expenses +6.8% with visible contractor, travel, and support drift.',
      confidence: 'Medium–High',
      impact: 'Early action could protect roughly £900+ monthly without impairing performance.',
      risks: 'Overreacting can cut useful capability; underreacting can normalise waste.',
      alternatives: 'Freeze discretionary spend, reclassify first, or selectively trim low-yield lines.',
      action: 'Review variable costs one by one and preserve only those with clear operating or commercial return.',
      missing: 'Live expense categorisation feeds remain intentionally offline.',
      followUp: ['What spend is strategic?', 'What is just drift?', 'What would I cut last?']
    },
    suppliers: {
      title: 'Supplier Commentary',
      summary: 'Supplier spend is not yet dangerous, but it has become strategically important enough to justify explicit executive attention.',
      evidence: 'Top supplier +22.6% YoY, overall supplier costs rising faster than comfort allows, profit slightly softer.',
      confidence: 'Medium–High',
      impact: 'Improved terms or more disciplined buying could meaningfully lift margin and cash timing.',
      risks: 'Challenging suppliers without understanding dependency may reduce service quality or availability.',
      alternatives: 'Renegotiate, consolidate, reduce order frequency, or accept current terms temporarily.',
      action: 'Review the top three supplier relationships individually and decide which ones warrant negotiation now.',
      missing: 'Contract-level and inventory-linked supplier intelligence is not connected yet.',
      followUp: ['Which supplier matters most?', 'Where is pricing leverage strongest?', 'Can we improve payment timing?']
    },
    cash: {
      title: 'Cash Flow Commentary',
      summary: 'Cash is strong enough to support calm decisions, but timing discipline still matters more than the headline balance alone.',
      evidence: 'Current cash £28.1k, 30-day close £21.3k, overdue invoices materially affecting flexibility.',
      confidence: 'High',
      impact: 'Collections improvement could increase decision freedom immediately without reducing growth activity.',
      risks: 'Supplier and tax timing could narrow the comfort zone faster than expected if receipts slip again.',
      alternatives: 'Hold spend steady, escalate collections, or stage outgoing commitments more conservatively.',
      action: 'Protect incoming timing first, then align outgoing approvals against confirmed receipts.',
      missing: 'Live banking feeds and settlement-level inflow data are not connected yet.',
      followUp: ['What weakens the 30-day view most?', 'Can we fund a new investment?', 'What approvals should wait?']
    },
    vat: {
      title: 'VAT Commentary',
      summary: 'The VAT estimate appears manageable, but process confidence matters as much as the number itself.',
      evidence: 'Current estimate provisioned, with historical range broadly stable but still dependent on record completeness.',
      confidence: 'Medium',
      impact: 'Good VAT discipline improves planning confidence and reduces avoidable surprises.',
      risks: 'Late or misclassified purchase records reduce the reliability of both VAT and cash planning.',
      alternatives: 'Increase monthly controls, retain current pace, or defer clean-up until submission week.',
      action: 'Tighten purchase-side record discipline ahead of the next cycle.',
      missing: 'No live bookkeeping integration is connected in this sprint.',
      followUp: ['How sensitive is the estimate?', 'What if invoices arrive late?', 'How much buffer do we need?']
    },
    forecasting: {
      title: 'Forecast Commentary',
      summary: 'The forecast is helpful because it frames choices, not because it predicts the future perfectly.',
      evidence: 'Positive revenue outlook, stable cash view, and scenario planning anchored on margin and collections assumptions.',
      confidence: 'Medium',
      impact: 'Better assumption discipline improves investment timing and approval quality.',
      risks: 'False precision can make the team less curious about what could go wrong.',
      alternatives: 'Use optimistic, conservative, or scenario-weighted planning.',
      action: 'Challenge the handful of assumptions that move the forecast most.',
      missing: 'Live pipeline, banking, and bookkeeping feeds are intentionally absent.',
      followUp: ['What breaks the plan first?', 'What improves it most?', 'What investment is safest?']
    }
  },
  decisionJournal: [
    {
      id: 'DJ-017',
      date: '2026-07-03',
      executive: 'CFO',
      recommendation: 'Escalate overdue receivable follow-up on four concentrated invoices.',
      reasoning: 'Cash flexibility is being constrained by a small number of slow-paying balances.',
      evidence: '£9.4k outstanding, four overdue invoices, 30-day cash forecast depends on collections.',
      alternatives: 'Wait another week, or stage payables more conservatively instead.',
      decision: 'Pending approval',
      outcome: 'Awaiting decision',
      impact: 'Potential £6k–£8k cash acceleration',
      confidence: 'High',
      lessons: 'Collections cadence should tighten before balances become concentrated.',
      reviewDate: '2026-07-10',
      status: 'Pending'
    },
    {
      id: 'DJ-016',
      date: '2026-06-29',
      executive: 'CFO',
      recommendation: 'Review one major supplier relationship for margin protection.',
      reasoning: 'Supplier spend has risen faster than gross profit contribution.',
      evidence: 'Largest supplier up +22.6% YoY, margin softening 3.1% MoM.',
      alternatives: 'Absorb the cost, pass through selectively, or reduce order volume.',
      decision: 'Approved',
      outcome: 'Negotiation prep underway',
      impact: 'Estimated £1.2k monthly margin upside',
      confidence: 'Medium',
      lessons: 'Supplier concentration should be reviewed before it becomes embedded.',
      reviewDate: '2026-07-21',
      status: 'Active'
    },
    {
      id: 'DJ-015',
      date: '2026-06-18',
      executive: 'CFO',
      recommendation: 'Hold discretionary support costs flat for one cycle.',
      reasoning: 'Contractor and support spend drifted above the planned baseline.',
      evidence: 'Expense trend up 6.8% with unclear operating return on part of spend.',
      alternatives: 'Immediate reduction, continue unchanged, or reclassify first.',
      decision: 'Approved',
      outcome: 'Expense drift stabilised',
      impact: 'Avoided roughly £900 monthly cost escalation',
      confidence: 'Medium',
      lessons: 'Small discretionary lines need explicit ownership before they compound.',
      reviewDate: '2026-08-01',
      status: 'Reviewed'
    }
  ],
  weeklyBriefing: {
    summary:
      'EP Golf Studios enters the week from a position of financial strength, but margin quality and collections speed remain the most important control levers for protecting strategic flexibility.',
    wins: [
      'Revenue remains ahead of the recent baseline.',
      'Cash headroom is healthy enough to avoid reactive decisions.',
      'Expense drift is visible early, which means it can still be managed calmly.'
    ],
    risks: [
      'Receivables timing remains too concentrated.',
      'Supplier spend is growing faster than comfort allows.',
      'Forecast confidence still depends on better categorisation discipline.'
    ],
    recommendations: [
      'Approve overdue receivables escalation plan.',
      'Pressure-test the biggest supplier line before the next purchasing cycle.',
      'Hold discretionary operating spend steady until profit quality improves.'
    ],
    questions: [
      'Which current spend lines are genuinely strategic versus merely habitual?',
      'If growth remains strong but margin weakens, what should be slowed first?',
      'What assumptions in the 30/60/90 day cash view need the closest challenge?'
    ]
  },
  kpis: {
    groups: [
      ['Revenue', [['Revenue this month', '£46.8k'], ['YoY growth', '+14.2%'], ['Revenue forecast', '£49.5k']]],
      ['Profitability', [['Gross margin', '51.5%'], ['Net margin', '24.8%'], ['Net profit', '£11.6k']]],
      ['Cash', [['Cash balance', '£28.1k'], ['Runway', '5.4 months'], ['30d close', '£21.3k']]],
      ['Working Capital', [['Outstanding invoices', '£9.4k'], ['Bills due', '£6.1k'], ['Collections risk', 'Medium']]],
      ['Operating KPIs', [['Supplier concentration', 'Elevated'], ['Expense drift', '+6.8%'], ['Approvals active', '6']]],
      ['Growth KPIs', [['Bookings confidence', 'Placeholder'], ['Premium mix', 'Improving'], ['Repeat demand', 'Stable']]]
    ],
    weights: [
      { title: 'Profit quality', weight: '25%', note: 'Margin strength and conversion quality.' },
      { title: 'Cash resilience', weight: '25%', note: 'Liquidity and timing confidence.' },
      { title: 'Working capital control', weight: '20%', note: 'Receivables, payables, and operational discipline.' },
      { title: 'Growth quality', weight: '15%', note: 'Growth that supports long-term health.' },
      { title: 'Governance confidence', weight: '15%', note: 'Approval-first control and reasoning transparency.' }
    ]
  },
  integrations: [
    'QuickBooks',
    'Starling',
    'CMO Workspace',
    'COO Workspace',
    'CEO Workspace',
    'Bookings Dashboard',
    'CRM',
    'Inventory',
    'HR',
    'Payroll',
    'Google Analytics',
    'Gmail',
    'Calendar',
    'Customer Portal'
  ],
  settingsPlaceholders: [
    'Permissions',
    'Notification preferences',
    'Health score weighting',
    'Weekly briefing preferences',
    'Quarterly reviews',
    'Historical database',
    'Executive personas'
  ],
  shortcuts: [
    { keys: 'Ctrl/Cmd + K', action: 'Open command palette' },
    { keys: '/', action: 'Focus page search' },
    { keys: 'B', action: 'Toggle Board Meeting mode' },
    { keys: 'W', action: 'Return to Workspace mode' },
    { keys: 'Esc', action: 'Close overlays and command palette' }
  ]
};
