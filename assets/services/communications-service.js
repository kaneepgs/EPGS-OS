import { deepClone } from '../contracts/data-contracts.js';

const SECTION_DEFINITIONS = Object.freeze([
  { key: 'priority', title: 'Priority', body: 'The conversations that most clearly deserve executive attention now.', matcher: (item) => item.priority === 'High' && item.status !== 'Completed' },
  { key: 'needsReply', title: 'Needs Reply', body: 'Messages where delay is now more dangerous than noise.', matcher: (item) => /reply/i.test(item.status) },
  { key: 'customerEnquiries', title: 'Customer Enquiries', body: 'Customer conversations that shape trust, pipeline quality, and commercial follow-through.', matcher: (item) => item.category === 'Customer' },
  { key: 'bookingRequests', title: 'Booking Requests', body: 'New fitting and appointment requests that should move quickly.', matcher: (item) => item.category === 'Booking' },
  { key: 'supplierCommunications', title: 'Supplier Communications', body: 'Supplier issues, quotes, and invoice-related conversations that can affect margin or timing.', matcher: (item) => item.category === 'Supplier' },
  { key: 'finance', title: 'Finance', body: 'Invoices, approvals, payment timing, and finance-sensitive conversations.', matcher: (item) => item.category === 'Finance' },
  { key: 'marketing', title: 'Marketing', body: 'Campaigns, partnerships, newsletters, and brand-related conversations.', matcher: (item) => item.category === 'Marketing' || item.category === 'Newsletter' },
  { key: 'internal', title: 'Internal', body: 'Internal operating coordination, team updates, and executive coordination.', matcher: (item) => item.category === 'Internal' || item.category === 'Operations' },
  { key: 'recentlyCompleted', title: 'Recently Completed', body: 'Recent conversations that were handled and may still deserve context.', matcher: () => false }
]);

function text(value, fallback = '') {
  return value == null ? fallback : String(value);
}

function toId(value, fallback = 'email') {
  return text(value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function compactNumber(value = 0) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return '0';
  if (Math.abs(number) >= 1000) return `${(number / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(Math.round(number));
}

function priorityRank(priority = '') {
  const value = String(priority).toLowerCase();
  if (value === 'high') return 3;
  if (value === 'medium') return 2;
  return 1;
}

function sortItems(items = []) {
  return items
    .slice()
    .sort((left, right) => {
      const priorityDelta = priorityRank(right.priority) - priorityRank(left.priority);
      if (priorityDelta) return priorityDelta;
      const waitDelta = Number(right.waitingHours || 0) - Number(left.waitingHours || 0);
      if (waitDelta) return waitDelta;
      return text(right.receivedAt).localeCompare(text(left.receivedAt));
    });
}

function normalizeEmail(item = {}) {
  return {
    ...item,
    id: toId(item.id, item.subject || item.sender || 'email'),
    threadId: text(item.threadId, item.id),
    sender: text(item.sender),
    senderEmail: text(item.senderEmail),
    subject: text(item.subject),
    receivedAt: text(item.receivedAt),
    receivedTime: text(item.receivedTime || item.ageLabel || item.receivedAt),
    ageLabel: text(item.ageLabel || item.receivedTime),
    category: text(item.category, 'Customer'),
    priority: text(item.priority, 'Medium'),
    status: text(item.status, 'Review'),
    aiSummary: text(item.aiSummary || item.summary),
    customer: text(item.customer),
    supplier: text(item.supplier),
    action: text(item.action),
    waitingHours: Number(item.waitingHours || 0),
    unread: Boolean(item.unread),
    labels: (item.labels || []).map((entry) => text(entry)).filter(Boolean),
    route: text(item.route, '/executive-inbox')
  };
}

function buildMetrics(items = [], completed = [], existing = {}) {
  if (existing && Object.keys(existing).length) return existing;
  const waitingCustomerReplies = items.filter((item) => item.category === 'Customer' && /reply/i.test(item.status)).length;
  const supplierIssues = items.filter((item) => item.category === 'Supplier' && item.priority === 'High').length;
  const financeEmails = items.filter((item) => item.category === 'Finance').length;
  const bookingRequests = items.filter((item) => item.category === 'Booking').length;
  const unreadCritical = items.filter((item) => item.unread && item.priority === 'High').length;
  const needsReply = items.filter((item) => /reply/i.test(item.status)).length;
  return {
    unreadCritical,
    waitingCustomerReplies,
    supplierIssues,
    financeEmails,
    bookingRequests,
    needsReply,
    recentlyCompleted: completed.length
  };
}

function buildWidgets(metrics = {}, providerSummary = {}) {
  return [
    {
      iconName: 'alert-triangle',
      label: 'Unread Critical Emails',
      value: String(metrics.unreadCritical || 0),
      body: 'High-priority unread conversations that should not sit unseen.',
      meta: providerSummary.health || providerSummary.label || 'Executive Inbox'
    },
    {
      iconName: 'reply',
      label: 'Waiting Customer Replies',
      value: String(metrics.waitingCustomerReplies || 0),
      body: 'Customer conversations where delay now risks trust or conversion.',
      meta: 'Customer'
    },
    {
      iconName: 'building',
      label: 'Supplier Issues',
      value: String(metrics.supplierIssues || 0),
      body: 'Supplier items with operational, timing, or margin consequences.',
      meta: 'Supplier'
    },
    {
      iconName: 'coins',
      label: 'Finance Emails',
      value: String(metrics.financeEmails || 0),
      body: 'Invoices, approvals, and finance-sensitive conversations.',
      meta: 'Finance'
    },
    {
      iconName: 'target',
      label: 'Booking Requests',
      value: String(metrics.bookingRequests || 0),
      body: 'New or active booking demand currently visible in the inbox.',
      meta: 'Booking'
    },
    {
      iconName: 'check-circle',
      label: "Today's Executive Inbox Summary",
      value: `${metrics.needsReply || 0} live`,
      body: `${metrics.waitingCustomerReplies || 0} customer replies, ${metrics.supplierIssues || 0} supplier issues, ${metrics.financeEmails || 0} finance threads, and ${metrics.bookingRequests || 0} booking requests are currently visible.`,
      meta: providerSummary.account || providerSummary.state || 'Executive Inbox'
    }
  ];
}

function buildSections(items = [], completed = []) {
  return SECTION_DEFINITIONS.map((section) => ({
    key: section.key,
    title: section.title,
    body: section.body,
    items: section.key === 'recentlyCompleted' ? sortItems(completed) : sortItems(items.filter(section.matcher))
  }));
}

function buildSearchIndex(items = []) {
  return items.map((item) => ({
    id: `search-${item.id}`,
    type: 'Email',
    title: item.subject,
    body: [
      item.aiSummary,
      `Sender: ${item.sender}.`,
      item.customer ? `Customer: ${item.customer}.` : '',
      item.supplier ? `Supplier: ${item.supplier}.` : ''
    ].filter(Boolean).join(' '),
    route: item.route || '/executive-inbox',
    meta: `${item.category} · ${item.sender} · ${item.priority}`
  }));
}

function defaultSummary(metrics = {}) {
  const headline = `${metrics.waitingCustomerReplies || 0} customer enquiries require replies.`;
  const supplierLine = `${metrics.supplierIssues || 0} supplier issue${metrics.supplierIssues === 1 ? '' : 's'} require action.`;
  const bookingLine = `${metrics.bookingRequests || 0} fitting request${metrics.bookingRequests === 1 ? '' : 's'} arrived in the current inbox window.`;
  return {
    headline,
    body: `${headline} ${supplierLine} ${bookingLine}`,
    dailySummary: `${headline} ${metrics.financeEmails || 0} finance-related email${metrics.financeEmails === 1 ? '' : 's'} also remain visible.`,
    boardSummary: `${headline} ${supplierLine} ${bookingLine}`
  };
}

export function createCommunicationsService(registry) {
  return Object.freeze({
    getWorkspace() {
      const provider = registry.getDomainProvider('communications');
      const raw = deepClone(provider.getCommunicationsWorkspace());
      const inboxItems = sortItems((raw.inboxItems || []).map(normalizeEmail));
      const recentlyCompleted = sortItems((raw.recentlyCompleted || []).map(normalizeEmail));
      const metrics = buildMetrics(inboxItems, recentlyCompleted, raw.metrics || {});
      const providerSummary = {
        label: text(raw.providerSummary?.label, 'Demo fallback active'),
        body: text(raw.providerSummary?.body, 'Executive Inbox is currently using structured demo data.'),
        tone: text(raw.providerSummary?.tone, 'warn'),
        state: text(raw.providerSummary?.state, 'demo-fallback'),
        account: text(raw.providerSummary?.account),
        syncedAt: text(raw.providerSummary?.syncedAt),
        health: text(raw.providerSummary?.health, raw.providerSummary?.label || 'Demo Mode'),
        mode: text(raw.providerSummary?.mode, provider.mode || 'demo'),
        syncInterval: text(raw.providerSummary?.syncInterval, raw.providerSummary?.syncIntervalMinutes ? `${raw.providerSummary.syncIntervalMinutes} minutes` : '')
      };
      return {
        ...raw,
        summary: { ...defaultSummary(metrics), ...(raw.summary || {}) },
        metrics,
        widgets: raw.widgets || buildWidgets(metrics, providerSummary),
        providerSummary,
        inboxItems,
        recentlyCompleted,
        sections: buildSections(inboxItems, recentlyCompleted),
        approvalCards: deepClone(raw.approvalCards || []),
        timelineEvents: deepClone(raw.timelineEvents || []),
        memoryCandidates: deepClone(raw.memoryCandidates || []),
        searchIndex: raw.searchIndex || buildSearchIndex([...inboxItems, ...recentlyCompleted]),
        counts: {
          visible: inboxItems.length,
          completed: recentlyCompleted.length,
          total: inboxItems.length + recentlyCompleted.length,
          highPriority: inboxItems.filter((item) => item.priority === 'High').length,
          categories: [...new Set(inboxItems.map((item) => item.category))],
          compactTotal: compactNumber(inboxItems.length + recentlyCompleted.length)
        }
      };
    }
  });
}
