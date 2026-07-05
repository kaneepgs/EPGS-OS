export const TOP_LEVEL_NAV = [
  ['/ceo', 'CEO Dashboard', 'home'],
  ['/executive-inbox', 'Executive Inbox', 'mail'],
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
  executiveInbox: [
    ['/executive-inbox', 'Overview']
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
    ['/ai-assistant/ask', 'Ask EP Intelligence'],
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
  '/executive-inbox': { title: 'Executive Inbox', subtitle: 'Deterministic executive communications intelligence built from Gmail-style inbox triage.', module: 'Executive Inbox', sidebarKey: '/executive-inbox', parentLabel: 'Executive Inbox' },

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
  '/cmo/reports': { title: 'Marketing Reports', subtitle: 'The marketing reporting surface for weekly briefings, source clarity, and marketing intelligence packs.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },
  '/cmo/settings': { title: 'CMO Settings', subtitle: 'Preferences, placeholders, and future marketing integration settings.', module: 'CMO', sidebarKey: '/cmo', parentLabel: 'CMO' },

  '/coo': { title: 'COO Module', subtitle: 'Future operating execution, delivery capacity, and process performance.', module: 'COO', sidebarKey: '/coo', parentLabel: 'COO' },
  '/sales': { title: 'Sales Module', subtitle: 'Future pipeline, conversion, and commercial performance intelligence.', module: 'Sales', sidebarKey: '/sales', parentLabel: 'Sales' },
  '/customer-success': { title: 'Customer Success Module', subtitle: 'Future retention, experience, and customer health intelligence.', module: 'Customer Success', sidebarKey: '/customer-success', parentLabel: 'Customer Success' },
  '/operations': { title: 'Operations Calendar', subtitle: 'Executive operational intelligence for today’s schedule, capacity, workload, deadlines, and scheduling risk.', module: 'Operations', sidebarKey: '/operations', parentLabel: 'Operations' },
  '/hr': { title: 'HR Module', subtitle: 'Future staffing, capability, and people operations intelligence.', module: 'HR', sidebarKey: '/hr', parentLabel: 'HR' },
  '/projects': { title: 'Projects Module', subtitle: 'Future roadmap, ownership, and execution tracking.', module: 'Projects', sidebarKey: '/projects', parentLabel: 'Projects' },

  '/ai-assistant': { title: 'AI Assistant', subtitle: 'The executive AI layer for questions, reasoning, assumptions, and follow-up.', module: 'AI Assistant', sidebarKey: '/ai-assistant', parentLabel: 'AI Assistant' },
  '/ai-assistant/ask': { title: 'Ask EP Intelligence', subtitle: 'A conversational executive workspace for business questions and AI reasoning.', module: 'AI Assistant', sidebarKey: '/ai-assistant', parentLabel: 'AI Assistant' },
  '/ai-assistant/executive-briefing': { title: 'Executive Briefing', subtitle: 'A compiled leadership briefing spanning finance, marketing, communications, and operations scheduling.', module: 'AI Assistant', sidebarKey: '/ai-assistant', parentLabel: 'AI Assistant' },
  '/ai-assistant/follow-up-questions': { title: 'Follow-up Questions', subtitle: 'A placeholder for deeper AI-led executive questioning.', module: 'AI Assistant', sidebarKey: '/ai-assistant', parentLabel: 'AI Assistant' },
  '/ai-assistant/suggested-actions': { title: 'Suggested Actions', subtitle: 'A placeholder for staged AI recommendations awaiting approval.', module: 'AI Assistant', sidebarKey: '/ai-assistant', parentLabel: 'AI Assistant' },
  '/ai-assistant/assumptions': { title: 'Assumptions', subtitle: 'A placeholder for the assumptions driving AI output.', module: 'AI Assistant', sidebarKey: '/ai-assistant', parentLabel: 'AI Assistant' },
  '/ai-assistant/missing-information': { title: 'Missing Information', subtitle: 'A placeholder for gaps the AI layer needs surfaced clearly.', module: 'AI Assistant', sidebarKey: '/ai-assistant', parentLabel: 'AI Assistant' },
  '/ai-assistant/memory-context': { title: 'AI Memory / Context', subtitle: 'Searchable executive memory, historical context, and knowledge graph coverage.', module: 'AI Assistant', sidebarKey: '/ai-assistant', parentLabel: 'AI Assistant' },

  '/approvals': { title: 'Approvals', subtitle: 'A central, business-wide approval centre spanning functions.', module: 'Approvals', sidebarKey: '/approvals', parentLabel: 'Approvals' },

  '/reports': { title: 'Reports', subtitle: 'Weekly, monthly, quarterly, and board-ready reporting outputs.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/weekly-briefings': { title: 'Weekly Briefings', subtitle: 'Board-style Sunday briefing experience.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/executive-timeline': { title: 'Executive Timeline', subtitle: 'Permanent executive timeline of milestones, launches, decisions, and strategic events.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/decision-journal': { title: 'Decision Journal', subtitle: 'Structured executive decision memory with reasons, expected outcomes, and future actual outcomes.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/strategic-goals': { title: 'Strategic Goals', subtitle: 'Persistent business goals linked to metrics, decisions, and progress.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/monthly-reports': { title: 'Monthly Reports', subtitle: 'A placeholder monthly leadership report surface.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/quarterly-reviews': { title: 'Quarterly Reviews', subtitle: 'Prepared board paper for the quarter just gone.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/board-meeting': { title: 'Board Meeting Mode', subtitle: 'A presentation-ready board view with keyboard navigation and executive slides.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/cfo-reports': { title: 'CFO Reports', subtitle: 'A placeholder hub for finance-specific reports.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/cmo-reports': { title: 'Marketing Intelligence Report', subtitle: 'A packaged v1.1 marketing report spanning GA4, YouTube, cross-channel findings, risks, and actions.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },
  '/reports/ceo-reports': { title: 'CEO Reports', subtitle: 'A placeholder hub for CEO-level reports and summaries.', module: 'Reports', sidebarKey: '/reports', parentLabel: 'Reports' },

  '/settings': { title: 'Settings', subtitle: 'Prototype controls for shell behaviour, preferences, and future integrations.', module: 'Settings', sidebarKey: '/settings', parentLabel: 'Settings' },
  '/settings/integrations': { title: 'Integration Status', subtitle: 'Placeholder health and registration view for future integrations.', module: 'Settings', sidebarKey: '/settings', parentLabel: 'Settings' },
  '/settings/configuration': { title: 'Demo Mode Configuration', subtitle: 'Runtime mode, provider bindings, and service activation overview.', module: 'Settings', sidebarKey: '/settings', parentLabel: 'Settings' },
  '/settings/provider-architecture': { title: 'Provider Architecture', subtitle: 'Presentation, service, and provider layer overview for future integrations.', module: 'Settings', sidebarKey: '/settings', parentLabel: 'Settings' },
  '/settings/about': { title: 'About EP Intelligence', subtitle: 'Release metadata, governance references, and platform positioning.', module: 'Settings', sidebarKey: '/settings', parentLabel: 'Settings' }
};

export const QUESTION_SETS = {
  '/ceo': {
    what: ['The business is healthy, but only a few things deserve attention', 'The CEO Dashboard now distils the business into the handful of changes and decisions that actually matter today.'],
    why: ['Cross-functional signals are moving together', 'Finance, marketing, customer trust, approvals, and execution are all influencing each other rather than acting as isolated dashboards.'],
    matters: ['Yes — because clarity beats volume', 'The CEO should see the business through an AI Chief of Staff lens, not through a wall of disconnected metrics.'],
    next: ['Prioritise the most valuable decisions first', 'Use the dashboard to decide what to approve, what to challenge, and what deserves deeper review in another module.']
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
  '/ai-assistant/executive-briefing': {
    what: ['The AI layer now packages a real executive briefing', 'This briefing combines deterministic signals from finance, marketing, the Executive Inbox, and the Operations Calendar into one leadership readout.'],
    why: ['Cross-functional signals are stronger when read together', 'Scheduling pressure, communications backlog, margin watchpoints, and marketing momentum often matter more in combination than in isolation.'],
    matters: ['Yes, because leadership needs synthesis not tabs', 'The CEO should understand the operating week, risks, and opportunities without manually stitching routes together.'],
    next: ['Use the briefing to choose the next approvals', 'Challenge the key risks, approve the best actions, and decide which route deserves deeper review next.']
  },
  '/reports': {
    what: ['Executive reporting is now memory-backed', 'Reports package current performance alongside historical context, goal progress, and prior decisions.'],
    why: ['Leadership needs reporting that remembers', 'A strong report should explain not just what changed, but what the business has already learned and committed to.'],
    matters: ['Yes, because executive memory improves decision quality', 'Historical context helps leadership separate one-off movement from repeat patterns.'],
    next: ['Use reports to review decisions, trends, and goals together', 'Open the relevant report route depending on whether the priority is briefing, timeline, goals, or board discussion.']
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
  }
};
