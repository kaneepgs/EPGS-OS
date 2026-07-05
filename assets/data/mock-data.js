export const TOP_LEVEL_NAV = [
  ['/ceo', 'CEO Dashboard', 'home'],
  ['/cfo', 'CFO', 'coins'],
  ['/cmo', 'CMO', 'sparkles'],
  ['/coo', 'COO', 'building'],
  ['/sales', 'Sales', 'trending-up'],
  ['/customer-success', 'Customer Success', 'pulse'],
  ['/operations', 'Operations', 'grid'],
  ['/hr', 'HR', 'book-open'],
  ['/projects', 'Projects', 'target'],
  ['/ai-assistant', 'AI Assistant', 'sparkles'],
  ['/approvals', 'Approvals', 'check-circle'],
  ['/reports', 'Reports', 'presentation'],
  ['/settings', 'Settings', 'settings']
];

export const SUBNAV = {
  cfo: [
    ['/cfo', 'Workspace'],
    ['/cfo/revenue', 'Revenue'],
    ['/cfo/profit', 'Profit'],
    ['/cfo/expenses', 'Expenses'],
    ['/cfo/supplier-spend', 'Supplier Spend'],
    ['/cfo/cash-flow', 'Cash Flow'],
    ['/cfo/vat', 'VAT'],
    ['/cfo/forecasting', 'Forecasting'],
    ['/cfo/business-kpis', 'Business KPIs'],
    ['/cfo/decision-journal', 'Decision Journal'],
    ['/cfo/financial-health', 'Financial Health Score'],
    ['/cfo/opportunity-register', 'Opportunity Register'],
    ['/cfo/risk-register', 'Risk Register']
  ],
  reports: [
    ['/reports', 'Overview'],
    ['/reports/weekly-briefings', 'Weekly Briefings'],
    ['/reports/monthly-reports', 'Monthly Reports'],
    ['/reports/quarterly-reviews', 'Quarterly Reviews'],
    ['/reports/board-meeting', 'Board Meeting Mode'],
    ['/reports/cfo-reports', 'CFO Reports'],
    ['/reports/cmo-reports', 'CMO Reports'],
    ['/reports/ceo-reports', 'CEO Reports']
  ],
  aiAssistant: [
    ['/ai-assistant', 'Overview'],
    ['/ai-assistant/ask', 'Ask EP Intelligence'],
    ['/ai-assistant/executive-briefing', 'Executive Briefing'],
    ['/ai-assistant/follow-up-questions', 'Follow-up Questions'],
    ['/ai-assistant/suggested-actions', 'Suggested Actions'],
    ['/ai-assistant/assumptions', 'Assumptions'],
    ['/ai-assistant/missing-information', 'Missing Information'],
    ['/ai-assistant/memory-context', 'AI Memory / Context']
  ]
};

export const MODE_OPTIONS = [
  ['executive', 'Executive View', '/ceo'],
  ['board', 'Board View', '/reports/board-meeting']
];

export const ROUTE_META = {
  '/ceo': { title: 'CEO Dashboard', subtitle: 'The executive home view for the whole business.', module: 'CEO Dashboard', sidebarKey: '/ceo', parentLabel: 'CEO Dashboard' },
  '/cfo': { title: 'CFO Workspace', subtitle: 'A complete finance module inside the wider EP Intelligence shell.', module: 'CFO', sidebarKey: '/cfo', parentLabel: 'CFO' },
  '/cfo/revenue': { title: 'Revenue', subtitle: 'Demand quality, collections, mix, and forecast confidence.', module: 'CFO', sidebarKey: '/cfo', parentLabel: 'CFO' },
  '/cfo/profit': { title: 'Profit', subtitle: 'Margin strength, cost pressure, and profitability action.', module: 'CFO', sidebarKey: '/cfo', parentLabel: 'CFO' },
  '/cfo/expenses': { title: 'Expenses', subtitle: 'Operating cost discipline with strategic context.', module: 'CFO', sidebarKey: '/cfo', parentLabel: 'CFO' },
  '/cfo/supplier-spend': { title: 'Supplier Spend', subtitle: 'Supplier concentration, opportunities, and risk.', module: 'CFO', sidebarKey: '/cfo', parentLabel: 'CFO' },
  '/cfo/cash-flow': { title: 'Cash Flow', subtitle: 'Liquidity strength, forecast confidence, and runway.', module: 'CFO', sidebarKey: '/cfo', parentLabel: 'CFO' },
  '/cfo/vat': { title: 'VAT', subtitle: 'VAT position, forecast, and submission-readiness confidence.', module: 'CFO', sidebarKey: '/cfo', parentLabel: 'CFO' },
  '/cfo/forecasting': { title: 'Forecasting', subtitle: 'Executive scenarios, assumption testing, and investment thinking.', module: 'CFO', sidebarKey: '/cfo', parentLabel: 'CFO' },
  '/cfo/business-kpis': { title: 'Business KPIs', subtitle: 'A contextual KPI layer with score transparency.', module: 'CFO', sidebarKey: '/cfo', parentLabel: 'CFO' },
  '/cfo/decision-journal': { title: 'Decision Journal', subtitle: 'Searchable timeline of recommendations and outcomes.', module: 'CFO', sidebarKey: '/cfo', parentLabel: 'CFO' },
  '/cfo/financial-health': { title: 'Financial Health Score', subtitle: 'Weighted score breakdown, movement, and recommendations.', module: 'CFO', sidebarKey: '/cfo', parentLabel: 'CFO' },
  '/cfo/opportunity-register': { title: 'Opportunity Register', subtitle: 'Permanent register of opportunities worth executive attention.', module: 'CFO', sidebarKey: '/cfo', parentLabel: 'CFO' },
  '/cfo/risk-register': { title: 'Risk Register', subtitle: 'Living register of business risk, mitigation, and ownership.', module: 'CFO', sidebarKey: '/cfo', parentLabel: 'CFO' },
  '/cmo': { title: 'CMO Module', subtitle: 'Future marketing intelligence, campaign performance, and brand momentum.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/coo': { title: 'COO Module', subtitle: 'Future operating execution, delivery capacity, and process performance.', module: 'COO', sidebarKey: '/coo', parentLabel: 'COO' },
  '/sales': { title: 'Sales Module', subtitle: 'Future pipeline, conversion, and commercial performance intelligence.', module: 'Sales', sidebarKey: '/sales', parentLabel: 'Sales' },
  '/customer-success': { title: 'Customer Success Module', subtitle: 'Future retention, experience, and customer health intelligence.', module: 'Customer Success', sidebarKey: '/customer-success', parentLabel: 'Customer Success' },
  '/operations': { title: 'Operations Module', subtitle: 'Future workflow, fulfilment, and service delivery intelligence.', module: 'Operations', sidebarKey: '/operations', parentLabel: 'Operations' },
  '/hr': { title: 'HR Module', subtitle: 'Future staffing, capability, and people operations intelligence.', module: 'HR', sidebarKey: '/hr', parentLabel: 'HR' },
  '/projects': { title: 'Projects Module', subtitle: 'Future roadmap, ownership, and execution tracking.', module: 'Projects', sidebarKey: '/projects', parentLabel: 'Projects' },
  '/ai-assistant': { title: 'AI Assistant', subtitle: 'The executive AI layer for questions, reasoning, assumptions, and follow-up.', module: 'AI Assistant', sidebarKey: '/ai-assistant', parentLabel: 'AI Assistant' },
  '/ai-assistant/ask': { title: 'Ask EP Intelligence', subtitle: 'A placeholder for natural-language executive querying.', module: 'AI Assistant', sidebarKey: '/ai-assistant', parentLabel: 'AI Assistant' },
  '/ai-assistant/executive-briefing': { title: 'Executive Briefing', subtitle: 'A placeholder for AI-compiled leadership briefings.', module: 'AI Assistant', sidebarKey: '/ai-assistant', parentLabel: 'AI Assistant' },
  '/ai-assistant/follow-up-questions': { title: 'Follow-up Questions', subtitle: 'A placeholder for deeper AI-led executive questioning.', module: 'AI Assistant', sidebarKey: '/ai-assistant', parentLabel: 'AI Assistant' },
  '/ai-assistant/suggested-actions': { title: 'Suggested Actions', subtitle: 'A placeholder for staged AI recommendations awaiting approval.', module: 'AI Assistant', sidebarKey: '/ai-assistant', parentLabel: 'AI Assistant' },
  '/ai-assistant/assumptions': { title: 'Assumptions', subtitle: 'A placeholder for the assumptions driving AI output.', module: 'AI Assistant', sidebarKey: '/ai-assistant', parentLabel: 'AI Assistant' },
  '/ai-assistant/missing-information': { title: 'Missing Information', subtitle: 'A placeholder for gaps the AI layer needs surfaced clearly.', module: 'AI Assistant', sidebarKey: '/ai-assistant', parentLabel: 'AI Assistant' },
  '/ai-assistant/memory-context': { title: 'AI Memory / Context', subtitle: 'A placeholder for how EP Intelligence will hold executive context.', module: 'AI Assistant', sidebarKey: '/ai-assistant', parentLabel: 'AI Assistant' },
  '/approvals': { title: 'Approvals', subtitle: 'A central, business-wide approval centre spanning functions.', module: 'Approvals', sidebarKey: '/approvals', parentLabel: 'Approvals' },
  '/reports': { title: 'Reports', subtitle: 'Weekly, monthly, quarterly, and board-ready reporting outputs.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/weekly-briefings': { title: 'Weekly Briefings', subtitle: 'Board-style Sunday briefing experience.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/monthly-reports': { title: 'Monthly Reports', subtitle: 'A placeholder monthly leadership report surface.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/quarterly-reviews': { title: 'Quarterly Reviews', subtitle: 'Prepared board paper for the quarter just gone.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/board-meeting': { title: 'Board Meeting Mode', subtitle: 'A clean board-oriented view for leadership discussions.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/cfo-reports': { title: 'CFO Reports', subtitle: 'A placeholder hub for finance-specific reports.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/cmo-reports': { title: 'CMO Reports', subtitle: 'A placeholder hub for marketing-specific reports.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/ceo-reports': { title: 'CEO Reports', subtitle: 'A placeholder hub for CEO-level reports and summaries.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/settings': { title: 'Settings', subtitle: 'Prototype controls for shell behaviour, preferences, and future integrations.', module: 'Settings', sidebarKey: '/settings', parentLabel: 'Settings' }
};

export const QUESTION_SETS = {
  '/ceo': {
    what: ['The business is broadly healthy', 'Health, cash, demand, and operating momentum are positive overall, with a few clear watchpoints.'],
    why: ['Growth and control are holding together', 'The business is benefiting from healthy demand while still keeping enough discipline around risk and approvals.'],
    matters: ['Yes — because leadership attention should stay selective', 'The goal is not to react to everything, but to focus on the small number of decisions that meaningfully shape outcomes.'],
    next: ['Review priorities, risks, and approvals', 'The right next step is to move from summary to action in the areas with the highest leverage.']
  },
  '/cfo': {
    what: ['Revenue is healthy, profit is slightly tighter', 'The business is growing, but the quality of that growth matters more than volume alone.'],
    why: ['Supplier and support costs rose faster than ideal', 'Supplier concentration and expense drift have moderated how much confidence top-line growth should create.'],
    matters: ['Yes — it affects flexibility', 'The business remains strong, but weaker margin conversion reduces room for casual decisions.'],
    next: ['Prioritise collections and margin control', 'The best next decisions are around receivables, supplier discipline, and selective spend restraint.']
  },
  '/cfo/revenue': {
    what: ['Revenue is trending up', 'Revenue is ahead of both recent months and the placeholder prior-year baseline.'],
    why: ['Demand and conversion improved', 'Fitting demand appears stronger and premium conversion is supporting basket quality.'],
    matters: ['Yes, if margin quality holds', 'Top-line growth only matters strategically if it improves profit and cash rather than hiding cost inflation.'],
    next: ['Track mix and booking quality', 'Compare revenue growth against gross margin, collections, and future bookings confidence.']
  },
  '/cfo/profit': {
    what: ['Profit softened slightly', 'Top-line growth has not fully translated into stronger net output this month.'],
    why: ['Costs rose faster than ideal', 'Supplier, fulfilment, and discretionary operating costs compressed the gain.'],
    matters: ['Yes, because it changes confidence', 'Good revenue can still leave less room for investment if margin quality weakens.'],
    next: ['Defend margin quality', 'Review cost centres, supplier leverage, and discretionary spend before approving new commitments.']
  },
  '/cfo/expenses': {
    what: ['Expenses are trending upward', 'Spend remains controllable, but variable lines are rising faster than the original baseline.'],
    why: ['Activity and support costs expanded', 'Contractor, travel, and supplier-related spend rose alongside commercial activity.'],
    matters: ['Yes, because profit conversion depends on it', 'Expenses only become strategic when they outpace the return created by revenue growth.'],
    next: ['Separate strategic spend from drift', 'Keep valuable spend, but remove lines that lack a clear return or owner.']
  },
  '/cfo/supplier-spend': {
    what: ['Supplier spend is rising and concentrated', 'A small number of suppliers now account for a meaningful share of cash outflow and margin pressure.'],
    why: ['Growth and inventory choices lifted exposure', 'The current pattern may be rational, but it has not all been pressure-tested recently.'],
    matters: ['Yes, because supplier leverage shapes margin and cash', 'The issue is not just cost — it is dependency, timing, and bargaining power.'],
    next: ['Review top suppliers one by one', 'Decide where terms, volumes, or payment timing should be challenged rather than inherited.']
  },
  '/cfo/cash-flow': {
    what: ['Cash is healthy but timing matters', 'There is no immediate liquidity stress, but short-term flexibility still depends on planned receipts landing.'],
    why: ['Receivables concentration remains a factor', 'Strong inflows are offset by a handful of overdue balances and planned outgoing supplier payments.'],
    matters: ['Yes, because timing changes decision freedom', 'Healthy cash without good timing discipline can still force weaker decisions than necessary.'],
    next: ['Protect timing and challenge assumptions', 'Pressure-test receivables, staged payables, and forecast assumptions for the next 90 days.']
  },
  '/cfo/vat': {
    what: ['VAT looks provisioned', 'The estimate is not alarming and appears covered in the short-term plan.'],
    why: ['Trading remains healthy and the liability is stable', 'The forecast moves mainly with revenue and purchase record completeness.'],
    matters: ['Yes, because confidence matters as much as the amount', 'A manageable liability can still become disruptive if record quality slips.'],
    next: ['Tighten record capture confidence', 'Keep purchase-side discipline high ahead of the next filing cycle.']
  },
  '/cfo/forecasting': {
    what: ['Forecasts are positive but assumption-sensitive', 'The current outlook is constructive under a controlled set of placeholder assumptions.'],
    why: ['Demand is stable and cash is healthy', 'A small number of assumptions still drive most of the model: collections speed, supplier costs, and discretionary expense control.'],
    matters: ['Yes, because forecast quality shapes confidence', 'The right forecast improves timing, investment discipline, and approval quality.'],
    next: ['Challenge assumptions, not just outputs', 'The best use of the page is to test what could break the plan and what could improve it.']
  },
  '/cfo/business-kpis': {
    what: ['KPIs are broadly healthy', 'Core revenue, profit, and cash KPIs support confidence, with working-capital watchpoints still visible.'],
    why: ['Growth stayed positive and governance stayed tight', 'The score is rising because cash resilience and growth quality improved while controls remained strong.'],
    matters: ['Yes, because KPIs shape the health score', 'The KPI layer helps explain the business in aggregate before leadership goes deeper.'],
    next: ['Use KPIs to guide deeper reviews', 'Follow the KPI signals into supplier, cash-flow, and approval pages rather than stopping at the surface.']
  },
  '/cfo/decision-journal': {
    what: ['Recommendations are becoming a reusable knowledge base', 'The journal shows what was recommended, what was decided, and what happened next.'],
    why: ['The platform is built to learn from decisions', 'Executive quality improves when outcomes and lessons are preserved, not forgotten.'],
    matters: ['Yes, because memory compounds quality', 'The Decision Journal becomes one of the most valuable assets once it builds history.'],
    next: ['Review, search, and revisit decisions', 'Use the journal to question assumptions and surface recommendations worth revisiting.']
  },
  '/cfo/financial-health': {
    what: ['The score improved', 'The Financial Health Score rose because revenue resilience and cash stability improved.'],
    why: ['Cash and growth quality were the main contributors', 'Margin was slightly softer, but the broader balance still improved overall.'],
    matters: ['Yes, because the score helps orient leadership', 'The score is useful as a summary — provided the weighting and logic remain transparent.'],
    next: ['Treat the score as guidance, not an answer', 'Use the score to direct attention, then examine the pages beneath it.']
  },
  '/cfo/opportunity-register': {
    what: ['The register captures practical upside', 'Each opportunity is written as an executive decision rather than an abstract idea.'],
    why: ['The best opportunities sit between insight and timing', 'Clear structure helps leadership choose which upside matters now versus later.'],
    matters: ['Yes, because not all opportunities deserve the same attention', 'The register prevents good ideas from being lost or over-valued.'],
    next: ['Prioritise by ROI, timing, and confidence', 'Use the register to decide what deserves action, review, or deferment.']
  },
  '/cfo/risk-register': {
    what: ['The register captures the real business watchpoints', 'Risk is expressed in operational and financial terms rather than vague caution.'],
    why: ['Executive calm requires explicit ownership', 'A clear register prevents known risks from becoming recurring surprises.'],
    matters: ['Yes, because risk visibility improves decision quality', 'Known risk with a plan is different from unseen risk with false confidence.'],
    next: ['Review mitigation quality regularly', 'Treat the risk register as a living document rather than a one-time report.']
  },
  '/approvals': {
    what: ['Approvals are centralised across the business', 'Finance, marketing, sales, operations, and AI-generated actions now sit in one executive review surface.'],
    why: ['Approval-first governance protects quality', 'The operating system is designed to stage decisions before any future automation exists.'],
    matters: ['Yes, because governance quality is strategic', 'A single approval centre gives leadership one calm place to review decisions that matter.'],
    next: ['Prioritise high-impact approvals', 'Review the approvals most likely to affect cash, revenue quality, operations, or executive confidence.']
  },
  '/reports': {
    what: ['Reports are now grouped as a shared executive layer', 'Weekly, monthly, quarterly, and board-style outputs now sit outside any one module.'],
    why: ['Leadership reporting should be business-wide', 'The reports area makes it easier to separate live operating work from packaged executive outputs.'],
    matters: ['Yes, because reporting cadence shapes decision quality', 'A strong reporting layer gives the operating system rhythm and executive trust.'],
    next: ['Use report hubs and board views deliberately', 'Move between weekly briefings, quarterly reviews, and functional summaries based on the decision at hand.']
  },
  '/ai-assistant': {
    what: ['The AI layer now has its own dedicated home', 'Questions, briefings, assumptions, follow-up prompts, and memory all sit inside one assistant surface.'],
    why: ['Executive AI needs visibility and containment', 'Leaders should be able to see not only recommendations, but also the context and gaps behind them.'],
    matters: ['Yes, because trust depends on transparency', 'AI becomes more useful when it clearly exposes its assumptions, missing information, and suggested actions.'],
    next: ['Use the AI layer for framing, not automation', 'The next step is to shape how leadership will question, challenge, and approve AI output.']
  }
};

export const MOCK_DATA = {
  brand: {
    name: 'EP Intelligence',
    shell: 'Executive Operating System',
    description: 'A calm, premium executive operating system prototype for EP Golf Studios.'
  },
  ceo: {
    score: 86,
    previousScore: 83,
    trend: '+3 points vs last month',
    label: 'Healthy with selective watchpoints',
    summary: 'EP Golf Studios is trading from a position of strength. Leadership attention should stay focused on cash timing, margin discipline, a few open approvals, and keeping execution quality high across the business.',
    businessHealth: [
      { label: 'Revenue Snapshot', value: '£46.8k', body: 'Demand remains healthy and premium conversion is holding up.', icon: 'trending-up' },
      { label: 'Profit Snapshot', value: '£11.6k', body: 'Still strong overall, with margin pressure worth watching.', icon: 'coins' },
      { label: 'Cash Position', value: '£28.1k', body: 'Healthy enough for calm decision-making under current assumptions.', icon: 'wallet' },
      { label: 'Pending Approvals', value: '11', body: 'Open decisions now span finance, marketing, sales, and operations.', icon: 'check-circle' }
    ],
    todayPriorities: [
      { title: 'Protect short-term flexibility', note: 'Collections timing and staged outgoing approvals remain the highest-leverage executive decisions.', tone: 'warn' },
      { title: 'Review supplier and cost discipline', note: 'Margin quality matters more than celebrating top-line growth in isolation.', tone: 'risk' },
      { title: 'Keep cross-functional execution aligned', note: 'Projects, marketing, and customer experience all look positive, but leadership focus should stay selective.', tone: 'good' }
    ],
    snapshots: [
      { label: 'Marketing Snapshot', value: 'Reach growing', body: 'Brand momentum is positive, with campaign quality placeholders improving.', icon: 'sparkles' },
      { label: 'Sales Snapshot', value: 'Pipeline stable', body: 'Conversion quality looks healthy in the placeholder sales view.', icon: 'trending-up' },
      { label: 'Operations Snapshot', value: 'Delivery on track', body: 'Operational execution is calm, with a few process improvements identified.', icon: 'building' },
      { label: 'Customer Experience', value: 'Satisfaction strong', body: 'Retention and service quality remain positive in the mock environment.', icon: 'pulse' },
      { label: 'Staff / HR Snapshot', value: 'Capacity steady', body: 'The people view suggests manageable workload with leadership visibility still needed.', icon: 'book-open' },
      { label: 'Open Projects', value: '6 active', body: 'Projects are visible, but prioritisation remains an executive task.', icon: 'target' }
    ],
    risks: [
      'Receivables timing remains the clearest short-term pressure point.',
      'Supplier concentration could reduce margin quality if left unchallenged.',
      'A growing number of approvals can create drag if not reviewed decisively.'
    ],
    opportunities: [
      'Accelerate overdue cash collection without reducing growth activity.',
      'Use supplier and pricing discipline to improve margin quality.',
      'Tighten executive reporting rhythm around board and weekly briefing outputs.'
    ],
    approvalsPreview: [
      'Finance: staged supplier payment sequencing',
      'Marketing: premium-content campaign approval',
      'Sales: pricing exception review',
      'Operations: process improvement action approval'
    ],
    aiBriefing: {
      title: 'AI Executive Briefing',
      summary: 'The business is healthy overall. The smartest CEO actions today are to protect flexibility, keep execution aligned, and ensure approvals are not becoming passive bottlenecks.',
      evidence: 'Revenue and cash are healthy, customer and operational signals are positive, and most watchpoints are controllable rather than structural.',
      confidence: 'Medium–High',
      impact: 'Better prioritisation this week should improve decision speed without increasing risk.',
      risks: 'If leadership attention becomes too fragmented, the business may react to noise rather than leverage.',
      alternatives: 'Lean into growth, focus on control, or keep a balanced posture while reviewing approvals and risks closely.',
      action: 'Review priorities, clear the most important approvals, and use the reports area to drive the weekly leadership conversation.',
      missing: 'All signals remain mock/demo only. No live integrations are connected in this sprint.',
      followUp: ['What needs CEO attention first?', 'Which approvals are actually strategic?', 'What changed since last week?']
    },
    weeklySummaryPreview: {
      headline: 'Healthy week, with attention needed on cash timing and approval quality.',
      body: 'Leadership can remain calm, but the best next decisions are still around collections, supplier leverage, and keeping approvals from becoming passive queue items.'
    }
  },
  cfo: {
    welcome: {
      greeting: 'Good morning, Kane.',
      title: 'Your Chief Financial Officer is ready.',
      score: 84,
      previousScore: 81,
      trend: '+3 points vs last month',
      label: 'Stable with near-term control actions',
      summary: 'The business is financially healthy overall, but collections discipline and supplier cost control will decide how much freedom EP Golf Studios has over the next six weeks.',
      narrative: 'Revenue quality is good, profit is slightly compressed by supplier and support costs, and cash remains healthy if receivables are actively managed this week.',
      snapshot: {
        revenue: '£46.8k',
        profit: '£11.6k',
        cash: '£28.1k',
        approvals: '6 waiting'
      }
    },
    workspace: {
      banner: {
        title: 'Executive Summary',
        body: 'EP Golf Studios is trading from a position of strength, but the smartest decisions this week are around collections, margin discipline, and approval sequencing rather than new discretionary spend.'
      },
      priorities: [
        { title: 'Review overdue invoices', note: 'Receivables are the fastest path to stronger short-term flexibility.', tone: 'warn' },
        { title: 'Pressure-test supplier spend', note: 'Supplier concentration is now strategically important rather than just operationally relevant.', tone: 'risk' },
        { title: 'Protect discretionary spend discipline', note: 'Cash is healthy enough for calm decisions, but not for avoidable drift.', tone: 'good' }
      ],
      quickActions: ['Open Approvals', 'Review Supplier Spend', 'Generate Weekly Briefing', 'Ask why profit changed'],
      businessSnapshot: [
        'Demand remains healthy with premium conversion holding up.',
        'Net profit is slightly softer than last month because costs rose faster than revenue quality improved.',
        'Cash remains comfortable if collections stay disciplined.',
        'No automation is enabled; all material actions remain approval-first.'
      ]
    },
    metrics: [
      { key: 'revenue', label: 'Revenue Summary', value: '£46.8k', trend: '+8.4% vs last month', detail: 'Revenue is ahead of plan and appears to be driven by strong fitting demand and better accessory conversion. The CFO lens is now on quality and collectability, not just volume.' },
      { key: 'profit', label: 'Profit Summary', value: '£11.6k', trend: '-3.1% vs last month', detail: 'Profit remains strong, but softer than the month before because supplier and support costs grew faster than ideal.' },
      { key: 'cash', label: 'Cash Position', value: '£28.1k', trend: '5.4 months runway', detail: 'The cash position is healthy enough for calm decision-making, provided receivables convert on time.' },
      { key: 'invoices', label: 'Outstanding Invoices', value: '£9.4k', trend: '4 overdue invoices', detail: 'A concentrated overdue balance is slowing otherwise healthy cash timing. This is one of the highest-leverage fixes available.' },
      { key: 'bills', label: 'Bills To Pay', value: '£6.1k', trend: '7 due within 10 days', detail: 'Bills are manageable, but approval sequencing should follow cash timing rather than default habits.' },
      { key: 'vat', label: 'VAT Liability', value: '£4.8k', trend: 'Provisioned', detail: 'The VAT estimate is covered in the current plan, though confidence still depends on purchase-side record quality.' },
      { key: 'forecast', label: 'Financial Forecast', value: '£49.5k', trend: 'Revenue next month', detail: 'The forecast is constructive under current assumptions, but the real value comes from challenging those assumptions actively.' },
      { key: 'supplier', label: 'Largest Supplier Spend', value: '£8.7k', trend: '+22.6% YoY', detail: 'One supplier line is now strategically meaningful. It deserves review before it becomes embedded as normal.' }
    ],
    charts: {
      revenueTrend: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [34.2, 37.1, 38.8, 41.0, 43.6, 44.2, 46.8], suffix: 'k' },
      monthlyProfit: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [8.4, 9.2, 10.1, 10.5, 11.1, 12.0, 11.6], suffix: 'k' },
      cashFlow: { type: 'line', labels: ['Now', '30d', '60d', '90d'], values: [28.1, 21.3, 24.0, 26.4], suffix: 'k' },
      expenseTrend: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [18.2, 19.1, 20.0, 21.0, 22.4, 23.1, 24.9], suffix: 'k' },
      expenseCategories: { type: 'doughnut', labels: ['Inventory', 'Support', 'Premises', 'Software', 'Travel'], values: [41, 19, 17, 13, 10], suffix: '%' },
      supplierTrend: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [5.4, 5.1, 5.9, 6.3, 7.0, 8.0, 8.7], suffix: 'k' },
      supplierSpend: { type: 'bar', labels: ['Foresight', 'Titleist', 'Trackman', 'Consumables'], values: [8.7, 5.2, 3.8, 2.4], suffix: 'k' },
      vatHistory: { type: 'bar', labels: ['Q4', 'Q1', 'Q2', 'Q3 est'], values: [3.8, 4.2, 4.4, 4.8], suffix: 'k' },
      financialForecast: { type: 'line', labels: ['Base', 'Conservative', 'Upside'], values: [12.1, 10.6, 13.8], suffix: 'k' },
      kpiGauge: { type: 'doughnut', labels: ['Health', 'Gap'], values: [84, 16], suffix: '' },
      paymentMethods: { type: 'bar', labels: ['Card', 'Transfer', 'Finance', 'Cash'], values: [54, 24, 17, 5], suffix: '%' },
      invoiceStatus: { type: 'bar', labels: ['Paid', 'Pending', 'Overdue'], values: [72, 18, 10], suffix: '%' },
      historicalScores: { type: 'line', labels: ['Q4', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [76, 77, 78, 79, 80, 81, 82, 84], suffix: '' }
    },
    forecasts: {
      revenue: '£49.5k',
      profit: '£12.1k',
      cash: '£24.0k',
      scenarios: [
        { title: 'What if collections slip by 14 days?', body: '30-day closing cash tightens materially, increasing the importance of staged outgoing approvals.' },
        { title: 'What if supplier costs rise another 5%?', body: 'Profit softens and pushes margin discipline from important to urgent.' },
        { title: 'What if bookings outperform by 10%?', body: 'Revenue improves, but the strategic test remains whether margin and cash quality rise with it.' }
      ]
    },
    suppliers: [
      { id: 'foresight-sports', name: 'Foresight Sports', spendMonth: '£8.7k', spendYtd: '£41.2k', spendLastYear: '£33.6k', yoy: '+22.6%', avgInvoice: '£2.2k', invoices: '4', lastPayment: '2026-07-01', category: 'Launch Monitors', risk: 'Medium', opportunity: 'Review terms, bundle strategy, and margin recovery potential.' },
      { id: 'titleist-trade', name: 'Titleist Trade', spendMonth: '£5.2k', spendYtd: '£28.7k', spendLastYear: '£25.4k', yoy: '+13.0%', avgInvoice: '£1.3k', invoices: '8', lastPayment: '2026-06-27', category: 'Retail Stock', risk: 'Low', opportunity: 'Improve premium mix and check stock turn contribution.' },
      { id: 'trackman-services', name: 'Trackman Services', spendMonth: '£3.8k', spendYtd: '£19.9k', spendLastYear: '£16.1k', yoy: '+23.6%', avgInvoice: '£1.9k', invoices: '3', lastPayment: '2026-06-18', category: 'Subscriptions & Support', risk: 'Medium', opportunity: 'Check usage and contract alignment versus operating value.' }
    ],
    risks: [
      { level: 'High', impact: '£6k–£8k cash timing pressure', probability: 'Medium', mitigation: 'Escalate overdue follow-up and set explicit payment dates.', owner: 'CFO', reviewDate: 'This week', trend: 'Worsening', commentary: 'Receivables concentration is the biggest near-term risk to flexibility.' },
      { level: 'Medium', impact: '£1k–£2k monthly margin erosion', probability: 'Medium', mitigation: 'Review contribution margin by supplier and category.', owner: 'CFO / COO', reviewDate: 'Next Sunday', trend: 'Stable', commentary: 'Supplier cost inflation is not dangerous yet, but it is strategically meaningful.' },
      { level: 'Medium', impact: 'Forecast confidence reduction', probability: 'Low–Medium', mitigation: 'Improve VAT and invoice coding discipline.', owner: 'Finance Ops', reviewDate: 'Month end', trend: 'Improving', commentary: 'Data quality is good enough for direction, but not perfect enough to ignore.' }
    ],
    opportunities: [
      { title: 'Speed up receivables follow-up cadence', description: 'A tighter collections rhythm is likely to pull forward £6.0k–£8.0k in cash without cutting growth activity.', revenueIncrease: '—', profitIncrease: '—', cost: 'Low', roi: 'High', timeToImplement: '1 week', confidence: 'High', strategicPriority: 'Immediate', status: 'Ready for approval', reviewDate: 'Friday', category: 'Cash Flow' },
      { title: 'Renegotiate a high-cost supplier relationship', description: 'The largest supplier line suggests room for pricing or payment-term improvement.', revenueIncrease: '—', profitIncrease: '£1.2k/month', cost: 'Low', roi: 'Medium–High', timeToImplement: '2–4 weeks', confidence: 'Medium', strategicPriority: 'High', status: 'Under review', reviewDate: 'Next Monday', category: 'Profit' },
      { title: 'Reduce low-yield discretionary operating spend', description: 'Travel and ad hoc support costs appear to be rising faster than their obvious commercial return.', revenueIncrease: '—', profitIncrease: '£900/month', cost: 'None', roi: 'High', timeToImplement: '2 weeks', confidence: 'Medium', strategicPriority: 'High', status: 'Requires decision', reviewDate: 'Wednesday', category: 'Cost Saving' }
    ],
    commentary: {
      workspace: {
        title: 'CFO Commentary',
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
      { id: 'DJ-017', date: '2026-07-03', executive: 'CFO', recommendation: 'Escalate overdue receivable follow-up on four concentrated invoices.', reasoning: 'Cash flexibility is being constrained by a small number of slow-paying balances.', evidence: '£9.4k outstanding, four overdue invoices, 30-day cash forecast depends on collections.', alternatives: 'Wait another week, or stage payables more conservatively instead.', decision: 'Pending approval', outcome: 'Awaiting decision', impact: 'Potential £6k–£8k cash acceleration', confidence: 'High', lessons: 'Collections cadence should tighten before balances become concentrated.', reviewDate: '2026-07-10', status: 'Pending' },
      { id: 'DJ-016', date: '2026-06-29', executive: 'CFO', recommendation: 'Review one major supplier relationship for margin protection.', reasoning: 'Supplier spend has risen faster than gross profit contribution.', evidence: 'Largest supplier up +22.6% YoY, margin softening 3.1% MoM.', alternatives: 'Absorb the cost, pass through selectively, or reduce order volume.', decision: 'Approved', outcome: 'Negotiation prep underway', impact: 'Estimated £1.2k monthly margin upside', confidence: 'Medium', lessons: 'Supplier concentration should be reviewed before it becomes embedded.', reviewDate: '2026-07-21', status: 'Active' },
      { id: 'DJ-015', date: '2026-06-18', executive: 'CFO', recommendation: 'Hold discretionary support costs flat for one cycle.', reasoning: 'Contractor and support spend drifted above the planned baseline.', evidence: 'Expense trend up 6.8% with unclear operating return on part of spend.', alternatives: 'Immediate reduction, continue unchanged, or reclassify first.', decision: 'Approved', outcome: 'Expense drift stabilised', impact: 'Avoided roughly £900 monthly cost escalation', confidence: 'Medium', lessons: 'Small discretionary lines need explicit ownership before they compound.', reviewDate: '2026-08-01', status: 'Reviewed' }
    ],
    weeklyBriefing: {
      summary: 'EP Golf Studios enters the week from a position of financial strength, but margin quality and collections speed remain the most important control levers for protecting strategic flexibility.',
      wins: ['Revenue remains ahead of the recent baseline.', 'Cash headroom is healthy enough to avoid reactive decisions.', 'Expense drift is visible early, which means it can still be managed calmly.'],
      risks: ['Receivables timing remains too concentrated.', 'Supplier spend is growing faster than comfort allows.', 'Forecast confidence still depends on better categorisation discipline.'],
      recommendations: ['Approve overdue receivables escalation plan.', 'Pressure-test the biggest supplier line before the next purchasing cycle.', 'Hold discretionary operating spend steady until profit quality improves.'],
      questions: ['Which current spend lines are genuinely strategic versus merely habitual?', 'If growth remains strong but margin weakens, what should be slowed first?', 'What assumptions in the 30/60/90 day cash view need the closest challenge?']
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
    }
  },
  approvals: {
    groups: {
      'Finance approvals': [
        { title: 'Approve supplier payment batch', why: 'Three invoices fall due this week including fitting bay consumables.', impact: 'Preserves supplier continuity but reduces near-term cash headroom.', risk: 'Low–Medium', confidence: 'High' },
        { title: 'Approve conservative Q3 growth assumption', why: 'The current plan assumes healthy demand but tighter margin conversion.', impact: 'Creates a more prudent planning baseline.', risk: 'Low', confidence: 'Medium–High' }
      ],
      'Marketing approvals': [
        { title: 'Approve premium fitting proof campaign', why: 'The demo CMO layer assumes one higher-trust flagship campaign this cycle.', impact: 'Improves brand signal and content quality.', risk: 'Low', confidence: 'Medium' }
      ],
      'Sales approvals': [
        { title: 'Approve pricing exception review', why: 'One large prospective deal requires executive oversight on margin trade-off.', impact: 'Could protect conversion without setting a poor pricing precedent.', risk: 'Medium', confidence: 'Medium' }
      ],
      'Operations approvals': [
        { title: 'Approve process improvement sprint', why: 'Operations placeholder intelligence suggests a small workflow redesign opportunity.', impact: 'Should improve execution quality and reduce repeat friction.', risk: 'Low', confidence: 'Medium' }
      ],
      'AI-generated action approvals': [
        { title: 'Approve AI-generated weekly action set', why: 'The AI layer has proposed a grouped leadership action list for review.', impact: 'Creates a consistent executive rhythm while keeping humans in control.', risk: 'Medium', confidence: 'Medium' }
      ]
    }
  },
  reports: {
    overview: [
      { route: '/reports/weekly-briefings', title: 'Weekly Briefings', body: 'Sunday-style weekly summaries for leadership review.' },
      { route: '/reports/monthly-reports', title: 'Monthly Reports', body: 'Placeholder monthly reporting cadence and executive pack structure.' },
      { route: '/reports/quarterly-reviews', title: 'Quarterly Reviews', body: 'Board-style quarterly review output.' },
      { route: '/reports/board-meeting', title: 'Board Meeting Mode', body: 'A cleaner board-facing presentation mode.' },
      { route: '/reports/cfo-reports', title: 'CFO Reports', body: 'Finance-specific reporting pack placeholder.' },
      { route: '/reports/cmo-reports', title: 'CMO Reports', body: 'Marketing-specific report placeholder.' },
      { route: '/reports/ceo-reports', title: 'CEO Reports', body: 'CEO-level summary and decision pack placeholder.' }
    ],
    monthly: {
      summary: 'This placeholder will eventually package revenue, profit, cash, marketing, sales, and operating movement into a monthly executive view.',
      sections: ['Month-on-month business movement', 'Cross-functional KPI highlights', 'Key approvals accepted/rejected', 'Leadership narrative and next-step recommendations']
    },
    cfoReports: ['Financial performance pack', 'Working capital summary', 'Cash and forecast note', 'Risk and approvals appendix'],
    cmoReports: ['Campaign summary placeholder', 'Brand momentum placeholder', 'Channel performance placeholder', 'Next-cycle recommendations placeholder'],
    ceoReports: ['Business health summary', 'Cross-functional risk view', 'Executive actions and approvals', 'Board-ready narrative']
  },
  aiAssistant: {
    overview: {
      summary: 'The AI Assistant section becomes the dedicated home for questions, briefings, assumptions, missing information, suggested actions, and executive context.',
      cards: [
        { route: '/ai-assistant/ask', title: 'Ask EP Intelligence', body: 'A natural-language query surface for executive questions.' },
        { route: '/ai-assistant/executive-briefing', title: 'Executive Briefing', body: 'A generated leadership briefing placeholder.' },
        { route: '/ai-assistant/follow-up-questions', title: 'Follow-up Questions', body: 'A curated next-question layer for deeper reasoning.' },
        { route: '/ai-assistant/suggested-actions', title: 'Suggested Actions', body: 'A staged list of AI-suggested actions awaiting human review.' },
        { route: '/ai-assistant/assumptions', title: 'Assumptions', body: 'The explicit assumptions behind AI outputs.' },
        { route: '/ai-assistant/missing-information', title: 'Missing Information', body: 'What the AI layer still needs to know before increasing confidence.' },
        { route: '/ai-assistant/memory-context', title: 'AI Memory / Context', body: 'How EP Intelligence will preserve executive context over time.' }
      ]
    },
    pages: {
      '/ai-assistant/ask': {
        description: 'This placeholder page will eventually let leaders ask direct questions across finance, marketing, sales, operations, and projects.',
        exampleMetrics: ['Questions answered by module', 'Confidence score', 'Follow-up depth'],
        exampleInsights: ['Why did margin compress?', 'What changed since last week?', 'Where should leadership focus next?'],
        exampleActions: ['Stage a CFO review', 'Open a related report', 'Request assumption review']
      },
      '/ai-assistant/executive-briefing': {
        description: 'This placeholder page will eventually generate concise executive briefings spanning the whole business.',
        exampleMetrics: ['Briefing freshness', 'Coverage by module', 'Leadership priority count'],
        exampleInsights: ['Health score movement', 'Cross-functional changes', 'Recommended executive focus'],
        exampleActions: ['Create weekly pack', 'Open board view', 'Review priorities']
      },
      '/ai-assistant/follow-up-questions': {
        description: 'This placeholder page will eventually surface the best next questions to ask after a report or recommendation.',
        exampleMetrics: ['Suggested follow-ups', 'Decision depth', 'Outstanding unknowns'],
        exampleInsights: ['What should we challenge next?', 'Which assumption is weakest?', 'What evidence would change confidence?'],
        exampleActions: ['Open assumptions', 'Open missing information', 'Escalate to approval']
      },
      '/ai-assistant/suggested-actions': {
        description: 'This placeholder page will eventually collect AI-suggested actions without ever executing automatically.',
        exampleMetrics: ['Open suggestions', 'Pending approvals', 'Action categories'],
        exampleInsights: ['Top recommended actions this week', 'Most urgent staged decisions', 'Cross-functional dependencies'],
        exampleActions: ['Approve', 'Return for review', 'Hold in draft']
      },
      '/ai-assistant/assumptions': {
        description: 'This placeholder page will eventually show the assumptions behind every key AI recommendation.',
        exampleMetrics: ['Assumptions tracked', 'High-risk assumptions', 'Confidence sensitivity'],
        exampleInsights: ['Which assumptions matter most?', 'What would change the forecast?', 'Where is the reasoning fragile?'],
        exampleActions: ['Challenge assumption', 'Request more evidence', 'Update briefing']
      },
      '/ai-assistant/missing-information': {
        description: 'This placeholder page will eventually show what the AI layer still does not know.',
        exampleMetrics: ['Open data gaps', 'Unknowns affecting confidence', 'Blocked recommendations'],
        exampleInsights: ['Why confidence is limited', 'Which missing data matters most', 'What evidence would improve output'],
        exampleActions: ['Mark for review', 'Request data source', 'Keep as placeholder']
      },
      '/ai-assistant/memory-context': {
        description: 'This placeholder page will eventually explain how executive memory, context, and longitudinal reasoning are maintained.',
        exampleMetrics: ['Context windows', 'Saved decisions', 'Historical briefing references'],
        exampleInsights: ['What leadership already decided', 'What lessons should persist', 'Which themes are recurring'],
        exampleActions: ['Open decision journal', 'Review prior reports', 'Pin context item']
      }
    }
  },
  placeholders: {
    '/cmo': {
      module: 'CMO',
      description: 'This module will eventually track marketing performance, campaign quality, brand momentum, channel effectiveness, and content outcomes.',
      metrics: ['Campaign efficiency', 'Lead quality', 'Reach and engagement', 'Content performance'],
      insights: ['Which campaigns are building trust?', 'Where is marketing creating qualified demand?', 'What content is most reusable?'],
      actions: ['Approve campaign themes', 'Review premium proof content', 'Prioritise next-week content focus'],
      status: 'Mock placeholder only'
    },
    '/coo': {
      module: 'COO',
      description: 'This module will eventually track operational execution, fulfilment quality, service capacity, process friction, and delivery reliability.',
      metrics: ['Capacity usage', 'Workflow bottlenecks', 'Operational turnaround time', 'Delivery quality'],
      insights: ['Where is execution slowing down?', 'Which process changes would reduce friction?', 'What is threatening consistency?'],
      actions: ['Approve process changes', 'Prioritise service improvements', 'Review delivery risk areas'],
      status: 'Mock placeholder only'
    },
    '/sales': {
      module: 'Sales',
      description: 'This module will eventually track pipeline health, conversion quality, revenue potential, pricing discipline, and commercial execution.',
      metrics: ['Pipeline value', 'Conversion rate', 'Average deal value', 'Sales cycle speed'],
      insights: ['Where is conversion improving?', 'Which deals need executive attention?', 'How is pricing affecting margin?'],
      actions: ['Approve pricing exceptions', 'Review large opportunities', 'Challenge pipeline assumptions'],
      status: 'Mock placeholder only'
    },
    '/customer-success': {
      module: 'Customer Success',
      description: 'This module will eventually track retention, customer satisfaction, service quality, referral strength, and long-term loyalty.',
      metrics: ['Customer health', 'Retention rate', 'Service quality', 'Referral activity'],
      insights: ['Where is customer experience strongest?', 'What could weaken loyalty?', 'Which accounts need proactive attention?'],
      actions: ['Approve service improvements', 'Review churn-risk interventions', 'Prioritise follow-up actions'],
      status: 'Mock placeholder only'
    },
    '/operations': {
      module: 'Operations',
      description: 'This module will eventually track workflow coordination, throughput, execution discipline, system friction, and operational visibility.',
      metrics: ['Throughput', 'Cycle time', 'Open blockers', 'Execution consistency'],
      insights: ['What is slowing execution?', 'Which bottlenecks are systemic?', 'Where would better tooling help most?'],
      actions: ['Approve workflow changes', 'Review bottlenecks', 'Prioritise process improvements'],
      status: 'Mock placeholder only'
    },
    '/hr': {
      module: 'HR',
      description: 'This module will eventually track staffing, role clarity, capability needs, workload, and people health across the business.',
      metrics: ['Capacity coverage', 'Hiring status', 'Team sentiment', 'Training priorities'],
      insights: ['Where is capacity stretched?', 'What capability is missing?', 'Which leadership risks are people-related?'],
      actions: ['Approve hiring plans', 'Review role changes', 'Prioritise development actions'],
      status: 'Mock placeholder only'
    },
    '/projects': {
      module: 'Projects',
      description: 'This module will eventually track strategic initiatives, ownership, deadlines, dependencies, and executive project risk.',
      metrics: ['Active projects', 'On-track rate', 'Blocked work', 'Upcoming deadlines'],
      insights: ['Which projects matter most now?', 'Where are dependencies creating risk?', 'What needs executive unblock?'],
      actions: ['Approve project priorities', 'Review timelines', 'Escalate blocked initiatives'],
      status: 'Mock placeholder only'
    }
  },
  settings: {
    integrations: ['QuickBooks', 'Starling', 'Bookings Dashboard', 'CRM', 'Inventory', 'HR', 'Payroll', 'Google Analytics', 'Calendar'],
    placeholders: ['Navigation preferences', 'Health score weighting', 'Weekly briefing preferences', 'Command palette defaults', 'Executive personas', 'Historical memory controls']
  },
  shortcuts: [
    { keys: 'Ctrl/Cmd + K', action: 'Open command palette' },
    { keys: '/', action: 'Focus sidebar search' },
    { keys: 'G C', action: 'Jump to CEO Dashboard' },
    { keys: 'G F', action: 'Jump to CFO' },
    { keys: 'G R', action: 'Jump to Reports' },
    { keys: 'Esc', action: 'Close overlays and mobile nav' }
  ]
};
