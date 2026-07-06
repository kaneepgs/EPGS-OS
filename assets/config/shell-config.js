export const TOP_LEVEL_NAV = [
  ['/ceo', 'CEO Dashboard', 'home'],
  ['/executive-action-centre', 'Executive Action Centre', 'check-circle'],
  ['/executive-copilot', 'Executive Copilot', 'sparkles'],
  ['/executive-inbox', 'Executive Inbox', 'mail'],
  ['/cfo', 'CFO', 'coins'],
  ['/cmo', 'CMO', 'sparkles'],
  ['/coo', 'COO', 'building'],
  ['/sales', 'Sales', 'trending-up'],
  ['/customer-success', 'Customer Success', 'pulse'],
  ['/operations', 'Operations', 'grid'],
  ['/hr', 'HR', 'book-open'],
  ['/projects', 'Projects', 'target'],
  ['/approvals', 'Approvals', 'check-circle'],
  ['/reports', 'Reports', 'presentation'],
  ['/settings', 'Settings', 'settings']
];

export const SUBNAV = {
  executiveInbox: [
    ['/executive-inbox', 'Overview']
  ],
  executiveActionCentre: [
    ['/executive-action-centre', 'Overview'],
    ['/executive-action-centre/queue', 'Executive Queue'],
    ['/executive-action-centre/action-detail', 'Action Detail'],
    ['/executive-action-centre/approval-workflow', 'Approval Workflow']
  ],
  executiveCopilot: [
    ['/executive-copilot', 'Overview'],
    ['/executive-copilot/ask', 'Ask EP Hub'],
    ['/executive-copilot/executive-briefing', 'Executive Briefing'],
    ['/executive-copilot/memory-context', 'Memory Context']
  ],
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
    ['/reports/executive-actions', 'Executive Actions Report'],
    ['/reports/outstanding-approvals', 'Outstanding Approvals'],
    ['/reports/decision-history', 'Decision History'],
    ['/reports/action-analytics', 'Action Analytics'],
    ['/reports/approval-performance', 'Approval Performance'],
    ['/reports/department-workload', 'Department Workload'],
    ['/reports/weekly-briefings', 'Weekly Briefings'],
    ['/reports/executive-timeline', 'Executive Timeline'],
    ['/reports/decision-journal', 'Decision Journal'],
    ['/reports/strategic-goals', 'Strategic Goals'],
    ['/reports/monthly-reports', 'Monthly Reports'],
    ['/reports/quarterly-reviews', 'Quarterly Reviews'],
    ['/reports/board-meeting', 'Board Meeting Mode'],
    ['/reports/cfo-reports', 'CFO Reports'],
    ['/reports/cmo-reports', 'CMO Reports'],
    ['/reports/ceo-reports', 'CEO Reports']
  ],
  aiAssistant: [
    ['/ai-assistant', 'Overview'],
    ['/ai-assistant/ask', 'Ask EP Hub'],
    ['/ai-assistant/executive-briefing', 'Executive Briefing'],
    ['/ai-assistant/follow-up-questions', 'Follow-up Questions'],
    ['/ai-assistant/suggested-actions', 'Suggested Actions'],
    ['/ai-assistant/assumptions', 'Assumptions'],
    ['/ai-assistant/missing-information', 'Missing Information'],
    ['/ai-assistant/memory-context', 'AI Memory / Context']
  ],
  settings: [
    ['/settings', 'Overview'],
    ['/settings/integrations', 'Integration Status'],
    ['/settings/configuration', 'Demo Mode Configuration'],
    ['/settings/action-centre', 'Action Centre Settings'],
    ['/settings/provider-architecture', 'Provider Architecture'],
    ['/settings/about', 'About']
  ]
};

export const MODE_OPTIONS = [
  ['executive', 'Executive View', '/ceo'],
  ['board', 'Board View', '/reports/board-meeting']
];

export const ROUTE_META = {
  '/ceo': { title: 'CEO Dashboard', subtitle: 'The executive home view for the whole business.', module: 'CEO Dashboard', sidebarKey: '/ceo', parentLabel: 'CEO Dashboard' },
  '/executive-action-centre': { title: 'Executive Action Centre', subtitle: 'The single approval-first operating queue for what the business needs next.', module: 'Executive Action Centre', sidebarKey: '/executive-action-centre', parentLabel: 'Executive Action Centre' },
  '/executive-action-centre/queue': { title: 'Executive Queue', subtitle: 'My Queue, today, urgent work, and approval-stage items in one ranked view.', module: 'Executive Action Centre', sidebarKey: '/executive-action-centre', parentLabel: 'Executive Action Centre' },
  '/executive-action-centre/action-detail': { title: 'Action Detail', subtitle: 'The full decision workspace for one executive action, including evidence, memory, recommendations, and linked providers.', module: 'Executive Action Centre', sidebarKey: '/executive-action-centre', parentLabel: 'Executive Action Centre' },
  '/executive-action-centre/approval-workflow': { title: 'Approval Workflow', subtitle: 'How actions move through approval-first review without automatic execution.', module: 'Executive Action Centre', sidebarKey: '/executive-action-centre', parentLabel: 'Executive Action Centre' },
  '/executive-copilot': { title: 'Executive Copilot', subtitle: 'The action-oriented conversational layer sitting on top of providers, services, intelligence, memory, and the knowledge graph.', module: 'Executive Copilot', sidebarKey: '/executive-copilot', parentLabel: 'Executive Copilot' },
  '/executive-copilot/ask': { title: 'Ask EP Hub', subtitle: 'A conversational executive workspace for action-ready business questions and explainable answers.', module: 'Executive Copilot', sidebarKey: '/executive-copilot', parentLabel: 'Executive Copilot' },
  '/executive-copilot/executive-briefing': { title: 'Executive Briefing', subtitle: 'A compiled leadership briefing spanning queue pressure, finance, marketing, inbox, and operations.', module: 'Executive Copilot', sidebarKey: '/executive-copilot', parentLabel: 'Executive Copilot' },
  '/executive-copilot/memory-context': { title: 'Memory Context', subtitle: 'Searchable memory, action history, and knowledge graph context for Executive Copilot.', module: 'Executive Copilot', sidebarKey: '/executive-copilot', parentLabel: 'Executive Copilot' },
  '/executive-inbox': { title: 'Executive Inbox', subtitle: 'Deterministic executive communications intelligence built from Gmail-style inbox triage.', module: 'Executive Inbox', sidebarKey: '/executive-inbox', parentLabel: 'Executive Inbox' },

  '/cfo': { title: 'CFO Workspace', subtitle: 'A complete finance module inside the wider EP Hub shell.', module: 'CFO', sidebarKey: '/cfo', parentLabel: 'CFO' },
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
  '/cmo/campaign-performance': { title: 'Campaign Performance', subtitle: 'Active campaigns, ROI, leads, deterministic attribution, and revenue visibility.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/cmo/content-library': { title: 'Content Library', subtitle: 'A searchable content inventory spanning video, social, blog, and email assets.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/cmo/competitor-analysis': { title: 'Competitor Analysis', subtitle: 'Competitive positioning, benchmark pressure, and strategic watchpoints.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/cmo/marketing-calendar': { title: 'Marketing Calendar', subtitle: 'A visual planning layer for campaigns, content, launches, and events.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/cmo/ai-marketing-advisor': { title: 'AI Marketing Advisor', subtitle: 'The AI strategy and recommendation workspace for marketing leadership.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/cmo/reports': { title: 'Marketing Reports', subtitle: 'The marketing reporting surface for weekly briefings, source clarity, and marketing intelligence packs.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/cmo/settings': { title: 'CMO Settings', subtitle: 'Preferences, placeholders, and future marketing integration settings.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },

  '/coo': { title: 'COO Module', subtitle: 'Future operating execution, delivery capacity, and process performance.', module: 'COO', sidebarKey: '/coo', parentLabel: 'COO' },
  '/sales': { title: 'Sales Module', subtitle: 'Future pipeline, conversion, and commercial performance intelligence.', module: 'Sales', sidebarKey: '/sales', parentLabel: 'Sales' },
  '/customer-success': { title: 'Customer Success Module', subtitle: 'Future retention, experience, and customer health intelligence.', module: 'Customer Success', sidebarKey: '/customer-success', parentLabel: 'Customer Success' },
  '/operations': { title: 'Operations Calendar', subtitle: 'Executive operational intelligence for today’s schedule, capacity, workload, deadlines, and scheduling risk.', module: 'Operations', sidebarKey: '/operations', parentLabel: 'Operations' },
  '/hr': { title: 'HR Module', subtitle: 'Future staffing, capability, and people operations intelligence.', module: 'HR', sidebarKey: '/hr', parentLabel: 'HR' },
  '/projects': { title: 'Projects Module', subtitle: 'Future roadmap, ownership, and execution tracking.', module: 'Projects', sidebarKey: '/projects', parentLabel: 'Projects' },

  '/ai-assistant': { title: 'Executive Copilot', subtitle: 'Legacy alias for the executive AI layer, now superseded by Executive Copilot.', module: 'Executive Copilot', sidebarKey: '/executive-copilot', parentLabel: 'Executive Copilot' },
  '/ai-assistant/ask': { title: 'Ask EP Hub', subtitle: 'Legacy alias for the conversational executive workspace.', module: 'Executive Copilot', sidebarKey: '/executive-copilot', parentLabel: 'Executive Copilot' },
  '/ai-assistant/executive-briefing': { title: 'Executive Briefing', subtitle: 'Legacy alias for the compiled leadership briefing.', module: 'Executive Copilot', sidebarKey: '/executive-copilot', parentLabel: 'Executive Copilot' },
  '/ai-assistant/follow-up-questions': { title: 'Follow-up Questions', subtitle: 'Legacy placeholder route retained for compatibility.', module: 'Executive Copilot', sidebarKey: '/executive-copilot', parentLabel: 'Executive Copilot' },
  '/ai-assistant/suggested-actions': { title: 'Suggested Actions', subtitle: 'Legacy placeholder route retained for compatibility.', module: 'Executive Copilot', sidebarKey: '/executive-copilot', parentLabel: 'Executive Copilot' },
  '/ai-assistant/assumptions': { title: 'Assumptions', subtitle: 'Legacy placeholder route retained for compatibility.', module: 'Executive Copilot', sidebarKey: '/executive-copilot', parentLabel: 'Executive Copilot' },
  '/ai-assistant/missing-information': { title: 'Missing Information', subtitle: 'Legacy placeholder route retained for compatibility.', module: 'Executive Copilot', sidebarKey: '/executive-copilot', parentLabel: 'Executive Copilot' },
  '/ai-assistant/memory-context': { title: 'AI Memory / Context', subtitle: 'Legacy alias for executive memory and knowledge-graph coverage.', module: 'Executive Copilot', sidebarKey: '/executive-copilot', parentLabel: 'Executive Copilot' },

  '/approvals': { title: 'Approvals', subtitle: 'A central, business-wide approval centre spanning functions.', module: 'Approvals', sidebarKey: '/approvals', parentLabel: 'Approvals' },

  '/reports': { title: 'Reports', subtitle: 'Weekly, monthly, quarterly, and board-ready reporting outputs.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/executive-actions': { title: 'Executive Actions Report', subtitle: 'A packaged view of active actions, backlog, ownership, and what leadership should do next.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/outstanding-approvals': { title: 'Outstanding Approvals', subtitle: 'Approval-stage work grouped into the items that deserve immediate executive review.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/decision-history': { title: 'Decision History', subtitle: 'Approved, rejected, and completed action outcomes now retained as searchable executive history.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/action-analytics': { title: 'Action Analytics', subtitle: 'Backlog shape, approval pressure, and action throughput across the operating system.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/approval-performance': { title: 'Approval Performance', subtitle: 'How fast and how selectively executive decisions are moving through the action layer.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/department-workload': { title: 'Department Workload', subtitle: 'Active and urgent action distribution by department.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/weekly-briefings': { title: 'Weekly Briefings', subtitle: 'Board-style Sunday briefing experience.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/executive-timeline': { title: 'Executive Timeline', subtitle: 'Permanent executive timeline of milestones, launches, decisions, and strategic events.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/decision-journal': { title: 'Decision Journal', subtitle: 'Structured executive decision memory with reasons, expected outcomes, and future actual outcomes.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/strategic-goals': { title: 'Strategic Goals', subtitle: 'Persistent business goals linked to metrics, decisions, and progress.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/monthly-reports': { title: 'Monthly Reports', subtitle: 'A placeholder monthly leadership report surface.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/quarterly-reviews': { title: 'Quarterly Reviews', subtitle: 'Prepared board paper for the quarter just gone.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/board-meeting': { title: 'Board Meeting Mode', subtitle: 'A presentation-ready board view with keyboard navigation and executive slides.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/cfo-reports': { title: 'CFO Reports', subtitle: 'A placeholder hub for finance-specific reports.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/cmo-reports': { title: 'Marketing Intelligence Report', subtitle: 'A packaged executive marketing report spanning GA4, YouTube, Unified Social, attribution, benchmarking, risks, and actions.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/ceo-reports': { title: 'CEO Reports', subtitle: 'A placeholder hub for CEO-level reports and summaries.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },

  '/settings': { title: 'Settings', subtitle: 'Prototype controls for shell behaviour, preferences, and future integrations.', module: 'Settings', sidebarKey: '/settings', parentLabel: 'Settings' },
  '/settings/integrations': { title: 'Integration Status', subtitle: 'Live, demo, and readiness status for registered executive integrations.', module: 'Settings', sidebarKey: '/settings', parentLabel: 'Settings' },
  '/settings/configuration': { title: 'Demo Mode Configuration', subtitle: 'Runtime mode, provider bindings, and service activation overview.', module: 'Settings', sidebarKey: '/settings', parentLabel: 'Settings' },
  '/settings/action-centre': { title: 'Action Centre Settings', subtitle: 'Priority rules, confidence thresholds, approval defaults, routing, and retention for the executive operating system.', module: 'Settings', sidebarKey: '/settings', parentLabel: 'Settings' },
  '/settings/provider-architecture': { title: 'Provider Architecture', subtitle: 'Presentation, service, and provider layer overview for future integrations.', module: 'Settings', sidebarKey: '/settings', parentLabel: 'Settings' },
  '/settings/about': { title: 'About EP Hub', subtitle: 'Release metadata, governance references, and platform positioning.', module: 'Settings', sidebarKey: '/settings', parentLabel: 'Settings' }
};

export const QUESTION_SETS = {
  '/ceo': {
    what: ['The business is healthy, but only a few things deserve attention', 'The CEO Dashboard now distils the business into the handful of changes and decisions that actually matter today.'],
    why: ['Cross-functional signals are moving together', 'Finance, marketing, customer trust, approvals, and execution are now influencing each other rather than behaving like isolated dashboards.'],
    matters: ['Yes — because clarity beats volume', 'The CEO should see the business through an AI Chief of Staff lens, not through a wall of disconnected metrics.'],
    next: ['Prioritise the most valuable decisions first', 'Use the dashboard to decide what to approve, what to challenge, and what deserves deeper review in another module.']
  },
  '/executive-action-centre': {
    what: ['The action backlog is now the operating system', 'The Executive Action Centre replaces tab-hopping with one ranked queue of explainable actions.'],
    why: ['Provider signals are being turned into reviewable actions', 'GA4, YouTube, social, Gmail, calendar, finance, memory, and knowledge-graph context are now merged into one approval-first workflow.'],
    matters: ['Yes, because the CEO needs sequence, not volume', 'The core job is to show what should happen next and why it deserves attention now.'],
    next: ['Work the queue in order of value and urgency', 'Approve, reject, delegate, or defer the highest-value actions instead of manually stitching routes together.']
  },
  '/executive-action-centre/queue': {
    what: ['The queue is segmented for decision speed', 'My Queue, today, urgent work, and waiting items are split into practical leadership buckets.'],
    why: ['Not every action deserves the same timing', 'The operating system now ranks work by urgency, owner, risk, and due date.'],
    matters: ['Yes, because ordering changes outcomes', 'A good queue reduces decision drag and keeps executive attention on the few things that matter most.'],
    next: ['Clear the highest-value bucket first', 'Handle urgent and waiting items before expanding into the longer weekly queue.']
  },
  '/executive-action-centre/action-detail': {
    what: ['Every action now has a full decision workspace', 'The action detail view shows executive context, evidence, alternatives, history, and linked providers together.'],
    why: ['Approval quality depends on explanation quality', 'The product should make it easy to challenge a recommendation before approving anything.'],
    matters: ['Yes, because hidden logic creates weak decisions', 'If an action cannot explain itself, it should not lead the executive queue.'],
    next: ['Review the evidence, risk, and recommended outcome', 'Approve, reject, edit, delegate, or defer only after the action is fully understood.']
  },
  '/executive-action-centre/approval-workflow': {
    what: ['Workflow now stays approval-first end to end', 'Actions move through review, evidence, memory, and adapter preparation without executing automatically.'],
    why: ['Governance comes before automation', 'v2.0 prepares the operating system for future one-click execution without giving up executive control.'],
    matters: ['Yes, because trust is structural', 'The CEO should know exactly what can happen, what cannot happen, and why.'],
    next: ['Use workflow to move decisions forward deliberately', 'Approve, reject, or delegate actions while keeping execution adapters locked.']
  },
  '/executive-copilot': {
    what: ['The Copilot is now action-oriented', 'Executive Copilot answers with queue-aware, memory-backed guidance rather than generic commentary.'],
    why: ['It now sits on top of the full architecture', 'Questions resolve through providers, services, intelligence, memory, and the knowledge graph.'],
    matters: ['Yes, because explanation quality changes decision quality', 'Leadership can now challenge recommendations and still keep the answer anchored to evidence.'],
    next: ['Ask what to focus on next', 'Use the Copilot to move from understanding into action, approvals, and follow-through.']
  },
  '/executive-copilot/ask': {
    what: ['Executive questions now resolve into actions', 'Ask EP Hub now answers with operating guidance, not just commentary.'],
    why: ['The question layer now sees the queue and memory', 'Copilot can reason across provider data, historical context, and approval-stage work together.'],
    matters: ['Yes, because questions should shorten the path to action', 'A strong answer should make the next decision clearer, not just summarise the problem.'],
    next: ['Use the prompt library to pressure-test priorities', 'Ask what deserves approval now, what is creating drag, and what can wait.']
  },
  '/executive-copilot/executive-briefing': {
    what: ['The briefing now includes queue pressure', 'It packages action backlog, approvals, inbox pressure, finance, marketing, and operations in one leadership readout.'],
    why: ['Cross-functional pressure is more useful when synthesised', 'The CEO should not have to mentally merge dashboards to understand the current operating week.'],
    matters: ['Yes, because leadership needs synthesis not tabs', 'A better briefing improves approval quality and reduces distracted navigation.'],
    next: ['Use the briefing to choose the next approvals', 'Challenge the key risks, approve the best actions, and decide which route deserves deeper review next.']
  },
  '/executive-copilot/memory-context': {
    what: ['Copilot can now see action history and memory together', 'Historical context, decisions, timeline events, and action search are now one explainable substrate.'],
    why: ['The business should remember what it already learned', 'Memory and graph context stop the operating system from making context-free recommendations.'],
    matters: ['Yes, because repeated decisions should get smarter', 'The operating system improves when prior approvals, rejections, and milestones stay visible.'],
    next: ['Use this route to challenge recommendation quality', 'Check whether the current action lines up with prior decisions, risks, and recurring themes.']
  },
  '/executive-inbox': {
    what: ['The inbox now shows only the conversations that deserve executive attention', 'Executive Inbox turns Gmail-style message volume into a ranked operating view for customer replies, supplier issues, finance threads, and booking demand.'],
    why: ['Deterministic triage rules are surfacing the right conversations', 'Category, priority, age, and reply-state rules now separate strategic inbox work from background email noise.'],
    matters: ['Yes, because communications shape commercial outcomes', 'Slow replies can reduce trust, delay bookings, and hide supplier or finance issues that should be visible earlier.'],
    next: ['Clear the highest-value conversations first', 'Use the inbox to stage replies, approvals, follow-ups, and tasks without executing anything automatically.']
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
    what: ['Marketing reporting now has a proper intelligence pack', 'GA4, YouTube, source coverage, risks, and recommended actions are now packaged as a reusable executive report.'],
    why: ['Marketing needs packaging, not just dashboards', 'Leadership often needs a clean narrative pack rather than raw platform metrics.'],
    matters: ['Yes, because reporting quality shapes confidence', 'A strong marketing report should explain what is live, what is still demo, and what leadership should do next.'],
    next: ['Use reports to support approvals and weekly review', 'Treat these outputs as the narrative layer that supports broader executive decision-making.']
  },
  '/approvals': {
    what: ['Approvals are centralised across the business', 'Finance, marketing, sales, operations, and AI-generated actions now sit in one executive review surface.'],
    why: ['Approval-first governance protects quality', 'The operating system is designed to stage decisions before any future automation exists.'],
    matters: ['Yes, because governance quality is strategic', 'A single approval centre gives leadership one calm place to review decisions that matter.'],
    next: ['Prioritise high-impact approvals', 'Review the approvals most likely to affect cash, growth quality, content output, or executive confidence.']
  },
  '/operations': {
    what: ['The operating day is now visible, not guessed', 'Operations Calendar converts today’s schedule, fittings, meetings, travel, deadlines, and free capacity into one CEO-ready operating surface.'],
    why: ['Live scheduling data reveals workload shape', 'Capacity, back-to-back bookings, utilisation, and deadline pressure now come from deterministic calendar logic rather than placeholder copy.'],
    matters: ['Yes, because schedule quality affects commercial quality', 'A busy diary is not automatically good. Leadership needs to see when demand is healthy, when capacity is under-used, and when service quality is about to be squeezed.'],
    next: ['Protect the best schedule decisions first', 'Use this view to reschedule compression, protect buffers, and convert free fitting capacity into revenue without creating avoidable operating strain.']
  },
  '/reports': {
    what: ['Executive reporting is now memory-backed', 'Reports package current performance alongside historical context, goal progress, and prior decisions.'],
    why: ['Leadership needs reporting that remembers', 'A strong report should explain not just what changed, but what the business has already learned and committed to.'],
    matters: ['Yes, because executive memory improves decision quality', 'Historical context helps leadership separate one-off movement from repeat patterns.'],
    next: ['Use reports to review decisions, trends, and goals together', 'Open the relevant report route depending on whether the priority is briefing, timeline, actions, or board discussion.']
  },
  '/reports/executive-actions': {
    what: ['The action backlog is now reportable', 'Executive Actions Report packages active actions, urgent work, and queue shape into one leadership summary.'],
    why: ['Leadership needs more than a live queue', 'A report helps the business review operating pressure over time instead of only in the moment.'],
    matters: ['Yes, because backlog quality is strategic', 'If the queue becomes bloated or mis-ranked, the operating system stops being useful.'],
    next: ['Use the report to challenge queue quality', 'Review what is active, what is urgent, and whether the top items truly deserve priority.']
  },
  '/reports/outstanding-approvals': {
    what: ['Approval-stage work is now packaged separately', 'Outstanding Approvals shows the decisions waiting for leadership in one clean review surface.'],
    why: ['Approval drag is now visible', 'The system should show where governance is slowing action and where caution is healthy.'],
    matters: ['Yes, because approval latency changes momentum', 'Slow decisions can hurt customer conversion, marketing timing, and operating quality.'],
    next: ['Clear the most valuable approvals first', 'Use the report to keep approval-first governance disciplined rather than slow.']
  },
  '/reports/decision-history': {
    what: ['Approved, rejected, and completed actions are now history objects', 'Decision History keeps the operating system from forgetting what leadership already decided.'],
    why: ['The platform should learn from executive behaviour', 'Each action outcome can now feed memory, timeline, and future context.'],
    matters: ['Yes, because repeated decisions should improve', 'Decision quality compounds when prior outcomes remain easy to inspect.'],
    next: ['Review what leadership is approving and rejecting', 'Use this route to spot patterns, discipline, and recurring blind spots.']
  },
  '/reports/action-analytics': {
    what: ['The action system can now analyse itself', 'Action Analytics measures backlog shape, approval pressure, and where executive time is going.'],
    why: ['An operating system should expose its own behaviour', 'Leadership should know whether queue design is helping or hurting decision speed.'],
    matters: ['Yes, because process quality affects business quality', 'If the queue is noisy, the business loses clarity even when the data is right.'],
    next: ['Use analytics to refine queue rules', 'Tighten priority, reduce noise, and keep the action layer selective.']
  },
  '/reports/approval-performance': {
    what: ['Approval performance is now measurable', 'The business can now see how quickly and how selectively approvals are moving.'],
    why: ['Governance should be visible, not assumed', 'Approval behaviour shapes cash, campaigns, replies, and delivery quality.'],
    matters: ['Yes, because executive control should not become executive delay', 'Good approval systems remain cautious without becoming slow.'],
    next: ['Challenge low-value or slow approvals', 'Use the report to tighten decision speed while preserving control.']
  },
  '/reports/department-workload': {
    what: ['Department action pressure is now visible', 'Department Workload shows where active and urgent work are accumulating.'],
    why: ['Leadership needs to spot strain before it becomes performance drag', 'Workload view links executive actions back to the teams carrying them.'],
    matters: ['Yes, because queue pressure becomes operational pressure', 'A healthy business should show where bottlenecks or overload are emerging.'],
    next: ['Rebalance or escalate where pressure is highest', 'Use this route to decide where support, delegation, or focus is needed next.']
  },
  '/reports/executive-timeline': {
    what: ['The business now has a permanent executive timeline', 'Major milestones, launches, decisions, and system events are now stored independently of any current provider feed.'],
    why: ['Leadership needs chronology, not just snapshots', 'Timeline memory makes it easier to see what actually happened, in what order, and with what impact.'],
    matters: ['Yes, because context changes interpretation', 'A revenue spike means more when it follows the launch of a successful campaign or a structural decision.'],
    next: ['Use the timeline to ground decisions in history', 'Check what happened before, what it influenced, and what should be remembered next time.']
  },
  '/reports/decision-journal': {
    what: ['Decisions are now structured memory objects', 'Each decision captures the reason, expected outcome, actual outcome, ownership, and linked KPIs.'],
    why: ['The business should learn from decisions, not just make them', 'Structured decision memory makes review and improvement possible later.'],
    matters: ['Yes, because repeated decisions should get smarter', 'Leadership should not have to rediscover the same lessons every quarter.'],
    next: ['Use the journal to review what worked, what did not, and what remains active', 'Link future decisions back to the relevant goals and recurring issues.']
  },
  '/reports/strategic-goals': {
    what: ['Strategic goals are now persistent, linked objects', 'Goals track progress, ownership, deadlines, linked metrics, and supporting decisions.'],
    why: ['A dashboard needs a destination, not just a status readout', 'Goals turn activity and decisions into a longer-term executive direction.'],
    matters: ['Yes, because progress without strategic context can be misleading', 'Leadership needs to know whether the most important goals are actually moving.'],
    next: ['Use goals to decide where to focus leadership time next', 'Review what is on track, what needs intervention, and which decisions unblock the biggest outcomes.']
  },
  '/reports/cmo-reports': {
    what: ['This is now the Marketing Intelligence Report', 'It packages live GA4, live YouTube, deterministic cross-channel findings, risks, actions, and memory milestones into one executive marketing readout.'],
    why: ['Leadership needs one clear marketing narrative', 'The point is to explain what is happening, why it matters, and what should be approved next without forcing the CEO or CMO to stitch pages together manually.'],
    matters: ['Yes, because hybrid live/demo reporting needs clarity', 'Decision quality improves when the report makes source coverage, confidence, and the conversion gap explicit.'],
    next: ['Use the report to sequence action', 'Review source coverage, challenge the risks, and move the strongest recommended actions into the approval flow.']
  },
  '/settings/action-centre': {
    what: ['The operating system now has queue rules', 'Action Centre Settings controls how priority, confidence, routing, retention, and notifications should work.'],
    why: ['Queue quality depends on explicit rules', 'If the settings are vague, the Executive Action Centre becomes noisy or inconsistent.'],
    matters: ['Yes, because governance is product behaviour', 'Settings determine how disciplined and explainable the operating system feels.'],
    next: ['Use settings to keep the queue selective', 'Tune thresholds and routing so the action layer remains genuinely useful to leadership.']
  }
};
