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
  cmo: [
    ['/cmo', 'Marketing Dashboard'],
    ['/cmo/social-media-overview', 'Social Media Overview'],
    ['/cmo/youtube', 'YouTube'],
    ['/cmo/instagram', 'Instagram'],
    ['/cmo/facebook', 'Facebook'],
    ['/cmo/linkedin', 'LinkedIn'],
    ['/cmo/x', 'X (Twitter)'],
    ['/cmo/website-analytics', 'Website Analytics'],
    ['/cmo/email-marketing', 'Email Marketing'],
    ['/cmo/campaign-performance', 'Campaign Performance'],
    ['/cmo/content-library', 'Content Library'],
    ['/cmo/competitor-analysis', 'Competitor Analysis'],
    ['/cmo/marketing-calendar', 'Marketing Calendar'],
    ['/cmo/ai-marketing-advisor', 'AI Marketing Advisor'],
    ['/cmo/reports', 'Marketing Reports'],
    ['/cmo/settings', 'Settings']
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

  '/cmo': { title: 'Marketing Dashboard', subtitle: 'The executive marketing command centre for EP Golf Studios.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/cmo/social-media-overview': { title: 'Social Media Overview', subtitle: 'A ranked, cross-platform view of growth, reach, and engagement.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/cmo/youtube': { title: 'YouTube', subtitle: 'Subscribers, views, watch time, and video performance over time.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/cmo/instagram': { title: 'Instagram', subtitle: 'Followers, reach, engagement, and top-performing visual content.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/cmo/facebook': { title: 'Facebook', subtitle: 'Reach, community engagement, and content consistency trends.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/cmo/linkedin': { title: 'LinkedIn', subtitle: 'Authority-building content, reach, and professional engagement.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/cmo/x': { title: 'X (Twitter)', subtitle: 'Conversation reach, posting cadence, and audience movement.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/cmo/website-analytics': { title: 'Website Analytics', subtitle: 'A Google Analytics-style view of traffic, engagement, and conversion.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/cmo/email-marketing': { title: 'Email Marketing', subtitle: 'Subscriber growth, campaign performance, and list health.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/cmo/campaign-performance': { title: 'Campaign Performance', subtitle: 'Active campaigns, ROI, leads, and revenue-attribution placeholders.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/cmo/content-library': { title: 'Content Library', subtitle: 'A searchable content inventory spanning video, social, blog, and email assets.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/cmo/competitor-analysis': { title: 'Competitor Analysis', subtitle: 'Placeholder competitor rankings, growth comparisons, and strategic watchpoints.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/cmo/marketing-calendar': { title: 'Marketing Calendar', subtitle: 'A visual planning layer for campaigns, content, launches, and events.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/cmo/ai-marketing-advisor': { title: 'AI Marketing Advisor', subtitle: 'The AI strategy and recommendation workspace for marketing leadership.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/cmo/reports': { title: 'Marketing Reports', subtitle: 'The marketing reporting surface for weekly briefings and channel summaries.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/cmo/settings': { title: 'CMO Settings', subtitle: 'Preferences, placeholders, and future marketing integration settings.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },

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
    next: ['Review priorities, risks, and approvals', 'Move from summary into the module or report that best supports the next decision.']
  },
  '/cfo': {
    what: ['Revenue is healthy, profit is slightly tighter', 'The business is growing, but the quality of that growth matters more than volume alone.'],
    why: ['Supplier and support costs rose faster than ideal', 'Supplier concentration and expense drift have moderated how much confidence top-line growth should create.'],
    matters: ['Yes — it affects flexibility', 'The business remains strong, but weaker margin conversion reduces room for casual decisions.'],
    next: ['Prioritise collections and margin control', 'The best next decisions are around receivables, supplier discipline, and selective spend restraint.']
  },
  '/cmo': {
    what: ['Marketing momentum is positive overall', 'Audience growth, content reach, and website attention are all moving in the right direction in the current demo scenario.'],
    why: ['Platform strength is uneven', 'Short-form and video-led content are outperforming slower, lower-frequency channels and are lifting overall marketing confidence.'],
    matters: ['Yes, because marketing quality drives demand', 'The point is not just visibility. It is whether content and channels are creating meaningful business outcomes like enquiries, sign-ups, and bookings.'],
    next: ['Focus on high-performing formats and conversion paths', 'Use the dashboard to double down on what is working, reduce drag from weaker channels, and approve the next best marketing actions.']
  },
  '/cmo/social-media-overview': {
    what: ['The social estate is growing, but not evenly', 'Video and visually-led platforms are carrying the strongest momentum in the demo data.'],
    why: ['Content format and posting consistency matter most', 'The highest-ranked platforms combine stronger cadence, stronger hooks, and clearer audience fit.'],
    matters: ['Yes, because platform mix shapes growth efficiency', 'The social overview should quickly show where marketing energy is creating the best return.'],
    next: ['Rank the channels and act on the strongest signals', 'Use the ranked view to keep resources on the highest-performing platforms first.']
  },
  '/cmo/youtube': {
    what: ['YouTube is a top-performing long-form channel', 'Subscriber growth, watch time, and educational content are all contributing to strong platform quality in the demo environment.'],
    why: ['Higher-quality educational video is performing', 'Clearer titles, deeper proof content, and stronger retention are driving better outcomes.'],
    matters: ['Yes, because YouTube is compounding brand authority', 'This matters not just for views, but for trust-building and downstream enquiry quality.'],
    next: ['Keep producing proof-led, high-trust content', 'Use the strongest-performing formats as the blueprint for the next content cycle.']
  },
  '/cmo/website-analytics': {
    what: ['Website traffic is healthy and conversion-relevant', 'Visitor growth, session quality, and conversion actions are all visible in one executive surface.'],
    why: ['Traffic quality is improving', 'Better content, stronger acquisition paths, and clearer conversion intent are lifting the placeholder performance.'],
    matters: ['Yes, because website performance connects visibility to action', 'This is where marketing starts to show whether attention is turning into leads, sign-ups, and enquiries.'],
    next: ['Protect traffic quality and optimise conversion paths', 'Use the page to decide where the website deserves more focus versus where traffic alone is misleading.']
  },
  '/cmo/ai-marketing-advisor': {
    what: ['The AI layer is framing marketing priorities', 'It summarises channel movement, opportunities, risks, missing information, and next-step recommendations.'],
    why: ['Marketing data is easier to act on when synthesised', 'The point of the advisor is not automation. It is better executive framing and clearer decision sequencing.'],
    matters: ['Yes, because good marketing decisions are cross-channel', 'The AI advisor becomes the place where content, platform, website, and campaign thinking come together.'],
    next: ['Use it to stage actions for approval', 'The best next move is to convert recommendations into clear, reviewable marketing actions.']
  },
  '/cmo/reports': {
    what: ['Marketing reporting now has its own executive layer', 'Channel summaries, weekly briefings, and campaign views are now grouped as a proper module output.'],
    why: ['Marketing needs packaging, not just dashboards', 'Leadership often needs a clean narrative pack rather than raw platform metrics.'],
    matters: ['Yes, because reporting quality shapes confidence', 'A strong marketing report should explain performance, risks, and the next best actions clearly.'],
    next: ['Use reports to support approvals and weekly review', 'Treat these outputs as the narrative layer that supports broader executive decision-making.']
  },
  '/approvals': {
    what: ['Approvals are centralised across the business', 'Finance, marketing, sales, operations, and AI-generated actions now sit in one executive review surface.'],
    why: ['Approval-first governance protects quality', 'The operating system is designed to stage decisions before any future automation exists.'],
    matters: ['Yes, because governance quality is strategic', 'A single approval centre gives leadership one calm place to review decisions that matter.'],
    next: ['Prioritise high-impact approvals', 'Review the approvals most likely to affect cash, growth quality, content output, or executive confidence.']
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
    summary: 'EP Golf Studios is trading from a position of strength. Leadership attention should stay focused on cash timing, margin discipline, marketing conversion quality, a few open approvals, and keeping execution aligned across the business.',
    businessHealth: [
      { label: 'Revenue Snapshot', value: '£46.8k', body: 'Demand remains healthy and premium conversion is holding up.', icon: 'trending-up' },
      { label: 'Profit Snapshot', value: '£11.6k', body: 'Still strong overall, with margin pressure worth watching.', icon: 'coins' },
      { label: 'Cash Position', value: '£28.1k', body: 'Healthy enough for calm decision-making under current assumptions.', icon: 'wallet' },
      { label: 'Pending Approvals', value: '17', body: 'Open decisions now span finance, marketing, sales, and operations.', icon: 'check-circle' }
    ],
    todayPriorities: [
      { title: 'Protect short-term flexibility', note: 'Collections timing and staged outgoing approvals remain the highest-leverage executive decisions.', tone: 'warn' },
      { title: 'Back the strongest marketing channels', note: 'Video and proof-led content are outperforming weaker channels and should shape the next cycle.', tone: 'good' },
      { title: 'Keep cross-functional execution aligned', note: 'Projects, marketing, and customer experience all look positive, but leadership focus should stay selective.', tone: 'risk' }
    ],
    snapshots: [
      { label: 'Marketing Snapshot', value: 'Momentum up', body: 'Marketing health is positive, with YouTube and Instagram leading the strongest gains.', icon: 'sparkles' },
      { label: 'Sales Snapshot', value: 'Pipeline stable', body: 'Conversion quality looks healthy in the placeholder sales view.', icon: 'trending-up' },
      { label: 'Operations Snapshot', value: 'Delivery on track', body: 'Operational execution is calm, with a few process improvements identified.', icon: 'building' },
      { label: 'Customer Experience', value: 'Satisfaction strong', body: 'Retention and service quality remain positive in the mock environment.', icon: 'pulse' },
      { label: 'Staff / HR Snapshot', value: 'Capacity steady', body: 'The people view suggests manageable workload with leadership visibility still needed.', icon: 'book-open' },
      { label: 'Open Projects', value: '6 active', body: 'Projects are visible, but prioritisation remains an executive task.', icon: 'target' }
    ],
    risks: [
      'Receivables timing remains the clearest short-term pressure point.',
      'Supplier concentration could reduce margin quality if left unchallenged.',
      'Marketing effort could drift into low-return channels if rankings are ignored.'
    ],
    opportunities: [
      'Accelerate overdue cash collection without reducing growth activity.',
      'Double down on the strongest marketing formats and conversion paths.',
      'Use shared reporting to tighten weekly leadership rhythm.'
    ],
    approvalsPreview: [
      'Finance: staged supplier payment sequencing',
      'Marketing: publish premium fitting proof campaign',
      'Sales: pricing exception review',
      'Operations: process improvement action approval'
    ],
    aiBriefing: {
      title: 'AI Executive Briefing',
      summary: 'The business is healthy overall. The smartest CEO actions today are to protect flexibility, keep marketing attention on the strongest channels, and ensure approvals are not becoming passive bottlenecks.',
      evidence: 'Revenue and cash are healthy, marketing health is positive, customer and operational signals are stable, and most watchpoints are controllable rather than structural.',
      confidence: 'Medium–High',
      impact: 'Better prioritisation this week should improve decision speed without increasing risk.',
      risks: 'If leadership attention becomes too fragmented, the business may react to noise rather than leverage.',
      alternatives: 'Lean into growth, focus on control, or keep a balanced posture while reviewing approvals and risks closely.',
      action: 'Review priorities, clear the most important approvals, and use the reports area to drive the weekly leadership conversation.',
      missing: 'All signals remain mock/demo only. No live integrations are connected in this sprint.',
      followUp: ['What needs CEO attention first?', 'Which approvals are actually strategic?', 'What changed since last week?']
    },
    weeklySummaryPreview: {
      headline: 'Healthy week, with attention needed on cash timing, marketing conversion quality, and approval discipline.',
      body: 'Leadership can remain calm, but the best next decisions are still around collections, marketing focus, supplier leverage, and keeping approvals from becoming passive queue items.'
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
      snapshot: { revenue: '£46.8k', profit: '£11.6k', cash: '£28.1k', approvals: '6 waiting' }
    },
    workspace: {
      banner: { title: 'Executive Summary', body: 'EP Golf Studios is trading from a position of strength, but the smartest decisions this week are around collections, margin discipline, and approval sequencing rather than new discretionary spend.' },
      priorities: [
        { title: 'Review overdue invoices', note: 'Receivables are the fastest path to stronger short-term flexibility.', tone: 'warn' },
        { title: 'Pressure-test supplier spend', note: 'Supplier concentration is now strategically important rather than just operationally relevant.', tone: 'risk' },
        { title: 'Protect discretionary spend discipline', note: 'Cash is healthy enough for calm decisions, but not for avoidable drift.', tone: 'good' }
      ],
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
      workspace: { title: 'CFO Commentary', summary: 'The business is healthy, but the smartest decisions this week are about protecting flexibility rather than chasing more motion.', evidence: 'Revenue +8.4%, profit -3.1%, cash runway 5.4 months, supplier concentration elevated, overdue invoices still meaningful.', confidence: 'High', impact: 'Faster collections and better supplier discipline could improve both margin quality and short-term optionality.', risks: 'If the business focuses only on top-line confidence, it may underreact to soft margin compression.', alternatives: 'Push for more volume, hold the line temporarily, or slow selective spending while protecting high-return activity.', action: 'Approve collections escalation, review top supplier terms, and keep discretionary operating spend tightly controlled.', missing: 'Live bank, invoice, and booking integrations are intentionally deferred.', followUp: ['What if collections slip another 14 days?', 'Which supplier is actually hurting margin most?', 'Can we fund another investment this month?'] },
      revenue: { title: 'Revenue Commentary', summary: 'Revenue is encouraging, but quality still matters more than volume alone.', evidence: 'Monthly revenue ahead of plan, premium conversion up, and year-on-year growth healthy in placeholder data.', confidence: 'High', impact: 'Stronger revenue supports strategic freedom only if it improves profit and cash conversion too.', risks: 'Revenue strength could mask collection weakness or margin softness.', alternatives: 'Lean into volume, protect premium mix, or prioritise higher-conversion demand only.', action: 'Track revenue alongside invoice status and gross margin, not as a standalone success number.', missing: 'Bookings Dashboard integration is not connected yet.', followUp: ['Is the revenue mix improving margin?', 'How much is still uncollected?', 'What does next month look like?'] },
      profit: { title: 'Profit Commentary', summary: 'Profit remains solid, but cost pressure is reducing how much strategic confidence revenue growth should create.', evidence: 'Net profit down 3.1% month on month while supplier and support costs rose faster than ideal.', confidence: 'High', impact: 'If margin softness continues for another cycle, the business will feel richer than it actually is.', risks: 'Top-line celebration could delay necessary cost or supplier action.', alternatives: 'Absorb pressure temporarily, renegotiate upstream, or reduce lower-value spend.', action: 'Protect gross margin first, then challenge discretionary and supplier-heavy lines.', missing: 'Live invoice-level and supplier-level profitability data is not connected yet.', followUp: ['Which cost centre moved most?', 'Can margin recover without cutting growth?', 'Where is the easiest profit gain?'] },
      expenses: { title: 'Expense Commentary', summary: 'Expense growth is manageable, but several variable lines are becoming habits rather than choices.', evidence: 'Monthly expenses +6.8% with visible contractor, travel, and support drift.', confidence: 'Medium–High', impact: 'Early action could protect roughly £900+ monthly without impairing performance.', risks: 'Overreacting can cut useful capability; underreacting can normalise waste.', alternatives: 'Freeze discretionary spend, reclassify first, or selectively trim low-yield lines.', action: 'Review variable costs one by one and preserve only those with clear operating or commercial return.', missing: 'Live expense categorisation feeds remain intentionally offline.', followUp: ['What spend is strategic?', 'What is just drift?', 'What would I cut last?'] },
      suppliers: { title: 'Supplier Commentary', summary: 'Supplier spend is not yet dangerous, but it has become strategically important enough to justify explicit executive attention.', evidence: 'Top supplier +22.6% YoY, overall supplier costs rising faster than comfort allows, profit slightly softer.', confidence: 'Medium–High', impact: 'Improved terms or more disciplined buying could meaningfully lift margin and cash timing.', risks: 'Challenging suppliers without understanding dependency may reduce service quality or availability.', alternatives: 'Renegotiate, consolidate, reduce order frequency, or accept current terms temporarily.', action: 'Review the top three supplier relationships individually and decide which ones warrant negotiation now.', missing: 'Contract-level and inventory-linked supplier intelligence is not connected yet.', followUp: ['Which supplier matters most?', 'Where is pricing leverage strongest?', 'Can we improve payment timing?'] },
      cash: { title: 'Cash Flow Commentary', summary: 'Cash is strong enough to support calm decisions, but timing discipline still matters more than the headline balance alone.', evidence: 'Current cash £28.1k, 30-day close £21.3k, overdue invoices materially affecting flexibility.', confidence: 'High', impact: 'Collections improvement could increase decision freedom immediately without reducing growth activity.', risks: 'Supplier and tax timing could narrow the comfort zone faster than expected if receipts slip again.', alternatives: 'Hold spend steady, escalate collections, or stage outgoing commitments more conservatively.', action: 'Protect incoming timing first, then align outgoing approvals against confirmed receipts.', missing: 'Live banking feeds and settlement-level inflow data are not connected yet.', followUp: ['What weakens the 30-day view most?', 'Can we fund a new investment?', 'What approvals should wait?'] },
      vat: { title: 'VAT Commentary', summary: 'The VAT estimate appears manageable, but process confidence matters as much as the number itself.', evidence: 'Current estimate provisioned, with historical range broadly stable but still dependent on record completeness.', confidence: 'Medium', impact: 'Good VAT discipline improves planning confidence and reduces avoidable surprises.', risks: 'Late or misclassified purchase records reduce the reliability of both VAT and cash planning.', alternatives: 'Increase monthly controls, retain current pace, or defer clean-up until submission week.', action: 'Tighten purchase-side record discipline ahead of the next cycle.', missing: 'No live bookkeeping integration is connected in this sprint.', followUp: ['How sensitive is the estimate?', 'What if invoices arrive late?', 'How much buffer do we need?'] },
      forecasting: { title: 'Forecast Commentary', summary: 'The forecast is helpful because it frames choices, not because it predicts the future perfectly.', evidence: 'Positive revenue outlook, stable cash view, and scenario planning anchored on margin and collections assumptions.', confidence: 'Medium', impact: 'Better assumption discipline improves investment timing and approval quality.', risks: 'False precision can make the team less curious about what could go wrong.', alternatives: 'Use optimistic, conservative, or scenario-weighted planning.', action: 'Challenge the handful of assumptions that move the forecast most.', missing: 'Live pipeline, banking, and bookkeeping feeds are intentionally absent.', followUp: ['What breaks the plan first?', 'What improves it most?', 'What investment is safest?'] }
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
  cmo: {
    dashboard: {
      healthScore: 82,
      previousScore: 78,
      trend: '+4 points vs last month',
      summary: 'Marketing is performing well overall, with YouTube and Instagram driving the strongest momentum. Website traffic and lead quality are improving, while email and LinkedIn need more consistency.',
      metrics: {
        followers: '128.4k',
        views: '1.86M',
        engagement: '74.2k',
        visitors: '21.7k',
        signups: '462',
        leads: '184',
        enquiries: '73'
      },
      bestPlatform: 'YouTube',
      worstPlatform: 'X (Twitter)',
      opportunities: [
        'Turn high-performing YouTube proof content into Instagram and LinkedIn sequences.',
        'Strengthen website conversion paths from social traffic into fitting enquiries.',
        'Increase email list growth by using top-performing educational content as lead magnets.'
      ],
      risks: [
        'X is absorbing time without creating strong growth or engagement quality.',
        'Email output is stable but not yet compounding as strongly as website and video.',
        'Without clear approval sequencing, marketing actions may become fragmented rather than strategic.'
      ],
      pendingApprovals: [
        'Publish social proof carousel',
        'Approve next YouTube video cut',
        'Schedule weekly email campaign',
        'Update conversion CTA on fitting landing page'
      ],
      weeklyBriefing: 'Marketing enters the week from a strong position. Video-led proof content and educational assets are driving the best traction, while the next growth lift is likely to come from stronger conversion pathways and better repurposing discipline.',
      aiSummary: {
        title: 'AI Marketing Summary',
        summary: 'Marketing momentum is healthy, but the highest-value next moves are about doubling down on the strongest channels and tightening weak conversion points.',
        evidence: 'YouTube leads platform rankings, Instagram is the strongest visual growth channel, website traffic is up, and booking enquiries are improving.',
        confidence: 'High',
        impact: 'Improved channel focus could increase lead quality and reduce wasted effort across weaker platforms.',
        risks: 'Spreading energy too evenly across all platforms could reduce the return from the strongest channels.',
        alternatives: 'Prioritise video, prioritise conversion optimisation, or continue with a balanced but slower multi-channel approach.',
        action: 'Prioritise YouTube, Instagram, and website conversion work. Keep weaker platforms on a lighter, more selective cadence.',
        missing: 'No live platform or attribution integrations are connected in this sprint.',
        followUp: ['Which channel deserves the next content push?', 'What content is actually driving leads?', 'Where is marketing wasting effort?']
      }
    },
    socialOverview: {
      combined: {
        followers: '128.4k',
        views: '1.86M',
        reach: '1.12M',
        engagement: '74.2k',
        gained: '+6.3k',
        growth: '+5.2%'
      },
      rankings: [
        { platform: 'YouTube', score: 92, growth: '+8.4%', note: 'Best-performing long-form proof channel.' },
        { platform: 'Instagram', score: 88, growth: '+7.1%', note: 'Strong visual engagement and follower growth.' },
        { platform: 'Facebook', score: 76, growth: '+3.8%', note: 'Solid reach but less efficient engagement quality.' },
        { platform: 'LinkedIn', score: 71, growth: '+2.9%', note: 'Authority-building potential, but posting cadence is inconsistent.' },
        { platform: 'X (Twitter)', score: 58, growth: '+1.1%', note: 'Conversation presence exists, but return remains limited.' }
      ],
      topContent: { title: 'YouTube: “Driver Fitting Truths Every Golfer Should Know”', platform: 'YouTube', metric: '182k views / 11.8k engagement' },
      lowestContent: { title: 'X thread: “Weekly fitting notes”', platform: 'X', metric: '8.2k impressions / 0.8% engagement' }
    },
    platforms: {
      youtube: {
        label: 'YouTube',
        health: 'High-performing authority channel',
        stats: [
          ['Subscribers', '42.6k'],
          ['Views', '784k'],
          ['Reach', '462k'],
          ['Impressions', '1.21M'],
          ['Likes', '26.4k'],
          ['Comments', '2.8k'],
          ['Shares', '1.3k'],
          ['Watch Time', '38.7k hrs'],
          ['Click Through Rate', '5.9%'],
          ['Engagement Rate', '6.4%'],
          ['Audience Growth', '+8.4%'],
          ['Posting Frequency', '2 long-form / 3 shorts weekly']
        ],
        charts: {
          followers: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [35.4, 36.2, 37.5, 38.9, 40.1, 41.2, 42.6], suffix: 'k' },
          views: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [420, 466, 492, 544, 618, 702, 784], suffix: 'k' },
          engagement: { type: 'bar', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [16, 17.4, 18.1, 19.3, 21.0, 24.2, 26.4], suffix: 'k' }
        },
        topContent: [
          'Driver Fitting Truths Every Golfer Should Know',
          'Why Most Players Buy the Wrong Shaft',
          'Inside a Premium Fitting Session at EP Golf Studios'
        ],
        recentPosts: ['Short: Launch monitor myth', 'Video: Wedge fitting breakdown', 'Short: Ball speed test']
      },
      instagram: {
        label: 'Instagram',
        health: 'Fast-moving visual growth channel',
        stats: [
          ['Followers', '31.8k'],
          ['Views', '422k'],
          ['Reach', '278k'],
          ['Impressions', '540k'],
          ['Likes', '18.9k'],
          ['Comments', '1.7k'],
          ['Shares', '2.6k'],
          ['Watch Time', '14.2k hrs'],
          ['Click Through Rate', '3.1%'],
          ['Engagement Rate', '7.2%'],
          ['Audience Growth', '+7.1%'],
          ['Posting Frequency', '5 reels / 4 stories weekly']
        ],
        charts: {
          followers: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [24.8, 25.6, 26.9, 28.1, 29.5, 30.6, 31.8], suffix: 'k' },
          views: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [186, 208, 236, 272, 316, 358, 422], suffix: 'k' },
          engagement: { type: 'bar', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [10.2, 11.3, 12.8, 14.4, 15.2, 16.8, 18.9], suffix: 'k' }
        },
        topContent: ['Reel: Iron fitting before / after', 'Carousel: What a real fitting changes', 'Reel: Ball flight proof clip'],
        recentPosts: ['Story: Studio day', 'Carousel: Fitting outcomes', 'Reel: Shaft test highlight']
      },
      facebook: {
        label: 'Facebook',
        health: 'Reliable community reach channel',
        stats: [
          ['Followers', '26.1k'],
          ['Views', '314k'],
          ['Reach', '204k'],
          ['Impressions', '418k'],
          ['Likes', '11.6k'],
          ['Comments', '1.1k'],
          ['Shares', '1.9k'],
          ['Watch Time', '8.6k hrs'],
          ['Click Through Rate', '2.6%'],
          ['Engagement Rate', '5.1%'],
          ['Audience Growth', '+3.8%'],
          ['Posting Frequency', '4 posts weekly']
        ],
        charts: {
          followers: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [22.5, 23.0, 23.7, 24.4, 25.0, 25.6, 26.1], suffix: 'k' },
          views: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [168, 182, 199, 214, 238, 276, 314], suffix: 'k' },
          engagement: { type: 'bar', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [7.8, 8.4, 9.0, 9.5, 10.1, 10.8, 11.6], suffix: 'k' }
        },
        topContent: ['Post: Client fitting win', 'Video clip: Driver session proof', 'Photo set: Premium fitting setup'],
        recentPosts: ['Photo: Studio detail', 'Post: Booking CTA', 'Video: Club comparison']
      },
      linkedin: {
        label: 'LinkedIn',
        health: 'Emerging authority-building channel',
        stats: [
          ['Followers', '18.7k'],
          ['Views', '196k'],
          ['Reach', '128k'],
          ['Impressions', '244k'],
          ['Likes', '6.2k'],
          ['Comments', '0.8k'],
          ['Shares', '0.7k'],
          ['Watch Time', '3.4k hrs'],
          ['Click Through Rate', '2.2%'],
          ['Engagement Rate', '4.6%'],
          ['Audience Growth', '+2.9%'],
          ['Posting Frequency', '2 posts weekly']
        ],
        charts: {
          followers: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [16.1, 16.4, 16.9, 17.3, 17.8, 18.2, 18.7], suffix: 'k' },
          views: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [118, 124, 132, 148, 162, 179, 196], suffix: 'k' },
          engagement: { type: 'bar', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [3.4, 3.8, 4.2, 4.6, 5.0, 5.6, 6.2], suffix: 'k' }
        },
        topContent: ['Article: The premium fitting difference', 'Post: Why trust matters in equipment choices', 'Carousel: Business lessons from fitting sessions'],
        recentPosts: ['Post: Customer trust angle', 'Article: Fitting quality', 'Update: Brand positioning']
      },
      x: {
        label: 'X (Twitter)',
        health: 'Lower-return awareness channel',
        stats: [
          ['Followers', '9.2k'],
          ['Views', '146k'],
          ['Reach', '52k'],
          ['Impressions', '238k'],
          ['Likes', '2.7k'],
          ['Comments', '0.2k'],
          ['Shares', '0.4k'],
          ['Watch Time', '1.1k hrs'],
          ['Click Through Rate', '1.2%'],
          ['Engagement Rate', '2.1%'],
          ['Audience Growth', '+1.1%'],
          ['Posting Frequency', '6 short posts weekly']
        ],
        charts: {
          followers: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [8.3, 8.4, 8.6, 8.7, 8.9, 9.0, 9.2], suffix: 'k' },
          views: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [118, 122, 124, 128, 134, 140, 146], suffix: 'k' },
          engagement: { type: 'bar', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [1.9, 2.0, 2.1, 2.2, 2.4, 2.5, 2.7], suffix: 'k' }
        },
        topContent: ['Post: Quick fitting take', 'Thread: Equipment notes', 'Clip: Short proof snippet'],
        recentPosts: ['Short post: Studio thought', 'Thread: Fitting insights', 'Clip: Product reaction']
      }
    },
    charts: {
      platformComparison: { type: 'bar', labels: ['YouTube', 'Instagram', 'Facebook', 'LinkedIn', 'X'], values: [92, 88, 76, 71, 58], suffix: '' },
      followerGrowth: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [96.2, 101.1, 106.4, 112.2, 118.5, 122.1, 128.4], suffix: 'k' },
      totalViews: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [1012, 1102, 1183, 1306, 1468, 1621, 1862], suffix: 'k' },
      engagementMix: { type: 'doughnut', labels: ['Likes', 'Comments', 'Shares', 'Clicks'], values: [52, 11, 14, 23], suffix: '%' },
      websiteTraffic: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [15.2, 16.1, 17.5, 18.9, 19.8, 20.6, 21.7], suffix: 'k' },
      emailGrowth: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [5.8, 6.0, 6.3, 6.7, 7.1, 7.4, 7.9], suffix: 'k' },
      emailPerformance: { type: 'bar', labels: ['Open Rate', 'Click Rate', 'Unsubscribe Rate'], values: [42.4, 5.8, 0.6], suffix: '%' },
      campaignROI: { type: 'bar', labels: ['Fitting Proof Series', 'Summer Driver Push', 'Lead Magnet Email', 'Studio Launch Reel'], values: [4.8, 3.9, 3.2, 2.6], suffix: 'x' },
      websiteConversions: { type: 'bar', labels: ['Bookings', 'Contact Forms', 'Email Sign-ups'], values: [73, 58, 462], suffix: '' }
    },
    websiteAnalytics: {
      metrics: [
        ['Website Visitors', '21.7k'],
        ['Sessions', '28.4k'],
        ['Users', '18.9k'],
        ['New Users', '12.4k'],
        ['Returning Visitors', '6.5k'],
        ['Average Session Duration', '2m 41s'],
        ['Bounce Rate', '38.6%'],
        ['Conversion Rate', '3.2%'],
        ['Fitting Bookings', '73'],
        ['Contact Form Enquiries', '58'],
        ['Email Sign-ups', '462']
      ],
      summary: 'Website performance is healthy. Traffic quality is improving, and the strongest upside now comes from improving conversion paths rather than simply chasing more visits.'
    },
    emailMarketing: {
      metrics: [
        ['Subscribers', '7.9k'],
        ['Subscriber Growth', '+6.8%'],
        ['Campaigns Sent', '6'],
        ['Open Rate', '42.4%'],
        ['Click Rate', '5.8%'],
        ['Unsubscribe Rate', '0.6%'],
        ['Email Sign-ups', '462'],
        ['Best Performing Campaign', 'Fitting Myths Debunked'],
        ['Lowest Performing Campaign', 'Weekly Equipment Round-up']
      ],
      bestCampaign: 'Fitting Myths Debunked',
      worstCampaign: 'Weekly Equipment Round-up',
      summary: 'Email is stable and useful, but the next growth step is to make it feel more like a strategic conversion engine than a support channel.'
    },
    campaignPerformance: {
      activeCampaigns: 4,
      completedCampaigns: 9,
      roi: '3.7x avg',
      leads: '184',
      revenueAttribution: '£18.6k',
      conversionRate: '3.9%',
      engagement: '6.8%',
      campaigns: [
        { title: 'Fitting Proof Series', stage: 'Active', roi: '4.8x', leads: '58', revenue: '£6.7k', conversion: '4.4%', engagement: '8.2%' },
        { title: 'Summer Driver Push', stage: 'Active', roi: '3.9x', leads: '41', revenue: '£4.9k', conversion: '4.1%', engagement: '6.9%' },
        { title: 'Lead Magnet Email', stage: 'Completed', roi: '3.2x', leads: '36', revenue: '£3.1k', conversion: '3.6%', engagement: '5.4%' },
        { title: 'Studio Launch Reel', stage: 'Completed', roi: '2.6x', leads: '22', revenue: '£2.4k', conversion: '2.8%', engagement: '7.1%' }
      ]
    },
    contentLibrary: {
      items: [
        { title: 'Driver Fitting Truths Every Golfer Should Know', type: 'Video', publishDate: '2026-07-02', platform: 'YouTube', views: '182k', engagement: '11.8k', rating: 'A' },
        { title: 'What a Premium Fitting Changes', type: 'Carousel', publishDate: '2026-07-01', platform: 'Instagram', views: '64k', engagement: '6.2k', rating: 'A' },
        { title: 'Why Trust Matters in Club Fitting', type: 'Blog Post', publishDate: '2026-06-28', platform: 'Website', views: '8.4k', engagement: '1.1k', rating: 'B' },
        { title: 'Fitting Myths Debunked', type: 'Email Campaign', publishDate: '2026-06-26', platform: 'Email', views: '7.1k', engagement: '2.9k', rating: 'A' },
        { title: 'Ball Flight Test Short', type: 'Short', publishDate: '2026-06-25', platform: 'YouTube', views: '94k', engagement: '5.7k', rating: 'A' },
        { title: 'Studio Day Story Sequence', type: 'Social Post', publishDate: '2026-06-24', platform: 'Instagram', views: '28k', engagement: '2.1k', rating: 'B' },
        { title: 'Weekly Equipment Round-up', type: 'Email Campaign', publishDate: '2026-06-22', platform: 'Email', views: '4.2k', engagement: '1.1k', rating: 'C' },
        { title: 'Premium Fitting Lessons for Business', type: 'LinkedIn Article', publishDate: '2026-06-20', platform: 'LinkedIn', views: '12k', engagement: '1.6k', rating: 'B' }
      ]
    },
    competitorAnalysis: {
      competitors: [
        { name: 'Club Champion UK', rank: 1, growth: '+7.2%', frequency: 'High', engagement: 'Strong', opportunity: 'Position against scale by leaning into premium trust and expertise.', threat: 'Large content footprint and high awareness.' },
        { name: 'Precision Golf', rank: 2, growth: '+5.6%', frequency: 'Medium', engagement: 'Strong', opportunity: 'Differentiate with clearer educational proof content.', threat: 'Consistent premium authority tone.' },
        { name: 'My Golf Matters', rank: 3, growth: '+4.8%', frequency: 'High', engagement: 'Medium', opportunity: 'Outperform with better quality control and stronger brand polish.', threat: 'High publishing cadence.' },
        { name: 'SGGT', rank: 4, growth: '+3.9%', frequency: 'Medium', engagement: 'Medium', opportunity: 'Win on trust, clarity, and better conversion framing.', threat: 'Niche relevance in parts of the audience.' }
      ],
      opportunities: ['Use proof-led content to stand apart from higher-volume competitors.', 'Own premium education and trust positioning more aggressively.', 'Create more reusable flagship content instead of spreading effort thinly.'],
      threats: ['Competitors with higher publishing frequency may dominate attention.', 'If EP content cadence slips, the strongest brand position may still underperform in reach.', 'Higher-volume brands can win by sheer output unless EP stays clear and distinctive.']
    },
    marketingCalendar: {
      events: [
        { date: 'Mon 6 Jul', type: 'Video', title: 'Launch driver fitting myth-busting short', owner: 'CMO', status: 'Ready for approval' },
        { date: 'Tue 7 Jul', type: 'Email Campaign', title: 'Send “Fitting Myths Debunked” follow-up email', owner: 'Marketing Ops', status: 'Draft' },
        { date: 'Wed 8 Jul', type: 'Social Posts', title: 'Instagram carousel + Facebook proof post', owner: 'Content Lead', status: 'Queued' },
        { date: 'Thu 9 Jul', type: 'Website Update', title: 'Refresh fitting landing page CTA block', owner: 'Website Lead', status: 'Needs approval' },
        { date: 'Fri 10 Jul', type: 'Event', title: 'Weekend fitting push creative review', owner: 'CMO', status: 'Scheduled' },
        { date: 'Sun 12 Jul', type: 'Weekly Briefing', title: 'Prepare weekly marketing briefing', owner: 'AI Marketing Advisor', status: 'Placeholder' }
      ]
    },
    aiMarketingAdvisor: {
      executiveSummary: {
        title: 'AI Marketing Advisor',
        summary: 'Marketing is in a strong position, but the biggest upside comes from focusing harder on top-performing channels and sharpening conversion paths between content, traffic, and enquiries.',
        evidence: 'YouTube ranks first, Instagram is the strongest visual growth platform, website traffic is up, and booking enquiries are improving.',
        confidence: 'High',
        impact: 'A more concentrated channel strategy should improve lead quality and reduce lower-value content effort.',
        risks: 'Overextending into too many platforms could dilute the return from the strongest content formats.',
        alternatives: 'Scale video-first output, optimise for conversion first, or continue with a broad but slower channel mix.',
        action: 'Prioritise video-led proof content, reinforce website conversion pathways, and stage weaker channels for lighter-touch maintenance.',
        missing: 'Live attribution, live GA4, and platform-native performance APIs remain intentionally unconnected.',
        followUp: ['What content should we make next?', 'Which platform deserves more budget?', 'Where is the biggest conversion leak?']
      },
      weeklyBriefing: 'This week’s marketing outlook is positive. The smartest next moves are to back YouTube and Instagram more aggressively, strengthen conversion points on the website, and use email more strategically as a conversion layer rather than a background channel.',
      recommendedCampaigns: [
        { title: 'Proof-led premium fitting series', confidence: 'High', impact: 'High', evidence: 'Video and social proof content are producing the strongest engagement quality.', risks: 'Requires disciplined production quality.', alternatives: 'Short-form-only approach or educational email-led sequence.' },
        { title: 'Landing page conversion refresh', confidence: 'Medium–High', impact: 'High', evidence: 'Website traffic is healthy enough to justify conversion optimisation work.', risks: 'Improvement may be limited if messaging is not strong enough.', alternatives: 'More traffic acquisition or heavier email capture work first.' }
      ],
      contentIdeas: ['“What a real fitting changes” video series', 'Instagram carousel: fitting myths vs reality', 'LinkedIn article: premium trust in golf performance'],
      seoSuggestions: ['Build more pages around fitting outcomes, shaft fitting, and premium fitting trust.', 'Strengthen internal linking from educational content into booking pages.'],
      aeoSuggestions: ['Create concise Q&A content around golf fitting questions.', 'Structure key proof points more clearly for answer-engine visibility.'],
      videoIdeas: ['Driver fitting myths', 'Before / after launch monitor proof', 'Premium fitting session breakdown'],
      opportunities: ['Repurpose strong YouTube content into higher-frequency social assets.', 'Turn educational posts into better email sign-up magnets.', 'Use social proof more directly on the website.'],
      risks: ['Weak channels continue to consume time.', 'Website traffic may not convert strongly enough without UX/CTA refinement.', 'Campaign effort may become fragmented if approvals are not prioritised.'],
      missingInformation: ['True cross-channel attribution', 'Live platform post-level data', 'Real website event-level conversion data'],
      suggestedActions: ['Approve the proof-led video content series', 'Refresh fitting CTA messaging', 'Reduce X cadence and redeploy effort into YouTube / Instagram']
    },
    reports: {
      summary: 'Marketing reports should package platform movement, content performance, website impact, campaign results, risks, and the next recommended actions into a leadership-ready narrative.',
      sections: ['Weekly marketing briefing', 'Platform ranking summary', 'Campaign wins and misses', 'Content performance highlights', 'Website and lead generation movement', 'Executive actions and approvals']
    },
    settings: {
      placeholders: ['Platform weighting', 'Default reporting views', 'Approval preferences', 'Weekly briefing cadence', 'Content scoring logic', 'Future API connections'],
      integrations: ['YouTube', 'Instagram', 'Facebook', 'LinkedIn', 'X', 'Google Analytics', 'Mailchimp']
    }
  },
  approvals: {
    groups: {
      'Finance approvals': [
        { title: 'Approve supplier payment batch', why: 'Three invoices fall due this week including fitting bay consumables.', impact: 'Preserves supplier continuity but reduces near-term cash headroom.', risk: 'Low–Medium', confidence: 'High' },
        { title: 'Approve conservative Q3 growth assumption', why: 'The current plan assumes healthy demand but tighter margin conversion.', impact: 'Creates a more prudent planning baseline.', risk: 'Low', confidence: 'Medium–High' }
      ],
      'Marketing approvals': [
        { title: 'Publish Social Post', why: 'The next premium proof carousel is ready for review before publishing.', impact: 'Supports reach and authority on the highest-traction channels.', risk: 'Low', confidence: 'High' },
        { title: 'Publish YouTube Video', why: 'The next long-form fitting education video is prepared and staged for release.', impact: 'Expected to improve authority, views, and downstream enquiries.', risk: 'Medium', confidence: 'High' },
        { title: 'Schedule Email Campaign', why: 'A high-performing educational email follow-up is prepared for the current list.', impact: 'Supports subscriber engagement and lead conversion.', risk: 'Low', confidence: 'Medium–High' },
        { title: 'Update Website', why: 'The fitting landing page CTA and proof blocks are ready for a conversion refresh.', impact: 'Could improve bookings and enquiry conversion from existing traffic.', risk: 'Medium', confidence: 'Medium–High' },
        { title: 'Generate Blog Post', why: 'A premium-fitting educational article concept is ready to move into production.', impact: 'Supports SEO, brand authority, and content reuse.', risk: 'Low', confidence: 'Medium' },
        { title: 'Create LinkedIn Article', why: 'A thought-leadership article is staged to strengthen premium positioning for a professional audience.', impact: 'Improves authority and supports brand trust.', risk: 'Low', confidence: 'Medium' }
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
      sections: ['Month-on-month business movement', 'Cross-functional KPI highlights', 'Key approvals accepted / rejected', 'Leadership narrative and next-step recommendations']
    },
    cfoReports: ['Financial performance pack', 'Working capital summary', 'Cash and forecast note', 'Risk and approvals appendix'],
    cmoReports: ['Platform ranking summary', 'Traffic and conversion movement', 'Campaign performance pack', 'Content and approval recommendations'],
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
      '/ai-assistant/ask': { description: 'This placeholder page will eventually let leaders ask direct questions across finance, marketing, sales, operations, and projects.', exampleMetrics: ['Questions answered by module', 'Confidence score', 'Follow-up depth'], exampleInsights: ['Why did margin compress?', 'What changed since last week?', 'Where should leadership focus next?'], exampleActions: ['Stage a CFO review', 'Open a related report', 'Request assumption review'] },
      '/ai-assistant/executive-briefing': { description: 'This placeholder page will eventually generate concise executive briefings spanning the whole business.', exampleMetrics: ['Briefing freshness', 'Coverage by module', 'Leadership priority count'], exampleInsights: ['Health score movement', 'Cross-functional changes', 'Recommended executive focus'], exampleActions: ['Create weekly pack', 'Open board view', 'Review priorities'] },
      '/ai-assistant/follow-up-questions': { description: 'This placeholder page will eventually surface the best next questions to ask after a report or recommendation.', exampleMetrics: ['Suggested follow-ups', 'Decision depth', 'Outstanding unknowns'], exampleInsights: ['What should we challenge next?', 'Which assumption is weakest?', 'What evidence would change confidence?'], exampleActions: ['Open assumptions', 'Open missing information', 'Escalate to approval'] },
      '/ai-assistant/suggested-actions': { description: 'This placeholder page will eventually collect AI-suggested actions without ever executing automatically.', exampleMetrics: ['Open suggestions', 'Pending approvals', 'Action categories'], exampleInsights: ['Top recommended actions this week', 'Most urgent staged decisions', 'Cross-functional dependencies'], exampleActions: ['Approve', 'Return for review', 'Hold in draft'] },
      '/ai-assistant/assumptions': { description: 'This placeholder page will eventually show the assumptions behind every key AI recommendation.', exampleMetrics: ['Assumptions tracked', 'High-risk assumptions', 'Confidence sensitivity'], exampleInsights: ['Which assumptions matter most?', 'What would change the forecast?', 'Where is the reasoning fragile?'], exampleActions: ['Challenge assumption', 'Request more evidence', 'Update briefing'] },
      '/ai-assistant/missing-information': { description: 'This placeholder page will eventually show what the AI layer still does not know.', exampleMetrics: ['Open data gaps', 'Unknowns affecting confidence', 'Blocked recommendations'], exampleInsights: ['Why confidence is limited', 'Which missing data matters most', 'What evidence would improve output'], exampleActions: ['Mark for review', 'Request data source', 'Keep as placeholder'] },
      '/ai-assistant/memory-context': { description: 'This placeholder page will eventually explain how executive memory, context, and longitudinal reasoning are maintained.', exampleMetrics: ['Context windows', 'Saved decisions', 'Historical briefing references'], exampleInsights: ['What leadership already decided', 'What lessons should persist', 'Which themes are recurring'], exampleActions: ['Open decision journal', 'Review prior reports', 'Pin context item'] }
    }
  },
  placeholders: {
    '/coo': { module: 'COO', description: 'This module will eventually track operational execution, fulfilment quality, service capacity, process friction, and delivery reliability.', metrics: ['Capacity usage', 'Workflow bottlenecks', 'Operational turnaround time', 'Delivery quality'], insights: ['Where is execution slowing down?', 'Which process changes would reduce friction?', 'What is threatening consistency?'], actions: ['Approve process changes', 'Prioritise service improvements', 'Review delivery risk areas'], status: 'Mock placeholder only' },
    '/sales': { module: 'Sales', description: 'This module will eventually track pipeline health, conversion quality, revenue potential, pricing discipline, and commercial execution.', metrics: ['Pipeline value', 'Conversion rate', 'Average deal value', 'Sales cycle speed'], insights: ['Where is conversion improving?', 'Which deals need executive attention?', 'How is pricing affecting margin?'], actions: ['Approve pricing exceptions', 'Review large opportunities', 'Challenge pipeline assumptions'], status: 'Mock placeholder only' },
    '/customer-success': { module: 'Customer Success', description: 'This module will eventually track retention, customer satisfaction, service quality, referral strength, and long-term loyalty.', metrics: ['Customer health', 'Retention rate', 'Service quality', 'Referral activity'], insights: ['Where is customer experience strongest?', 'What could weaken loyalty?', 'Which accounts need proactive attention?'], actions: ['Approve service improvements', 'Review churn-risk interventions', 'Prioritise follow-up actions'], status: 'Mock placeholder only' },
    '/operations': { module: 'Operations', description: 'This module will eventually track workflow coordination, throughput, execution discipline, system friction, and operational visibility.', metrics: ['Throughput', 'Cycle time', 'Open blockers', 'Execution consistency'], insights: ['What is slowing execution?', 'Which bottlenecks are systemic?', 'Where would better tooling help most?'], actions: ['Approve workflow changes', 'Review bottlenecks', 'Prioritise process improvements'], status: 'Mock placeholder only' },
    '/hr': { module: 'HR', description: 'This module will eventually track staffing, role clarity, capability needs, workload, and people health across the business.', metrics: ['Capacity coverage', 'Hiring status', 'Team sentiment', 'Training priorities'], insights: ['Where is capacity stretched?', 'What capability is missing?', 'Which leadership risks are people-related?'], actions: ['Approve hiring plans', 'Review role changes', 'Prioritise development actions'], status: 'Mock placeholder only' },
    '/projects': { module: 'Projects', description: 'This module will eventually track strategic initiatives, ownership, deadlines, dependencies, and executive project risk.', metrics: ['Active projects', 'On-track rate', 'Blocked work', 'Upcoming deadlines'], insights: ['Which projects matter most now?', 'Where are dependencies creating risk?', 'What needs executive unblock?'], actions: ['Approve project priorities', 'Review timelines', 'Escalate blocked initiatives'], status: 'Mock placeholder only' }
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
    { keys: 'G M', action: 'Jump to CMO' },
    { keys: 'G R', action: 'Jump to Reports' },
    { keys: 'Esc', action: 'Close overlays and mobile nav' }
  ]
};
