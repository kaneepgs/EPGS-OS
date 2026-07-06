import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'assets', 'data', 'generated');
const outFile = path.join(outDir, 'gmail-live-snapshot.json');
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users';
const SCOPE = 'https://www.googleapis.com/auth/gmail.readonly';
const DEFAULT_ACCOUNT = 'info@epgolfstudios.co.uk';
const WATCH_FOLDERS = ['INBOX', 'IMPORTANT', 'STARRED', 'SENT'];
const CLASSIFICATION_CATEGORIES = ['Customers', 'Bookings', 'Finance', 'Suppliers', 'Marketing', 'Reviews', 'Internal', 'Partners', 'Other'];
const OUTBOUND_ACTION_POLICY = Object.freeze({
  mode: 'approval-first',
  initialScope: 'Read-only inbox intelligence',
  automaticSending: false,
  automaticReplying: false,
  automaticArchiving: false,
  automaticDeleting: false,
  automaticLabelling: false,
  explicitApprovalRequired: true
});

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return null;
  const idx = trimmed.indexOf('=');
  return { key: trimmed.slice(0, idx).trim(), value: trimmed.slice(idx + 1).trim() };
}

async function loadEnv() {
  const candidateFiles = [
    process.env.GMAIL_ENV_FILE,
    path.join(rootDir, '.env.local'),
    path.join(rootDir, '.env')
  ].filter(Boolean);

  for (const file of candidateFiles) {
    try {
      const raw = await readFile(file, 'utf8');
      for (const line of raw.split(/\r?\n/)) {
        const parsed = parseEnvLine(line);
        if (!parsed) continue;
        if (!process.env[parsed.key]) process.env[parsed.key] = parsed.value;
      }
    } catch {
      // Ignore missing files.
    }
  }
}

function getEnv(name, fallback = '') {
  return process.env[name] || fallback;
}

function compactNumber(value) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return '0';
  if (Math.abs(number) >= 1000) return `${(number / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(Math.round(number));
}

function hoursBetween(isoDate) {
  const ts = new Date(isoDate).getTime();
  if (!Number.isFinite(ts)) return 0;
  return Math.max(0, Math.round((Date.now() - ts) / (1000 * 60 * 60)));
}

function ageLabel(hours) {
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function stripName(sender = '') {
  const source = String(sender || '').trim();
  if (!source) return 'Unknown sender';
  const match = source.match(/^(.*?)\s*</);
  if (match) return match[1].replace(/^"|"$/g, '').trim();
  return source.replace(/<.*?>/g, '').trim();
}

function emailFromHeader(sender = '') {
  const match = String(sender || '').match(/<([^>]+)>/);
  return match ? match[1].trim().toLowerCase() : String(sender || '').trim().toLowerCase();
}

function headerMap(headers = []) {
  return Object.fromEntries((headers || []).map((entry) => [String(entry.name || '').toLowerCase(), entry.value || '']));
}

function classifyEmail({ sender = '', senderEmail = '', subject = '', snippet = '', labels = [], account = '' }) {
  const text = `${sender} ${senderEmail} ${subject} ${snippet} ${(labels || []).join(' ')}`.toLowerCase();
  const accountDomain = String(account || '').split('@')[1] || '';
  const internalDomainMatch = accountDomain && senderEmail.endsWith(`@${accountDomain}`);

  if (/casino|crypto|forex|seo agency|viagra|loan|buy now/.test(text)) return 'Other';
  if (/booking|booked|appointment|availability|lesson request|fitting request|driver fitting|iron fitting/.test(text)) return 'Bookings';
  if (/invoice|vat|statement|payment|remittance|bill|overdue|receipt|quote approval/.test(text)) return 'Finance';
  if (/supplier|wholesale|trade account|purchase order|delivery|shipment|trackman|foresight|titleist/.test(text)) return 'Suppliers';
  if (/review|google review|testimonial|feedback/.test(text)) return 'Reviews';
  if (/partner|collaboration|affiliate|sponsor|sponsorship/.test(text)) return 'Partners';
  if (/unsubscribe|newsletter|mailchimp|campaign monitor|substack|digest|campaign|press|youtube|instagram|facebook|linkedin|content|marketing/.test(text)) return 'Marketing';
  if (/ops|operations|rota|staff|team|internal|project/.test(text) || internalDomainMatch) return 'Internal';
  return 'Customers';
}

function derivePriority({ category = 'Customers', subject = '', snippet = '', labels = [], unread = false, waitingHours = 0 }) {
  const text = `${subject} ${snippet} ${(labels || []).join(' ')}`.toLowerCase();
  const actionRequired = /action required|approval required|please confirm|needs approval|needs action|reply required|respond/i.test(text);
  if (/urgent|asap|today|immediately|overdue|failed|complaint|invoice dispute/.test(text)) return 'High';
  if (category === 'Bookings') return 'High';
  if (category === 'Finance') return 'High';
  if (category === 'Suppliers') return 'Medium';
  if (category === 'Customers' && waitingHours >= 24) return 'High';
  if (category === 'Marketing') return actionRequired ? 'Medium' : 'Low';
  return unread ? 'Medium' : 'Low';
}

function deriveStatus({ labels = [], unread = false, waitingHours = 0, category = '' }) {
  const labelSet = new Set(labels || []);
  if (labelSet.has('SENT') || labelSet.has('ARCHIVED')) return 'Completed';
  if (/marketing|other/i.test(category)) return unread ? 'Review' : 'Completed';
  if (unread) return 'Needs Reply';
  if (waitingHours >= 24) return 'Follow-up due';
  return 'Review';
}

function executiveSummary({ category, subject, snippet, waitingHours, sender }) {
  const waitText = waitingHours >= 24 ? `It has been waiting ${waitingHours} hours.` : waitingHours > 0 ? `It arrived ${waitingHours} hours ago.` : 'It is new in the inbox.';
  const trimmedSnippet = String(snippet || '').trim();
  switch (category) {
    case 'Bookings':
      return `${sender} is asking about a fitting or appointment. ${waitText} ${trimmedSnippet || 'This likely affects near-term booking demand.'}`.trim();
    case 'Finance':
      return `${sender} is driving a finance-sensitive thread. ${waitText} ${trimmedSnippet || 'This may affect approvals, payment timing, or cash clarity.'}`.trim();
    case 'Suppliers':
      return `${sender} is raising a supplier-related issue or quote. ${waitText} ${trimmedSnippet || 'This may affect margin, timing, or delivery continuity.'}`.trim();
    case 'Marketing':
      return `${sender} is driving a marketing or partnership thread. ${waitText} ${trimmedSnippet || 'This may influence content, reach, or authority.'}`.trim();
    case 'Internal':
      return `${sender} is driving an internal operating thread. ${waitText} ${trimmedSnippet || 'This may affect coordination or execution.'}`.trim();
    default:
      return `${sender} requires review. ${waitText} ${trimmedSnippet || subject}`.trim();
  }
}

async function getAccessToken() {
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: getEnv('GMAIL_CLIENT_ID').trim(),
      client_secret: getEnv('GMAIL_CLIENT_SECRET').trim(),
      refresh_token: getEnv('GMAIL_REFRESH_TOKEN').trim(),
      grant_type: 'refresh_token'
    })
  });

  if (!response.ok) {
    throw new Error(`Gmail token request failed (${response.status}): ${await response.text()}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function fetchJson(url, accessToken) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Gmail API ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

async function listMessages({ account, accessToken, query, maxResults = 16 }) {
  const url = new URL(`${GMAIL_API_BASE}/${encodeURIComponent(account)}/messages`);
  url.searchParams.set('q', query);
  url.searchParams.set('maxResults', String(maxResults));
  return fetchJson(url, accessToken);
}

async function getMessage({ account, accessToken, id }) {
  const url = new URL(`${GMAIL_API_BASE}/${encodeURIComponent(account)}/messages/${id}`);
  url.searchParams.set('format', 'metadata');
  ['From', 'Subject', 'Date'].forEach((header) => url.searchParams.append('metadataHeaders', header));
  return fetchJson(url, accessToken);
}

async function fetchMessages({ account, accessToken, messages = [] }) {
  const out = [];
  for (const entry of messages) {
    const message = await getMessage({ account, accessToken, id: entry.id });
    const headers = headerMap(message.payload?.headers || []);
    const sender = stripName(headers.from || 'Unknown sender');
    const senderEmail = emailFromHeader(headers.from || sender);
    const receivedAt = new Date(headers.date || message.internalDate || Date.now()).toISOString();
    const waitingHours = hoursBetween(receivedAt);
    const unread = (message.labelIds || []).includes('UNREAD');
    const category = classifyEmail({
      sender,
      senderEmail,
      subject: headers.subject || '(No subject)',
      snippet: message.snippet || '',
      labels: message.labelIds || [],
      account
    });
    const priority = derivePriority({
      category,
      subject: headers.subject || '(No subject)',
      snippet: message.snippet || '',
      labels: message.labelIds || [],
      unread,
      waitingHours
    });
    const status = deriveStatus({ labels: message.labelIds || [], unread, waitingHours, category });

    out.push({
      id: message.id,
      threadId: message.threadId,
      sender,
      senderEmail,
      subject: headers.subject || '(No subject)',
      receivedAt,
      receivedTime: ageLabel(waitingHours),
      ageLabel: ageLabel(waitingHours),
      category,
      priority,
      status,
      aiSummary: executiveSummary({ category, subject: headers.subject || '(No subject)', snippet: message.snippet || '', waitingHours, sender }),
      customer: category === 'Customers' || category === 'Bookings' ? sender : '',
      supplier: category === 'Suppliers' ? sender : '',
      action: category === 'Bookings' || category === 'Customers' ? 'Draft Reply' : category === 'Finance' ? 'Review Finance Action' : category === 'Suppliers' ? 'Review Supplier Issue' : 'Assess',
      suggestedReply: buildSuggestedReply({ category, sender }),
      requiresApproval: true,
      waitingHours,
      unread,
      labels: message.labelIds || [],
      route: '/executive-inbox'
    });
  }
  return out;
}

function buildSuggestedReply(item = {}) {
  if (item.category === 'Bookings') return `Hi ${item.sender}, thanks for getting in touch with EP Golf Studios. We can help with the fitting enquiry — could you share your preferred days/times and what part of the bag you would like to focus on?`;
  if (item.category === 'Customers') return `Hi ${item.sender}, thanks for your message. I’ll review this properly and come back to you with the next best step shortly.`;
  if (item.category === 'Finance') return `Hi ${item.sender}, thanks for sending this through. I’ll review the finance details and confirm the appropriate next step once approved.`;
  if (item.category === 'Suppliers') return `Hi ${item.sender}, thanks for the update. I’ll review the supplier details and come back once the next action has been confirmed.`;
  return `Hi ${item.sender}, thanks for your message. I’ll review and come back if any action is needed.`;
}

function buildApprovalCards(items = []) {
  const templates = [
    { action: 'Draft Suggested Reply', matcher: (item) => item.category === 'Customers' || item.category === 'Bookings', impact: 'Customer trust / conversion' },
    { action: 'Review Finance Action', matcher: (item) => item.category === 'Finance', impact: 'Cash timing / approval visibility' },
    { action: 'Review Supplier Issue', matcher: (item) => item.category === 'Suppliers', impact: 'Operational continuity' },
    { action: 'Prepare Follow-up', matcher: (item) => /follow-up|reply/i.test(item.status) || item.waitingHours >= 24, impact: 'Response timing' },
    { action: 'Summarise Marketing Notification', matcher: (item) => item.category === 'Marketing', impact: 'Signal filtering' },
    { action: 'Escalate for Approval', matcher: (item) => item.priority === 'High', impact: 'Executive oversight' }
  ];

  return templates
    .map((template, index) => {
      const item = items.find(template.matcher) || items[index] || items[0];
      if (!item) return null;
      return {
        id: `gmail-approval-${index + 1}-${item.id}`,
        title: `${template.action} — ${item.subject}`,
        why: item.aiSummary,
        impact: `${template.impact} · ${item.sender}`,
        risk: item.priority === 'High' ? 'High' : 'Medium',
        confidence: item.priority === 'High' ? 'High' : 'Medium',
        suggestedReply: buildSuggestedReply(item),
        requiresApproval: true,
        executionPolicy: 'Preview only. Do not send, reply, archive, delete, or label without explicit approval.'
      };
    })
    .filter(Boolean);
}

function buildTimelineEvents(items = []) {
  const important = items.filter((item) => item.priority === 'High').slice(0, 5);
  return important.map((item, index) => ({
    id: `gmail-timeline-${index + 1}-${item.id}`,
    date: String(item.receivedAt || '').slice(0, 10),
    time: item.receivedTime,
    title: item.category === 'Bookings'
      ? 'High-value booking request received'
      : item.category === 'Suppliers'
        ? 'Major supplier conversation needs action'
        : item.category === 'Finance'
          ? 'Finance-sensitive email entered the executive queue'
          : 'Executive inbox priority escalated',
    body: `${item.subject} — ${item.aiSummary}`,
    category: `${item.category} email`,
    department: item.category === 'Finance' ? 'Finance' : item.category === 'Suppliers' ? 'Operations / Finance' : item.category === 'Bookings' ? 'Sales / Customer' : 'Executive Inbox',
    impact: item.priority,
    relatedEntities: ['goal-booking-conversion', 'decision-ga4-live-snapshot'],
    status: item.status,
    route: '/executive-inbox'
  }));
}

function buildMemoryCandidates(items = []) {
  return items
    .filter((item) => item.priority === 'High' && /(Customers|Suppliers|Finance|Bookings)/.test(item.category))
    .slice(0, 4)
    .map((item, index) => ({
      id: `gmail-memory-${index + 1}-${item.id}`,
      date: String(item.receivedAt || '').slice(0, 10),
      time: item.receivedTime,
      title: item.subject,
      body: item.aiSummary,
      category: `${item.category} conversation`,
      department: item.category === 'Finance' ? 'Finance' : item.category === 'Suppliers' ? 'Operations / Finance' : 'Customer',
      impact: item.priority,
      relatedEntities: ['goal-booking-conversion'],
      status: item.status,
      route: '/executive-inbox'
    }));
}

function buildWidgets(metrics, account) {
  return [
    { iconName: 'alert-triangle', label: 'Unread Critical Emails', value: String(metrics.unreadCritical), body: 'High-priority unread conversations.', meta: account },
    { iconName: 'reply', label: 'Waiting Customer Replies', value: String(metrics.waitingCustomerReplies), body: 'Customer replies currently waiting.', meta: 'Customer' },
    { iconName: 'building', label: 'Supplier Issues', value: String(metrics.supplierIssues), body: 'Supplier items that require action.', meta: 'Supplier' },
    { iconName: 'coins', label: 'Finance Emails', value: String(metrics.financeEmails), body: 'Finance-sensitive conversations in scope.', meta: 'Finance' },
    { iconName: 'target', label: 'Booking Requests', value: String(metrics.bookingRequests), body: 'Current fitting and booking demand in Gmail.', meta: 'Booking' },
    { iconName: 'check-circle', label: "Today's Executive Inbox Summary", value: `${metrics.needsReply} live`, body: `${metrics.waitingCustomerReplies} customer replies, ${metrics.supplierIssues} supplier issues, and ${metrics.bookingRequests} fitting requests need attention.`, meta: account }
  ];
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
    route: '/executive-inbox',
    meta: `${item.category} · ${item.sender} · ${item.priority}`
  }));
}

function buildMetrics(items = [], completed = []) {
  return {
    unreadCritical: items.filter((item) => item.unread && item.priority === 'High').length,
    waitingCustomerReplies: items.filter((item) => item.category === 'Customers' && /reply/i.test(item.status)).length,
    supplierIssues: items.filter((item) => item.category === 'Suppliers' && item.priority === 'High').length,
    financeEmails: items.filter((item) => item.category === 'Finance').length,
    bookingRequests: items.filter((item) => item.category === 'Bookings').length,
    needsReply: items.filter((item) => /reply|follow-up/i.test(item.status)).length,
    recentlyCompleted: completed.length
  };
}

function mapGmailError(message = '') {
  const value = String(message || 'Unknown Gmail sync error.');
  if (/invalid_grant|unauthorized_client|invalid_client/i.test(value)) return 'Gmail OAuth credentials were rejected. Demo fallback remains active.';
  if (/invalid_scope/i.test(value)) return 'Gmail OAuth scope is invalid. Demo fallback remains active.';
  if (/insufficient/i.test(value)) return 'Gmail OAuth credentials do not currently allow inbox access. Demo fallback remains active.';
  return 'Gmail request failed. Demo fallback remains active.';
}

function buildFallback(reason) {
  return {
    integrationId: 'gmail',
    available: false,
    status: 'Demo Fallback',
    state: 'demo-fallback',
    source: 'MockProvider',
    reason,
    checkedAt: new Date().toISOString(),
    notes: 'Executive Inbox will stay in Demo Mode until valid Gmail OAuth credentials are added and npm run gmail:sync is run again.'
  };
}

async function main() {
  await loadEnv();
  await mkdir(outDir, { recursive: true });

  const required = ['GMAIL_CLIENT_ID', 'GMAIL_CLIENT_SECRET', 'GMAIL_REFRESH_TOKEN', 'GMAIL_ACCOUNT'];
  const missing = required.filter((key) => !getEnv(key).trim());
  if (missing.length) {
    const payload = buildFallback(`Missing required Gmail configuration: ${missing.join(', ')}.`);
    await writeFile(outFile, JSON.stringify(payload, null, 2));
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  try {
    const account = getEnv('GMAIL_ACCOUNT', DEFAULT_ACCOUNT).trim();
    const syncIntervalMinutes = Number(getEnv('GMAIL_SYNC_INTERVAL_MINUTES', '15')) || 15;
    const accessToken = await getAccessToken();

    const inboxList = await listMessages({
      account,
      accessToken,
      query: 'newer_than:14d {in:inbox is:important is:starred} -category:promotions -category:social',
      maxResults: 18
    });

    const sentList = await listMessages({
      account,
      accessToken,
      query: 'newer_than:14d in:sent',
      maxResults: 8
    });

    const inboxItems = await fetchMessages({ account, accessToken, messages: inboxList.messages || [] });
    const sentItems = await fetchMessages({ account, accessToken, messages: sentList.messages || [] });
    const recentlyCompleted = sentItems.map((item) => ({ ...item, unread: false, status: 'Completed', priority: item.priority === 'High' ? 'Medium' : item.priority }));
    const metrics = buildMetrics(inboxItems, recentlyCompleted);
    const widgets = buildWidgets(metrics, account);
    const approvalCards = buildApprovalCards(inboxItems);
    const timelineEvents = buildTimelineEvents(inboxItems);
    const memoryCandidates = buildMemoryCandidates(inboxItems);

    const payload = {
      integrationId: 'gmail',
      available: true,
      status: 'Live executive inbox',
      state: 'live-gmail',
      source: 'Gmail API',
      account,
      syncedAt: new Date().toISOString(),
      notes: 'Executive Inbox is live through generated read-only Gmail snapshots. Suggested replies are preview-only. Sending, replying, archiving, deleting, and labelling are disabled unless explicitly approved through a future execution gateway.',
      meta: {
        providerHealth: 'Healthy',
        syncIntervalMinutes,
        unreadCount: inboxItems.filter((item) => item.unread).length,
        fetchedMessageCount: inboxItems.length,
        repliedCount: recentlyCompleted.length,
        olderThan24Hours: inboxItems.filter((item) => item.waitingHours >= 24).length,
        scope: SCOPE,
        initialScope: OUTBOUND_ACTION_POLICY.initialScope,
        watchFolders: WATCH_FOLDERS,
        classificationCategories: CLASSIFICATION_CATEGORIES,
        priorityRules: [
          'Customer enquiries over 24 hours old = High',
          'Booking enquiries = High',
          'Supplier issues = Medium',
          'Finance actions = High',
          'Marketing notifications = Low unless action required'
        ],
        outboundActionPolicy: OUTBOUND_ACTION_POLICY,
        suggestedRepliesEnabled: true,
        classificationVersion: 'gmail-provider-v2-epgs-readonly'
      },
      communications: {
        providerSummary: {
          label: 'Live Gmail snapshot active',
          tone: 'good'
        },
        summary: {
          headline: `${metrics.waitingCustomerReplies} customer enquiries require replies.`,
          body: `${metrics.waitingCustomerReplies} customer enquiries require replies. ${metrics.supplierIssues} supplier issue${metrics.supplierIssues === 1 ? '' : 's'} require action. ${metrics.bookingRequests} fitting request${metrics.bookingRequests === 1 ? '' : 's'} arrived in the current inbox window.`,
          dailySummary: `${metrics.waitingCustomerReplies} customer enquiries require replies. ${metrics.financeEmails} finance email${metrics.financeEmails === 1 ? '' : 's'} and ${metrics.bookingRequests} booking request${metrics.bookingRequests === 1 ? '' : 's'} should stay visible in the CEO briefing.`,
          boardSummary: `${metrics.waitingCustomerReplies} customer enquiries require replies, ${metrics.supplierIssues} supplier issue${metrics.supplierIssues === 1 ? '' : 's'} need action, and ${metrics.bookingRequests} fitting request${metrics.bookingRequests === 1 ? '' : 's'} arrived in the current inbox window.`
        },
        metrics,
        widgets,
        inboxItems,
        recentlyCompleted,
        approvalCards,
        timelineEvents,
        memoryCandidates,
        searchIndex: buildSearchIndex([...inboxItems, ...recentlyCompleted])
      }
    };

    await writeFile(outFile, JSON.stringify(payload, null, 2));
    console.log(JSON.stringify(payload, null, 2));
  } catch (error) {
    const payload = buildFallback(mapGmailError(error?.message || 'Unknown Gmail sync error.'));
    await writeFile(outFile, JSON.stringify(payload, null, 2));
    console.log(JSON.stringify(payload, null, 2));
    process.exitCode = 1;
  }
}

main();
