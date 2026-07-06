import { normalizeCollection, normalizeExecutiveAction, parseCompactNumber } from '../contracts/data-contracts.js';
import { ActionStore } from '../actions/action-store.js';
import { createExecutionLayer } from '../execution/execution-layer.js';

const TODAY = '2026-07-05';
const THIS_WEEK_END = '2026-07-12';
const ACTION_CATEGORIES = ['Marketing', 'Finance', 'Operations', 'Sales', 'Customer Success', 'Projects', 'HR', 'Calendar', 'Email', 'Approvals', 'General', 'AI Suggestions'];
const ACTION_STATUSES = ['New', 'Pending', 'Waiting', 'Approved', 'Rejected', 'Completed', 'Dismissed', 'Archived'];
const WORKFLOW_ACTIONS = ['Approve', 'Reject', 'Edit', 'Delegate', 'Snooze', 'Archive', 'View Evidence', 'View History', 'View Related Items'];
const PRIORITY_SCORE = { Critical: 4, High: 3, Medium: 2, Low: 1 };

function text(value, fallback = '') {
  return value == null ? fallback : String(value);
}

function toDateValue(value) {
  const source = text(value).slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(source) ? source : TODAY;
}

function daysUntil(value) {
  const date = new Date(`${toDateValue(value)}T00:00:00Z`).getTime();
  const today = new Date(`${TODAY}T00:00:00Z`).getTime();
  return Math.round((date - today) / 86400000);
}

function sortActions(actions = []) {
  return actions.slice().sort((left, right) => {
    const priorityDelta = (PRIORITY_SCORE[right.priority] || 0) - (PRIORITY_SCORE[left.priority] || 0);
    if (priorityDelta) return priorityDelta;
    const dueDelta = daysUntil(left.dueDate) - daysUntil(right.dueDate);
    if (dueDelta) return dueDelta;
    return left.title.localeCompare(right.title);
  });
}

function buildHistory(status, summary, owner = 'EP Hub', timestamp = `${TODAY}T08:00:00Z`, type = 'Action staged') {
  return [{ id: `${type}-${status}-${summary}`.toLowerCase(), type, status, timestamp, summary, owner }];
}

function createAction(overrides = {}) {
  return normalizeExecutiveAction({
    category: 'General',
    department: 'Executive',
    actionType: 'Complete Task',
    priority: 'Medium',
    confidence: 'Medium',
    risk: 'Medium',
    businessValue: 'Keeps executive attention focused on the highest-value next move.',
    estimatedTime: '15 minutes',
    created: TODAY,
    dueDate: TODAY,
    owner: 'CEO',
    status: 'New',
    dependencies: [],
    relatedKpis: [],
    relatedTimelineEvents: [],
    relatedDecisions: [],
    supportingEvidence: [],
    recommendedOutcome: 'Review and approve the next best move.',
    linkedProviders: [],
    workflowActions: WORKFLOW_ACTIONS,
    queueTags: [],
    alternatives: ['Approve the recommendation', 'Delegate for further review', 'Defer until confidence improves'],
    evidence: [],
    history: buildHistory('New', 'Action created from provider-backed executive intelligence.'),
    linkedRoute: '/ceo',
    detailRoute: '/executive-action-centre/action-detail',
    departmentRoute: '/ceo',
    businessContext: 'This action was generated inside the Executive Action Centre from the current provider-backed operating state.',
    executiveSummary: overrides.summary,
    decisionHistory: [],
    memory: [],
    ...overrides
  });
}

function metricText(metrics = [], key, fallback = '—') {
  const match = metrics.find((item) => item.key === key || item.label === key);
  return match?.value || fallback;
}

function financeActions({ finance, communications, approvals }) {
  const pendingFinanceEmail = communications.inboxItems?.find((item) => item.category === 'Finance') || {};
  const supplierRisk = finance.risks?.[0] || {};
  const supplierOpportunity = finance.opportunities?.[0] || {};
  const pendingApprovals = approvals.flat.filter((item) => /invoice|payment|supplier/i.test(item.title || ''));
  return [
    createAction({
      id: 'action-review-cash-flow',
      title: 'Review cash flow before the next approval block',
      summary: `Forecast cash is ${text(finance.forecasts?.cash, metricText(finance.metrics, 'cash'))}, and margin discipline still matters more than topline comfort right now.`,
      category: 'Finance',
      department: 'Finance',
      actionType: 'Review Cash Flow',
      priority: 'High',
      confidence: 'High',
      risk: 'High',
      businessValue: 'Protects runway, preserves optionality, and reduces avoidable short-term pressure on supplier and growth decisions.',
      estimatedTime: '20 minutes',
      dueDate: TODAY,
      owner: 'CEO / CFO',
      status: 'Pending',
      relatedKpis: [metricText(finance.metrics, 'revenue'), metricText(finance.metrics, 'profit'), metricText(finance.metrics, 'cash')],
      relatedTimelineEvents: ['timeline-cash-warning'],
      relatedDecisions: ['decision-ga4-live-snapshot'],
      supportingEvidence: [text(supplierRisk.title, 'Cash resilience remains a live watchpoint.'), text(finance.weeklyBriefing?.summary)],
      recommendedOutcome: 'Approve a tighter collections and spend-review posture for the current week.',
      linkedProviders: ['Finance Provider', 'Executive Memory'],
      queueTags: ['My Queue', "Today's Actions", 'Urgent'],
      evidence: [
        { label: 'Forecast cash', value: text(finance.forecasts?.cash, '—'), note: 'Current forecast cash output from the CFO workspace.', tone: 'warn' },
        { label: 'Working capital risk', value: text(supplierRisk.title || finance.kpis?.groups?.[3]?.[1]?.[2]?.[1], 'Visible'), note: 'Finance risk pressure is already visible in the workspace.', tone: 'risk' }
      ],
      history: buildHistory('Pending', 'Cash flow review staged ahead of finance approvals.', 'CFO')
    }),
    createAction({
      id: 'action-approve-supplier-payment',
      title: 'Approve the next supplier payment only after margin review',
      summary: pendingApprovals[0]?.title ? `${pendingApprovals[0].title}. ${pendingApprovals[0].why}` : `${text(supplierRisk.title, 'Supplier cost pressure remains visible')} and should be approved with current margin context in view.`,
      category: 'Finance',
      department: 'Finance / Operations',
      actionType: 'Approve Supplier Payment',
      priority: 'High',
      confidence: 'Medium',
      risk: 'High',
      businessValue: text(supplierOpportunity.estimatedValue, 'Protects gross margin while keeping key supplier relationships healthy.'),
      estimatedTime: '10 minutes',
      dueDate: TODAY,
      owner: 'CEO / CFO',
      status: 'New',
      relatedKpis: [metricText(finance.metrics, 'profit'), metricText(finance.metrics, 'cash')],
      relatedTimelineEvents: ['timeline-margin-risk'],
      supportingEvidence: [text(pendingFinanceEmail.subject, 'Finance-sensitive supplier item visible in the current review cycle.'), text(supplierRisk.mitigation, 'Mitigation should happen before the next purchasing cycle.')],
      recommendedOutcome: 'Approve only the supplier payments that protect service delivery without weakening margin discipline.',
      linkedProviders: ['Finance Provider', 'Executive Inbox'],
      queueTags: ['My Queue', 'Urgent'],
      evidence: [
        { label: 'Supplier watchpoint', value: text(supplierRisk.title, 'Supplier cost pressure'), note: text(supplierRisk.mitigation, 'Review highest-cost supplier line first.'), tone: 'risk' },
        { label: 'Inbox context', value: text(pendingFinanceEmail.subject, 'Finance thread visible'), note: text(pendingFinanceEmail.aiSummary, 'Executive Inbox is surfacing supplier and finance pressure.'), tone: 'warn' }
      ]
    }),
    createAction({
      id: 'action-review-forecast',
      title: 'Review the latest revenue and profit forecast before weekly commitments',
      summary: text(finance.weeklyBriefing?.summary, 'The current forecast deserves a direct executive review before more commitments are made.'),
      category: 'Finance',
      department: 'Finance',
      actionType: 'Review Forecast',
      priority: 'Medium',
      confidence: 'High',
      risk: 'Medium',
      businessValue: 'Improves planning quality before spend, hiring, or campaign commitments are locked in.',
      estimatedTime: '15 minutes',
      dueDate: THIS_WEEK_END,
      owner: 'CEO / CFO',
      status: 'Waiting',
      relatedKpis: [metricText(finance.metrics, 'revenue'), metricText(finance.metrics, 'profit')],
      relatedTimelineEvents: ['timeline-campaign-success'],
      supportingEvidence: [text(finance.weeklyBriefing?.headline, 'Forecast confidence remains a leadership issue.')],
      recommendedOutcome: 'Decide whether to hold current assumptions, reduce exposure, or lean into the strongest growth pockets.',
      linkedProviders: ['Finance Provider', 'Executive Memory'],
      queueTags: ['This Week', 'Waiting For Me'],
      evidence: [{ label: 'Forecast', value: text(finance.forecasts?.profit, '—'), note: 'Forecast profit should be judged against current revenue momentum and expense drift.', tone: 'info' }],
      history: buildHistory('Waiting', 'Forecast review staged for the current week.', 'CFO')
    })
  ];
}

function marketingActions({ marketing, intelligence }) {
  const bestPlatform = marketing.socialOverview?.rankings?.[0] || {};
  const contentLead = marketing.contentLibrary?.items?.find((item) => /blog|article/i.test(item.type || item.title || '')) || marketing.contentLibrary?.items?.[0] || {};
  const nextCampaign = marketing.marketingCalendar?.upcoming?.[0] || {};
  const aiRecommendation = intelligence.recommendations?.find((item) => /website|linkedin|social|youtube/i.test(item.recommendation || '')) || {};
  return [
    createAction({
      id: 'action-review-marketing-performance',
      title: 'Review marketing performance before approving new content output',
      summary: `${text(marketing.dashboard?.weeklyBriefing, marketing.dashboard?.summary)} Best current platform: ${text(marketing.dashboard?.bestPlatform, bestPlatform.platform || 'YouTube')}.`,
      category: 'Marketing',
      department: 'Marketing',
      actionType: 'Review Marketing Performance',
      priority: 'High',
      confidence: 'High',
      risk: 'Medium',
      businessValue: 'Protects budget and content effort by forcing decisions through performance, conversion quality, and channel focus.',
      estimatedTime: '15 minutes',
      dueDate: TODAY,
      owner: 'CEO / CMO',
      status: 'Pending',
      relatedKpis: [text(marketing.dashboard?.metrics?.visitors), text(marketing.dashboard?.metrics?.enquiries), text(marketing.dashboard?.metrics?.engagement)],
      relatedTimelineEvents: ['timeline-marketing-demand'],
      supportingEvidence: [text(bestPlatform.platform, 'A strongest channel is visible.'), text(bestPlatform.growth, 'Growth data is visible for the leading social platform.')],
      recommendedOutcome: 'Approve the next marketing actions only where performance and conversion logic both hold.',
      linkedProviders: ['Google Analytics', 'YouTube', 'Unified Social'],
      queueTags: ['My Queue', "Today's Actions"],
      evidence: [
        { label: 'Marketing Health', value: String(marketing.dashboard?.healthScore || 0), note: text(marketing.dashboard?.summary), tone: 'info' },
        { label: 'Best platform', value: text(bestPlatform.platform, 'Top channel'), note: text(bestPlatform.note, 'Leading current momentum channel.'), tone: 'good' }
      ]
    }),
    createAction({
      id: 'action-publish-social-post',
      title: `Publish the next proof-led ${text(bestPlatform.platform, 'social')} post as a managed approval`,
      summary: text(aiRecommendation.why, 'The strongest social theme should be turned into a deliberate approval-first publish action.'),
      category: 'Marketing',
      department: 'Marketing / Content',
      actionType: 'Publish Social Post',
      priority: 'Medium',
      confidence: 'Medium',
      risk: 'Low',
      businessValue: 'Keeps the strongest channel moving without turning the action layer into an automatic publisher.',
      estimatedTime: '12 minutes',
      dueDate: THIS_WEEK_END,
      owner: 'CMO / Content Lead',
      status: 'Approved',
      relatedKpis: [text(bestPlatform.engagement), text(bestPlatform.growth)],
      relatedTimelineEvents: ['timeline-marketing-demand'],
      relatedDecisions: ['decision-video-proof-series'],
      supportingEvidence: [text(bestPlatform.note, 'Current platform ranking supports this move.'), text(aiRecommendation.recommendation, 'The recommendation engine is already pointing at stronger proof-led sequencing.')],
      recommendedOutcome: 'Approve one high-conviction social asset built from the strongest proof story.',
      linkedProviders: ['Unified Social', 'Executive Memory'],
      queueTags: ['Recently Approved', 'This Week'],
      evidence: [{ label: 'Top platform', value: text(bestPlatform.platform, 'Social platform'), note: text(bestPlatform.note, 'Platform rank is shaping the next action.'), tone: 'good' }],
      history: buildHistory('Approved', 'Content sequencing was approved for the strongest social theme.', 'CMO', `${TODAY}T10:00:00Z`, 'Approved')
    }),
    createAction({
      id: 'action-approve-blog',
      title: `Approve the next long-form authority asset: ${text(contentLead.title, 'EP brand proof article')}`,
      summary: text(contentLead.summary || contentLead.description, 'A long-form asset should be approved as part of the current authority-building sequence.'),
      category: 'Marketing',
      department: 'Marketing / Website',
      actionType: 'Approve Blog',
      priority: 'Medium',
      confidence: 'Medium',
      risk: 'Low',
      businessValue: 'Supports SEO, trust, and downstream fitting conversion without depending on paid reach.',
      estimatedTime: '8 minutes',
      dueDate: THIS_WEEK_END,
      owner: 'CEO / CMO',
      status: 'New',
      relatedKpis: [text(marketing.dashboard?.metrics?.visitors), text(marketing.dashboard?.metrics?.signups)],
      supportingEvidence: [text(contentLead.platform, 'Content library item available for approval.'), text(marketing.aiMarketingAdvisor?.executiveSummary, 'AI marketing advisor is framing authority-building priorities.')],
      recommendedOutcome: 'Approve only the content asset that best strengthens premium trust and website conversion.',
      linkedProviders: ['Google Analytics', 'Unified Social', 'YouTube'],
      queueTags: ['This Week']
    }),
    createAction({
      id: 'action-publish-linkedin-article',
      title: 'Publish the next LinkedIn authority article as a deliberate executive positioning move',
      summary: text(intelligence.recommendations?.find((item) => /LinkedIn/i.test(item.recommendation || ''))?.why, 'LinkedIn should be used intentionally for professional trust, not as a leftover channel.'),
      category: 'Marketing',
      department: 'Marketing / Founder Brand',
      actionType: 'Publish LinkedIn Article',
      priority: 'Medium',
      confidence: 'Medium',
      risk: 'Low',
      businessValue: 'Strengthens premium authority and makes the EP brand feel more credible in high-trust buying contexts.',
      estimatedTime: '20 minutes',
      dueDate: THIS_WEEK_END,
      owner: 'CEO / CMO',
      status: 'Rejected',
      relatedKpis: [text(marketing.platforms?.linkedin?.metrics?.followers, text(marketing.platforms?.linkedin?.followers))],
      supportingEvidence: [text(marketing.platforms?.linkedin?.summary, 'LinkedIn remains strategically valuable when treated deliberately.')],
      recommendedOutcome: 'Approve only if the content is strong enough to reinforce premium positioning.',
      linkedProviders: ['Unified Social', 'Executive Memory'],
      queueTags: ['Recently Rejected'],
      history: buildHistory('Rejected', 'A lower-quality LinkedIn draft was rejected to protect brand positioning.', 'CEO', `${TODAY}T09:15:00Z`, 'Rejected')
    }),
    createAction({
      id: 'action-schedule-campaign',
      title: `Schedule campaign: ${text(nextCampaign.title, 'Next content launch')}`,
      summary: text(nextCampaign.body || nextCampaign.description, 'The next marketing sequence should be scheduled through one approval-first action.'),
      category: 'Marketing',
      department: 'Marketing / Calendar',
      actionType: 'Schedule Campaign',
      priority: 'Medium',
      confidence: 'High',
      risk: 'Low',
      businessValue: 'Improves sequencing discipline across campaign, calendar, and content without automating publication.',
      estimatedTime: '10 minutes',
      dueDate: toDateValue(nextCampaign.date || THIS_WEEK_END),
      owner: 'CMO',
      status: 'Completed',
      relatedKpis: [text(marketing.campaignPerformance?.roi), text(marketing.campaignPerformance?.revenueAttribution)],
      supportingEvidence: [text(nextCampaign.title, 'Marketing calendar item available.'), text(nextCampaign.body, 'Campaign calendar provides timing context.')],
      recommendedOutcome: 'Complete the schedule approval and keep the campaign tightly linked to the strongest proof theme.',
      linkedProviders: ['Unified Social', 'Google Calendar'],
      queueTags: ['Completed Today'],
      history: buildHistory('Completed', 'Campaign schedule was completed and staged for downstream review.', 'CMO', `${TODAY}T11:20:00Z`, 'Completed')
    })
  ];
}

function communicationsActions({ communications }) {
  const customer = communications.inboxItems?.find((item) => ['Customer', 'Customers'].includes(item.category)) || communications.inboxItems?.[0] || {};
  const booking = communications.inboxItems?.find((item) => ['Booking', 'Bookings'].includes(item.category)) || {};
  const complaint = communications.inboxItems?.find((item) => /complaint|issue/i.test(`${item.subject} ${item.aiSummary}`)) || customer;
  return [
    createAction({
      id: 'action-reply-high-value-customer',
      title: `Reply to ${text(customer.sender, customer.customer || 'the highest-value customer thread')}`,
      summary: text(customer.aiSummary, 'A direct customer reply deserves executive attention because delay now affects trust and conversion.'),
      category: 'Email',
      department: 'Executive Inbox / Customer Success',
      actionType: 'Reply to Email',
      priority: customer.priority || 'High',
      confidence: 'High',
      risk: 'Medium',
      businessValue: 'Improves trust, shortens the path to booking, and keeps high-value conversations warm.',
      estimatedTime: '7 minutes',
      dueDate: TODAY,
      owner: 'CEO / Customer Success',
      status: 'Pending',
      relatedKpis: [String(communications.metrics?.waitingCustomerReplies || 0), String(communications.metrics?.bookingRequests || 0)],
      relatedTimelineEvents: ['mem-communications-customer-reply-backlog'],
      supportingEvidence: [text(customer.subject, 'A customer thread is waiting.'), text(customer.ageLabel, 'This conversation has already been waiting.')],
      recommendedOutcome: 'Approve and send a concise high-trust reply that moves the conversation toward a booking or clear next step.',
      linkedProviders: ['Gmail', 'CRM / Booking Intelligence'],
      queueTags: ['My Queue', "Today's Actions", 'Urgent'],
      evidence: [{ label: 'Customer thread', value: text(customer.subject, 'Customer reply required'), note: text(customer.aiSummary), tone: 'warn' }],
      history: buildHistory('Pending', 'High-value customer reply is waiting for executive review.', 'Executive Inbox')
    }),
    createAction({
      id: 'action-follow-up-customer',
      title: `Follow up booking demand from ${text(booking.sender, 'the latest fitting enquiry')}`,
      summary: text(booking.aiSummary, 'Visible booking demand should be followed up quickly before momentum fades.'),
      category: 'Sales',
      department: 'Sales / Booking Intelligence',
      actionType: 'Follow Up Customer',
      priority: 'High',
      confidence: 'High',
      risk: 'Low',
      businessValue: 'Converts visible demand faster without needing more acquisition spend.',
      estimatedTime: '10 minutes',
      dueDate: TODAY,
      owner: 'Sales / CEO',
      status: 'New',
      relatedKpis: [String(communications.metrics?.bookingRequests || 0)],
      relatedTimelineEvents: ['timeline-gmail-live-sync'],
      supportingEvidence: [text(booking.subject, 'Booking request visible in the Executive Inbox.'), text(booking.receivedTime, 'Response speed matters here.')],
      recommendedOutcome: 'Approve a same-day follow-up that protects conversion quality and premium customer experience.',
      linkedProviders: ['Gmail', 'Booking Intelligence'],
      queueTags: ['My Queue', "Today's Actions"]
    }),
    createAction({
      id: 'action-review-customer-complaint',
      title: 'Review the highest-risk customer complaint before it escalates',
      summary: text(complaint.aiSummary, 'A customer issue is visible enough to deserve executive review rather than passive inbox drift.'),
      category: 'Customer Success',
      department: 'Customer Success',
      actionType: 'Review Customer Complaint',
      priority: 'High',
      confidence: 'Medium',
      risk: 'High',
      businessValue: 'Protects trust and reduces the chance that one unresolved issue damages referrals or reputation.',
      estimatedTime: '15 minutes',
      dueDate: TODAY,
      owner: 'CEO / Customer Success',
      status: 'Waiting',
      relatedKpis: [String(communications.metrics?.needsReply || 0)],
      supportingEvidence: [text(complaint.subject, 'Complaint-like thread visible.'), text(complaint.sender, 'Sender identity matters to response tone and speed.')],
      recommendedOutcome: 'Decide the right response tone, owner, and follow-through before the issue becomes public or persistent.',
      linkedProviders: ['Gmail', 'Executive Memory'],
      queueTags: ['Waiting For Me', 'Urgent']
    })
  ];
}

function operationsActions({ operations }) {
  const freeSlot = operations.todaySchedule?.find((item) => /free|slot|availability/i.test(`${item.title} ${item.body}`)) || {};
  const compressed = operations.todaySchedule?.find((item) => /back-to-back|compression|tight/i.test(`${item.title} ${item.body}`)) || operations.todaySchedule?.[0] || {};
  const nextEvent = operations.todaySchedule?.find((item) => !item.isAllDay) || operations.todaySchedule?.[0] || {};
  return [
    createAction({
      id: 'action-book-calendar-event',
      title: `Book the best visible fitting slot${freeSlot.title ? `: ${freeSlot.title}` : ''}`,
      summary: text(operations.summary?.dailySummary, 'The schedule still contains selective revenue-capable capacity that can be used deliberately.'),
      category: 'Calendar',
      department: 'Operations / Sales',
      actionType: 'Book Calendar Event',
      priority: 'High',
      confidence: 'Medium',
      risk: 'Low',
      businessValue: 'Turns visible schedule capacity into revenue without increasing acquisition cost.',
      estimatedTime: '12 minutes',
      dueDate: TODAY,
      owner: 'Sales / Operations',
      status: 'New',
      relatedKpis: [String(operations.metrics?.availableBookingSlots || 0), String(operations.metrics?.capacityTodayPct || 0)],
      supportingEvidence: [text(freeSlot.title, 'Free capacity is visible in the current schedule.'), text(operations.summary?.headline, 'Operations summary supports the need for active capacity management.')],
      recommendedOutcome: 'Approve the highest-quality available slot for booking and protect enough buffer around it.',
      linkedProviders: ['Google Calendar', 'Booking Intelligence'],
      queueTags: ['Today\'s Actions', 'This Week']
    }),
    createAction({
      id: 'action-review-weekend-capacity',
      title: 'Review weekend and high-pressure schedule capacity before taking more demand',
      summary: text(operations.summary?.boardSummary || operations.summary?.dailySummary, 'Capacity pressure is high enough that schedule decisions now affect service quality.'),
      category: 'Operations',
      department: 'Operations',
      actionType: 'Review Risk',
      priority: 'High',
      confidence: 'High',
      risk: 'High',
      businessValue: 'Protects premium delivery quality by stopping the schedule from becoming superficially full but commercially fragile.',
      estimatedTime: '18 minutes',
      dueDate: TODAY,
      owner: 'CEO / COO',
      status: 'Pending',
      relatedKpis: [String(operations.metrics?.capacityTodayPct || 0), String(operations.metrics?.capacityThisWeekPct || 0), String(operations.metrics?.schedulingRisks || 0)],
      supportingEvidence: [text(nextEvent.title, 'The next visible appointment shapes today\'s operational rhythm.'), text(operations.providerSummary?.health, 'Provider summary already frames schedule pressure.')],
      recommendedOutcome: 'Approve only the schedule changes that preserve delivery quality and profitable utilisation.',
      linkedProviders: ['Google Calendar', 'Executive Memory'],
      queueTags: ['My Queue', 'Urgent'],
      evidence: [{ label: 'Capacity today', value: `${operations.metrics?.capacityTodayPct || 0}%`, note: text(operations.summary?.headline), tone: 'risk' }]
    }),
    createAction({
      id: 'action-escalate-schedule-compression',
      title: 'Escalate the most compressed part of the operating day',
      summary: text(compressed.body, 'The current schedule contains at least one block where compression could hurt service quality or staff load.'),
      category: 'Operations',
      department: 'Operations / Calendar',
      actionType: 'Escalate Issue',
      priority: 'Medium',
      confidence: 'Medium',
      risk: 'Medium',
      businessValue: 'Creates a calm path to reschedule or buffer the day before problems spread into customer experience.',
      estimatedTime: '10 minutes',
      dueDate: THIS_WEEK_END,
      owner: 'COO / Operations',
      status: 'Completed',
      relatedKpis: [String(operations.metrics?.schedulingRisks || 0)],
      supportingEvidence: [text(compressed.title, 'Compressed schedule block visible.'), text(compressed.startTime, 'Timing matters to the escalation window.')],
      recommendedOutcome: 'Record the compression risk, escalate it, and protect staff/customer buffer immediately.',
      linkedProviders: ['Google Calendar', 'Executive Memory'],
      queueTags: ['Completed Today'],
      history: buildHistory('Completed', 'Schedule compression was escalated and marked complete for today.', 'Operations', `${TODAY}T12:30:00Z`, 'Completed')
    })
  ];
}

function approvalActions({ approvals }) {
  return [
    createAction({
      id: 'action-triage-approval-queue',
      title: 'Triage the executive approval queue into immediate, this-week, and defer buckets',
      summary: `${approvals.flat.length} approvals are currently visible across finance, marketing, operations, and AI-driven workflow staging.`,
      category: 'Approvals',
      department: 'Executive Governance',
      actionType: 'Approve Invoice',
      priority: approvals.flat.length >= 6 ? 'High' : 'Medium',
      confidence: 'High',
      risk: 'Medium',
      businessValue: 'Reduces decision latency and keeps the CEO focused on the few approvals that genuinely matter.',
      estimatedTime: '20 minutes',
      dueDate: TODAY,
      owner: 'CEO',
      status: 'Pending',
      relatedKpis: [String(approvals.flat.length)],
      supportingEvidence: [approvals.flat.slice(0, 2).map((item) => item.title).join(' · ') || 'Approval volume is already visible in the queue.'],
      recommendedOutcome: 'Approve the high-impact items first, defer the low-value ones, and protect the operating system from queue sprawl.',
      linkedProviders: ['Approval Centre', 'Executive Memory'],
      queueTags: ['My Queue', 'Urgent'],
      evidence: [{ label: 'Visible approvals', value: String(approvals.flat.length), note: 'All approvals remain approval-first; nothing executes automatically.', tone: 'warn' }]
    })
  ];
}

function strategicActions({ goals, executive }) {
  const goal = goals[0] || {};
  const decision = executive.recentDecisions?.[0] || {};
  return [
    createAction({
      id: 'action-review-goal-progress',
      title: `Review goal progress: ${text(goal.title, 'Primary strategic goal')}`,
      summary: goal.summary ? `${goal.summary} Current progress is ${goal.progress}% against target ${goal.target}.` : 'The highest-priority goal should be reviewed before new tactical work is added.',
      category: 'Projects',
      department: 'Projects',
      actionType: 'Review Goal Progress',
      priority: 'Medium',
      confidence: 'High',
      risk: 'Medium',
      businessValue: 'Prevents tactical work from drifting away from the strategic outcomes leadership actually wants.',
      estimatedTime: '15 minutes',
      dueDate: THIS_WEEK_END,
      owner: 'CEO / Projects',
      status: 'New',
      relatedKpis: goal.linkedMetrics || [],
      relatedDecisions: [decision.title].filter(Boolean),
      supportingEvidence: [goal.currentValue ? `Current value: ${goal.currentValue}.` : 'Strategic progress data is available in Executive Memory.'],
      recommendedOutcome: 'Decide whether to keep the goal path, intervene, or reallocate effort to unblock it.',
      linkedProviders: ['Executive Memory', 'Knowledge Graph'],
      queueTags: ['This Week']
    }),
    createAction({
      id: 'action-review-hr-availability',
      title: 'Review staff availability and delivery strain before the next heavy diary block',
      summary: 'People capacity now matters because operating compression and customer experience quality are tightly linked.',
      category: 'HR',
      department: 'HR / Operations',
      actionType: 'Complete Task',
      priority: 'Medium',
      confidence: 'Medium',
      risk: 'Medium',
      businessValue: 'Helps leadership protect service quality and staff energy before overload becomes visible elsewhere.',
      estimatedTime: '10 minutes',
      dueDate: THIS_WEEK_END,
      owner: 'CEO / Operations',
      status: 'Archived',
      supportingEvidence: ['This remains a placeholder HR operating action tied to workload and calendar pressure.'],
      recommendedOutcome: 'Keep HR visibility linked to operational reality rather than treating staffing as a separate silo.',
      linkedProviders: ['Google Calendar', 'Executive Memory'],
      queueTags: [],
      history: buildHistory('Archived', 'A prior availability review was archived after the schedule changed.', 'Operations', `${TODAY}T07:30:00Z`, 'Archived')
    })
  ];
}

function aiSuggestionActions({ intelligence }) {
  return (intelligence.recommendations || []).slice(0, 3).map((item, index) =>
    createAction({
      id: `action-ai-suggestion-${item.id || index + 1}`,
      title: item.recommendation,
      summary: item.why,
      category: 'AI Suggestions',
      department: item.suggestedOwner || 'Executive',
      actionType: index === 0 ? 'Generate Report' : 'Complete Task',
      priority: item.priority || 'Medium',
      confidence: item.confidence || 'Medium',
      risk: item.risk || 'Medium',
      businessValue: item.expectedBenefit || 'Turns a recommendation into a reviewable executive action.',
      estimatedTime: '12 minutes',
      dueDate: index === 0 ? TODAY : THIS_WEEK_END,
      owner: item.suggestedOwner || 'CEO',
      status: index === 0 ? 'Pending' : 'New',
      supportingEvidence: [item.expectedBenefit, item.estimatedValue].filter(Boolean),
      recommendedOutcome: 'Review the rationale, challenge the trade-offs, and either approve or defer the suggestion.',
      linkedProviders: ['Intelligence Engine', 'Executive Memory'],
      queueTags: index === 0 ? ['My Queue', "Today's Actions"] : ['This Week'],
      evidence: [{ label: 'Expected benefit', value: item.expectedBenefit || 'Executive value', note: item.why, tone: 'info' }]
    })
  );
}

function generalAction({ reports }) {
  return [
    createAction({
      id: 'action-generate-report-pack',
      title: 'Generate the next executive report pack from the action backlog',
      summary: 'The operating system should turn actions, approvals, decisions, and workload into one reportable executive summary.',
      category: 'General',
      department: 'Executive Office',
      actionType: 'Generate Report',
      priority: 'Medium',
      confidence: 'High',
      risk: 'Low',
      businessValue: 'Creates one leadership narrative instead of forcing the CEO to assemble separate module views manually.',
      estimatedTime: '10 minutes',
      dueDate: THIS_WEEK_END,
      owner: 'CEO / Executive Office',
      status: 'New',
      relatedKpis: [String((reports.overview || []).length)],
      supportingEvidence: ['Reports, decisions, approvals, and memory context are now all available inside the same product surface.'],
      recommendedOutcome: 'Use the action layer to generate a cleaner executive and board briefing.',
      linkedProviders: ['Report Service', 'Executive Memory'],
      queueTags: ['This Week']
    })
  ];
}

function buildQueues(actions = []) {
  return {
    myQueue: sortActions(actions.filter((item) => /CEO|Kane|Executive/i.test(item.owner) && !['Completed', 'Archived', 'Dismissed'].includes(item.status))).slice(0, 8),
    todaysActions: sortActions(actions.filter((item) => toDateValue(item.dueDate) <= TODAY && !['Completed', 'Archived', 'Dismissed'].includes(item.status))).slice(0, 8),
    urgent: sortActions(actions.filter((item) => ['Critical', 'High'].includes(item.priority) || item.risk === 'High')).slice(0, 8),
    thisWeek: sortActions(actions.filter((item) => toDateValue(item.dueDate) <= THIS_WEEK_END && !['Completed', 'Archived', 'Dismissed'].includes(item.status))).slice(0, 8),
    waitingForMe: sortActions(actions.filter((item) => ['Waiting', 'Pending'].includes(item.status))).slice(0, 8),
    completedToday: sortActions(actions.filter((item) => item.status === 'Completed')).slice(0, 8),
    recentlyApproved: sortActions(actions.filter((item) => item.status === 'Approved')).slice(0, 8),
    recentlyRejected: sortActions(actions.filter((item) => item.status === 'Rejected')).slice(0, 8)
  };
}

function buildMetrics(actions = [], approvals = []) {
  const active = actions.filter((item) => !['Completed', 'Archived', 'Dismissed'].includes(item.status));
  return {
    total: actions.length,
    active: active.length,
    approvals: approvals.flat.length,
    urgent: actions.filter((item) => item.priority === 'High' || item.risk === 'High').length,
    waiting: actions.filter((item) => item.status === 'Waiting').length,
    completedToday: actions.filter((item) => item.status === 'Completed').length,
    approved: actions.filter((item) => item.status === 'Approved').length,
    rejected: actions.filter((item) => item.status === 'Rejected').length,
    categories: [...new Set(actions.map((item) => item.category))]
  };
}

function buildDepartmentWorkload(actions = []) {
  const map = new Map();
  actions.forEach((item) => {
    const key = item.department.split(' / ')[0] || item.department;
    const current = map.get(key) || { department: key, active: 0, urgent: 0, completed: 0, averagePriority: 0, items: [] };
    if (!['Completed', 'Archived', 'Dismissed'].includes(item.status)) current.active += 1;
    if (item.priority === 'High' || item.risk === 'High') current.urgent += 1;
    if (item.status === 'Completed') current.completed += 1;
    current.items.push(item);
    map.set(key, current);
  });
  return Array.from(map.values()).map((entry) => ({
    department: entry.department,
    active: entry.active,
    urgent: entry.urgent,
    completed: entry.completed,
    avgPriorityScore: Math.round(entry.items.reduce((sum, item) => sum + (PRIORITY_SCORE[item.priority] || 0), 0) / Math.max(entry.items.length, 1) * 25),
    summary: `${entry.active} active, ${entry.urgent} urgent, ${entry.completed} completed.`
  })).sort((left, right) => right.urgent - left.urgent || right.active - left.active);
}

function buildReports(actions = [], queues = {}, metrics = {}, departmentWorkload = []) {
  const backlogByStatus = ACTION_STATUSES.map((status) => ({ status, count: actions.filter((item) => item.status === status).length }));
  return {
    executiveActionsReport: {
      title: 'Executive Actions Report',
      summary: `${metrics.active} active actions, ${metrics.urgent} urgent items, and ${metrics.approvals} approval-stage items are currently shaping the executive queue.`,
      highlights: queues.myQueue.slice(0, 4)
    },
    outstandingApprovals: {
      title: 'Outstanding Approvals',
      summary: `${metrics.approvals} approvals remain visible across the current operating system.`,
      items: queues.urgent.filter((item) => ['Pending', 'New', 'Waiting'].includes(item.status)).slice(0, 6)
    },
    decisionHistory: {
      title: 'Decision History',
      summary: `${metrics.approved} approved, ${metrics.rejected} rejected, and ${metrics.completedToday} completed actions already contribute to executive history.`,
      items: actions.filter((item) => ['Approved', 'Rejected', 'Completed'].includes(item.status)).slice(0, 8)
    },
    actionAnalytics: {
      title: 'Action Analytics',
      summary: 'Action analytics tracks backlog shape, execution readiness, and where leadership attention is actually being spent.',
      backlogByStatus
    },
    approvalPerformance: {
      title: 'Approval Performance',
      summary: `${metrics.approved} items were approved and ${metrics.rejected} were rejected in the current review window.`,
      breakdown: backlogByStatus.filter((item) => ['Approved', 'Rejected', 'Pending', 'Waiting'].includes(item.status))
    },
    departmentWorkload: {
      title: 'Department Workload',
      summary: 'Workload is measured by active actions, urgent items, and completed work by department.',
      items: departmentWorkload
    }
  };
}

function buildSearchIndex(actions = []) {
  return actions.map((item) => ({
    id: `search-${item.id}`,
    actionId: item.id,
    type: 'Action',
    title: item.title,
    body: `${item.summary} ${item.supportingEvidence.join(' ')}`.trim(),
    route: item.detailRoute || '/executive-action-centre/action-detail',
    meta: `${item.category} · ${item.department} · ${item.priority} · ${item.status} · ${(item.linkedProviders || []).join(', ')}`
  }));
}

function buildApprovalWorkflow(actions = []) {
  return {
    title: 'Approval Workflow',
    principle: 'Nothing executes automatically. Every action remains reviewable, explainable, and reversible until a future approved execution layer exists.',
    workflowActions: WORKFLOW_ACTIONS,
    stages: ['Action surfaced', 'Evidence reviewed', 'Decision made', 'Memory updated', 'Execution adapter prepared'],
    items: actions.filter((item) => ['Pending', 'New', 'Waiting', 'Approved', 'Rejected'].includes(item.status)).slice(0, 8)
  };
}

function buildSettings() {
  return {
    priorityRules: ['High customer trust risk escalates priority', 'Visible cash pressure escalates finance items', 'Calendar overload escalates operating risk'],
    confidenceThresholds: { high: '80+', medium: '65–79', low: '<65' },
    approvalDefaults: ['Approval-first on every action', 'No automatic execution', 'Evidence required before completion'],
    actionRetention: 'Retain approved, rejected, and completed action history inside Executive Memory.',
    departmentRouting: ['Finance → CFO / CEO', 'Marketing → CMO / CEO', 'Operations → COO / CEO', 'Inbox → Customer Success / Sales / CEO'],
    businessHours: '07:30–18:30 Europe/London',
    notificationPreferences: ['Urgent actions surface on CEO Dashboard', 'Approved/rejected actions stay visible in reports and search', 'Completed items remain searchable in memory'],
    storeKey: 'ep-intelligence.executive-actions.v2.0'
  };
}

function buildCopilot(actionsWorkspace, context) {
  const { queues, metrics, actions } = actionsWorkspace;
  const urgentFinance = actions.filter((item) => item.category === 'Finance' && (item.priority === 'High' || item.risk === 'High'));
  const waitingReplies = actions.filter((item) => ['Email', 'Sales', 'Customer Success'].includes(item.category));
  const marketingItems = actions.filter((item) => item.category === 'Marketing' || item.category === 'AI Suggestions');
  const youtubeActions = actions.filter((item) => (item.linkedProviders || []).some((provider) => /youtube/i.test(provider)) || /youtube/i.test(`${item.title} ${item.summary}`));
  const approvalItems = actions.filter((item) => ['Pending', 'Waiting', 'New'].includes(item.status));
  const answers = {
    'what should i focus on today?': {
      title: 'Focus on today\'s executive queue',
      answer: queues.todaysActions.slice(0, 3).map((item) => `${item.title} (${item.priority}, ${item.status})`).join(' · '),
      rationale: 'Built from due dates, urgency, and CEO-owned actions inside the Executive Action Centre.',
      supportingRoutes: ['/executive-action-centre/queue', '/ceo']
    },
    'show urgent finance items.': {
      title: 'Urgent finance items',
      answer: urgentFinance.slice(0, 3).map((item) => `${item.title}: ${item.summary}`).join(' '),
      rationale: 'Derived from the finance workspace, finance-sensitive inbox items, and approval backlog.',
      supportingRoutes: ['/executive-action-centre', '/cfo']
    },
    'which customers require replies?': {
      title: 'Customers requiring replies',
      answer: waitingReplies.slice(0, 3).map((item) => `${item.title}: ${item.summary}`).join(' '),
      rationale: 'Drawn from Executive Inbox triage, booking demand, and customer success actions.',
      supportingRoutes: ['/executive-action-centre', '/executive-inbox']
    },
    'summarise marketing performance.': {
      title: 'Marketing performance summary',
      answer: `${text(context.marketing.dashboard?.weeklyBriefing, context.marketing.dashboard?.summary)} ${marketingItems.slice(0, 2).map((item) => item.title).join(' · ')}`,
      rationale: 'Combines marketing workspace signals with action staging from GA4, YouTube, and Unified Social.',
      supportingRoutes: ['/executive-action-centre', '/cmo', '/reports/cmo-reports']
    },
    'explain this recommendation.': {
      title: 'Recommendation explanation',
      answer: `${text(context.intelligence.recommendations?.[0]?.recommendation, 'Top recommendation')}: ${text(context.intelligence.recommendations?.[0]?.why, 'Recommendation rationale unavailable.')}`,
      rationale: 'Resolved through Provider Layer → Services → Intelligence Engine → Memory → Knowledge Graph.',
      supportingRoutes: ['/executive-copilot/ask', '/executive-action-centre']
    },
    'why is business health down?': {
      title: 'Business health explanation',
      answer: `Business Health now reflects ${metrics.active} active actions, ${metrics.approvals} approval-stage items, ${context.communications.metrics?.needsReply || 0} visible inbox replies, and ${context.operations.metrics?.schedulingRisks || 0} schedule risks alongside finance and marketing scores.`,
      rationale: 'The v2.0 health view now includes action backlog, approval backlog, inbox pressure, schedule pressure, finance, marketing, and goal progress.',
      supportingRoutes: ['/ceo', '/executive-action-centre/queue']
    },
    'show everything related to youtube.': {
      title: 'YouTube-linked actions',
      answer: youtubeActions.slice(0, 4).map((item) => `${item.title} (${item.status})`).join(' · '),
      rationale: 'Searches linked providers, action titles, and summaries for YouTube-backed executive work.',
      supportingRoutes: ['/cmo/youtube', '/executive-action-centre']
    },
    'show every action awaiting approval.': {
      title: 'Awaiting approval',
      answer: approvalItems.slice(0, 6).map((item) => `${item.title} (${item.priority})`).join(' · '),
      rationale: 'Pulled directly from action status, queue state, and approval-first workflow rules.',
      supportingRoutes: ['/executive-action-centre/approval-workflow', '/approvals']
    }
  };
  const prompts = Object.entries(answers).map(([question, value]) => ({ question, ...value }));
  return {
    intro: 'Executive Copilot now sits on top of the provider, service, intelligence, memory, and knowledge-graph stack. It answers with action-ready guidance, not generic chat.',
    prompts,
    defaultPrompt: prompts[0],
    suggestedQuestions: prompts.map((item) => item.question),
    architecture: ['Provider Layer', 'Services', 'Intelligence Engine', 'Memory', 'Knowledge Graph']
  };
}

export function createActionService({ executiveService, financeService, marketingService, communicationsService, approvalService, reportService, timelineService, memoryService, intelligenceProvider = () => ({ recommendations: [] }) } = {}) {
  const actionStore = new ActionStore();
  const executionLayer = createExecutionLayer();

  return Object.freeze({
    getWorkspace() {
      const executive = executiveService.getCeoDashboard();
      const finance = financeService.getWorkspace();
      const marketing = marketingService.getWorkspace();
      const communications = communicationsService.getWorkspace();
      const approvals = approvalService.getWorkspace();
      const reports = reportService.getWorkspace();
      const operations = timelineService.getOperationsWorkspace();
      const memory = memoryService.getDashboardWorkspace({ executive, finance, marketing, communications, operations, approvals: Object.values(approvals.groups || {}).flat(), recommendations: intelligenceProvider()?.recommendations || [] });
      const intelligence = intelligenceProvider() || { recommendations: [] };
      const approvalFlat = Object.entries(approvals.groups || {}).flatMap(([group, items]) => items.map((item) => ({ ...item, group })));
      const actions = actionStore.merge(sortActions(normalizeCollection([
        ...financeActions({ finance, communications, approvals: { groups: approvals.groups || {}, flat: approvalFlat } }),
        ...marketingActions({ marketing, intelligence }),
        ...communicationsActions({ communications }),
        ...operationsActions({ operations }),
        ...approvalActions({ approvals: { groups: approvals.groups || {}, flat: approvalFlat } }),
        ...strategicActions({ goals: memory.strategicGoals || [], executive: memory }),
        ...aiSuggestionActions({ intelligence }),
        ...generalAction({ reports })
      ], normalizeExecutiveAction)));
      const queues = buildQueues(actions);
      const metrics = buildMetrics(actions, { groups: approvals.groups || {}, flat: approvalFlat });
      const departmentWorkload = buildDepartmentWorkload(actions);
      const reportsWorkspace = buildReports(actions, queues, metrics, departmentWorkload);
      const searchIndex = buildSearchIndex(actions);
      const workflow = buildApprovalWorkflow(actions);
      const settings = buildSettings();
      const copilot = buildCopilot({ actions, queues, metrics }, { executive, finance, marketing, communications, operations, intelligence, memory });
      const detail = actions[0] || null;

      return {
        title: 'Executive Action Centre',
        subtitle: 'One approval-first queue for what the business actually needs next.',
        categories: ACTION_CATEGORIES,
        statuses: ACTION_STATUSES,
        workflowActions: WORKFLOW_ACTIONS,
        actions,
        detail,
        metrics,
        queues,
        reports: reportsWorkspace,
        approvalWorkflow: workflow,
        settings,
        searchIndex,
        departmentWorkload,
        executionLayer: executionLayer.describe(),
        adapters: executionLayer.getAdapters().map((adapter) => ({
          key: adapter.key,
          label: adapter.label,
          provider: adapter.provider,
          supports: adapter.supports,
          validate: adapter.validate(detail),
          preview: adapter.preview(detail),
          execute: adapter.execute(detail)
        })),
        copilot,
        summary: {
          headline: `${metrics.active} active executive actions are currently visible.`,
          body: `${queues.myQueue.length} are in My Queue, ${metrics.urgent} are urgent, and ${metrics.approvals} approval-stage items remain visible.`
        }
      };
    },
    getSearchIndex() {
      return this.getWorkspace().searchIndex;
    }
  });
}
