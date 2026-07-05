export const DATA_CONTRACTS = Object.freeze({
  kpi: ['id', 'label', 'value', 'body', 'trend', 'icon'],
  insight: ['id', 'eyebrow', 'title', 'body', 'tone'],
  executiveInsight: ['id', 'title', 'executiveSummary', 'supportingEvidence', 'confidenceScore', 'confidence', 'businessImpact', 'financialImpact', 'suggestedActions', 'responsibleDepartment', 'priority', 'timestamp'],
  executiveRecommendation: ['id', 'recommendation', 'why', 'expectedBenefit', 'risk', 'confidence', 'estimatedValue', 'suggestedOwner', 'priority', 'priorityScore'],
  timelineEvent: ['id', 'time', 'type', 'title', 'body'],
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
    time: text(entry.time),
    type: text(entry.type),
    title: text(entry.title),
    body: text(entry.body)
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
