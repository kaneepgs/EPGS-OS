export const DATA_CONTRACTS = Object.freeze({
  kpi: ['id', 'label', 'value', 'body', 'trend', 'icon'],
  insight: ['id', 'eyebrow', 'title', 'body', 'tone'],
  executiveInsight: ['id', 'title', 'executiveSummary', 'supportingEvidence', 'confidenceScore', 'confidence', 'businessImpact', 'financialImpact', 'suggestedActions', 'responsibleDepartment', 'priority', 'timestamp'],
  executiveRecommendation: ['id', 'recommendation', 'why', 'expectedBenefit', 'risk', 'confidence', 'estimatedValue', 'suggestedOwner', 'priority', 'priorityScore'],
  timelineEvent: ['id', 'time', 'type', 'title', 'body'],
  memoryEvent: ['id', 'date', 'time', 'title', 'body', 'category', 'department', 'impact', 'relatedEntities'],
  executiveDecision: ['id', 'date', 'title', 'summary', 'reason', 'expectedOutcome', 'actualOutcome', 'owner', 'department', 'relatedKpis', 'status'],
  strategicGoal: ['id', 'title', 'summary', 'owner', 'department', 'deadline', 'progress', 'status', 'target', 'currentValue'],
  historicalContext: ['id', 'title', 'summary', 'department', 'route'],
  knowledgeNode: ['id', 'label', 'type', 'route', 'meta'],
  knowledgeEdge: ['id', 'from', 'to', 'relation', 'route'],
  approval: ['id', 'title', 'why', 'impact', 'risk', 'confidence'],
  opportunity: ['id', 'title', 'estimatedValue', 'effort', 'confidence', 'team', 'nextAction'],
  risk: ['id', 'title', 'severity', 'likelihood', 'financialImpact', 'department', 'mitigation'],
  aiRecommendation: ['id', 'question', 'answer', 'confidence', 'rationale'],
  report: ['id', 'title', 'body', 'route', 'category'],
  departmentSummary: ['id', 'department', 'score', 'status', 'trend', 'summary']
});

export function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function text(value, fallback = '') {
  return value == null ? fallback : String(value);
}

function identifier(value, fallback) {
  return text(value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function parseCompactNumber(value, fallback = 0) {
  if (typeof value === 'number') return value;
  if (value == null) return fallback;
  const source = String(value).trim().replace(/,/g, '');
  if (!source) return fallback;
  const match = source.match(/-?\d+(?:\.\d+)?/);
  if (!match) return fallback;
  let number = Number.parseFloat(match[0]);
  if (/\d(?:\.\d+)?\s*m\b/i.test(source)) number *= 1000000;
  else if (/\d(?:\.\d+)?\s*k\b/i.test(source)) number *= 1000;
  return number;
}

export function normalizeKpi(entry = {}) {
  return {
    ...entry,
    id: identifier(entry.id, entry.label || 'kpi'),
    label: text(entry.label),
    value: text(entry.value, '—'),
    body: text(entry.body),
    trend: text(entry.trend ?? entry.meta),
    meta: text(entry.meta ?? entry.trend),
    icon: text(entry.icon ?? entry.iconName, 'grid'),
    iconName: text(entry.iconName ?? entry.icon, 'grid')
  };
}

export function normalizeInsight(entry = {}) {
  return {
    ...entry,
    id: identifier(entry.id, entry.title || entry.eyebrow || 'insight'),
    eyebrow: text(entry.eyebrow),
    title: text(entry.title),
    body: text(entry.body),
    tone: text(entry.tone, 'neutral')
  };
}

export function normalizeExecutiveInsight(entry = {}) {
  return {
    ...entry,
    id: identifier(entry.id, entry.title || 'executive-insight'),
    title: text(entry.title),
    executiveSummary: text(entry.executiveSummary ?? entry.summary),
    supportingEvidence: (entry.supportingEvidence || []).map((item) => text(item)).filter(Boolean),
    confidenceScore: Number(entry.confidenceScore ?? 0),
    confidence: text(entry.confidence, 'Medium'),
    businessImpact: text(entry.businessImpact),
    financialImpact: text(entry.financialImpact),
    suggestedActions: (entry.suggestedActions || []).map((item) => text(item)).filter(Boolean),
    responsibleDepartment: text(entry.responsibleDepartment),
    priority: text(entry.priority, 'Medium'),
    timestamp: text(entry.timestamp)
  };
}

export function normalizeExecutiveRecommendation(entry = {}) {
  return {
    ...entry,
    id: identifier(entry.id, entry.recommendation || 'executive-recommendation'),
    recommendation: text(entry.recommendation),
    why: text(entry.why),
    expectedBenefit: text(entry.expectedBenefit),
    risk: text(entry.risk, 'Medium'),
    confidence: text(entry.confidence, 'Medium'),
    estimatedValue: text(entry.estimatedValue),
    suggestedOwner: text(entry.suggestedOwner),
    priority: text(entry.priority, 'Medium'),
    priorityScore: Number(entry.priorityScore ?? 0),
    tone: text(entry.tone, 'warn')
  };
}

export function normalizeTimelineEvent(entry = {}) {
  return {
    ...entry,
    id: identifier(entry.id, `${entry.time || 'event'}-${entry.title || 'timeline'}`),
    date: text(entry.date),
    time: text(entry.time),
    type: text(entry.type),
    title: text(entry.title),
    body: text(entry.body),
    category: text(entry.category ?? entry.type),
    department: text(entry.department),
    impact: text(entry.impact),
    relatedEntities: (entry.relatedEntities || []).map((item) => text(item)).filter(Boolean),
    status: text(entry.status),
    route: text(entry.route)
  };
}

export function normalizeMemoryEvent(entry = {}) {
  return normalizeTimelineEvent(entry);
}

export function normalizeExecutiveDecision(entry = {}) {
  return {
    ...entry,
    id: identifier(entry.id, entry.title || 'decision'),
    date: text(entry.date),
    title: text(entry.title),
    summary: text(entry.summary),
    reason: text(entry.reason),
    expectedOutcome: text(entry.expectedOutcome),
    actualOutcome: text(entry.actualOutcome),
    owner: text(entry.owner),
    department: text(entry.department),
    relatedKpis: (entry.relatedKpis || []).map((item) => text(item)).filter(Boolean),
    linkedGoalIds: (entry.linkedGoalIds || []).map((item) => text(item)).filter(Boolean),
    linkedTimelineEventIds: (entry.linkedTimelineEventIds || []).map((item) => text(item)).filter(Boolean),
    status: text(entry.status),
    route: text(entry.route)
  };
}

export function normalizeStrategicGoal(entry = {}) {
  return {
    ...entry,
    id: identifier(entry.id, entry.title || 'goal'),
    title: text(entry.title),
    summary: text(entry.summary),
    owner: text(entry.owner),
    department: text(entry.department),
    deadline: text(entry.deadline),
    progress: Number(entry.progress ?? 0),
    status: text(entry.status),
    target: text(entry.target),
    currentValue: text(entry.currentValue),
    linkedMetrics: (entry.linkedMetrics || []).map((item) => text(item)).filter(Boolean),
    linkedDecisionIds: (entry.linkedDecisionIds || []).map((item) => text(item)).filter(Boolean),
    route: text(entry.route)
  };
}

export function normalizeHistoricalContext(entry = {}) {
  return {
    ...entry,
    id: identifier(entry.id, entry.title || 'historical-context'),
    title: text(entry.title),
    summary: text(entry.summary),
    department: text(entry.department),
    route: text(entry.route),
    severity: text(entry.severity),
    referenceValues: (entry.referenceValues || []).map((item) => text(item)).filter(Boolean),
    linkedDecisionIds: (entry.linkedDecisionIds || []).map((item) => text(item)).filter(Boolean),
    tone: text(entry.tone, 'info')
  };
}

export function normalizeKnowledgeNode(entry = {}) {
  return {
    ...entry,
    id: identifier(entry.id, entry.label || 'knowledge-node'),
    label: text(entry.label),
    type: text(entry.type),
    route: text(entry.route),
    meta: text(entry.meta)
  };
}

export function normalizeKnowledgeEdge(entry = {}) {
  return {
    ...entry,
    id: identifier(entry.id, `${entry.from || 'node'}-${entry.relation || 'rel'}-${entry.to || 'node'}`),
    from: text(entry.from),
    to: text(entry.to),
    relation: text(entry.relation),
    route: text(entry.route)
  };
}

export function normalizeApproval(entry = {}) {
  return {
    ...entry,
    id: identifier(entry.id, entry.title || 'approval'),
    title: text(entry.title),
    why: text(entry.why),
    impact: text(entry.impact),
    risk: text(entry.risk, 'Moderate'),
    confidence: text(entry.confidence, 'Medium')
  };
}

export function normalizeOpportunity(entry = {}) {
  return {
    ...entry,
    id: identifier(entry.id, entry.title || 'opportunity'),
    title: text(entry.title),
    estimatedValue: text(entry.estimatedValue),
    effort: text(entry.effort),
    confidence: text(entry.confidence),
    team: text(entry.team),
    nextAction: text(entry.nextAction)
  };
}

export function normalizeRisk(entry = {}) {
  return {
    ...entry,
    id: identifier(entry.id, entry.title || 'risk'),
    title: text(entry.title),
    severity: text(entry.severity),
    likelihood: text(entry.likelihood),
    financialImpact: text(entry.financialImpact),
    department: text(entry.department),
    mitigation: text(entry.mitigation)
  };
}

export function normalizeAiRecommendation(entry = {}) {
  return {
    ...entry,
    id: identifier(entry.id, entry.question || entry.title || 'ai-recommendation'),
    question: text(entry.question ?? entry.title),
    answer: text(entry.answer ?? entry.body),
    confidence: text(entry.confidence, 'Demo Mode'),
    rationale: text(entry.rationale ?? entry.answer ?? entry.body)
  };
}

export function normalizeReport(entry = {}) {
  return {
    ...entry,
    id: identifier(entry.id, entry.title || entry.route || 'report'),
    title: text(entry.title),
    body: text(entry.body ?? entry.summary),
    route: text(entry.route),
    category: text(entry.category, 'Executive Report')
  };
}

export function normalizeDepartmentSummary(entry = {}) {
  return {
    ...entry,
    id: identifier(entry.id, entry.department || entry.module || 'department'),
    department: text(entry.department ?? entry.module),
    module: text(entry.module ?? entry.department),
    score: Number(entry.score ?? 0),
    status: text(entry.status),
    trend: text(entry.trend),
    summary: text(entry.summary)
  };
}

export function normalizeCollection(items = [], normalizer) {
  return items.map((item) => normalizer(item));
}
