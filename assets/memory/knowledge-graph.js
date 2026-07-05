import { normalizeCollection, normalizeKnowledgeEdge, normalizeKnowledgeNode } from '../contracts/data-contracts.js';

function node(id, label, type, extras = {}) {
  return normalizeKnowledgeNode({ id, label, type, ...extras });
}

function edge(from, to, relation, extras = {}) {
  return normalizeKnowledgeEdge({ from, to, relation, ...extras });
}

export function buildKnowledgeGraph({ timeline = [], decisions = [], goals = [], context = [], executive = {}, approvals = [], recommendations = [], risks = [], opportunities = [], actions = [] } = {}) {
  const nodes = [];
  const edges = [];
  const pushNode = (value) => {
    if (!nodes.find((item) => item.id === value.id)) nodes.push(value);
  };
  const pushEdge = (value) => {
    if (!edges.find((item) => item.id === value.id)) edges.push(value);
  };

  (executive.departmentHealth || []).forEach((item) => pushNode(node(`dept-${item.department}`, item.department, 'Department', { route: '/ceo' })));
  timeline.forEach((item) => pushNode(node(item.id, item.title, 'Timeline Event', { route: item.route, meta: item.category })));
  decisions.forEach((item) => pushNode(node(item.id, item.title, 'Decision', { route: item.route, meta: item.status })));
  goals.forEach((item) => pushNode(node(item.id, item.title, 'Goal', { route: item.route, meta: `${item.progress}%` })));
  context.forEach((item) => pushNode(node(item.id, item.title, 'Historical Context', { route: item.route })));
  risks.forEach((item, index) => pushNode(node(`risk-${index + 1}`, item.title, 'Risk', { route: '/ceo', meta: item.severity })));
  opportunities.forEach((item, index) => pushNode(node(`opportunity-${index + 1}`, item.title, 'Opportunity', { route: '/ceo', meta: item.estimatedValue })));
  approvals.forEach((item, index) => pushNode(node(`approval-${index + 1}`, item.title, 'Approval', { route: '/approvals', meta: item.confidence })));
  actions.forEach((item) => pushNode(node(item.id, item.title, 'Action', { route: item.detailRoute || '/executive-action-centre/action-detail', meta: `${item.status} · ${item.priority}` })));
  recommendations.forEach((item) => pushNode(node(item.id, item.recommendation, 'Recommendation', { route: '/ceo', meta: item.priority })));

  timeline.forEach((item) => {
    (item.relatedEntities || []).forEach((relatedId) => pushEdge(edge(item.id, relatedId, 'references', { route: item.route })));
    if (item.department) pushEdge(edge(item.id, `dept-${item.department.split(' / ')[0]}`, 'belongs-to', { route: item.route }));
  });

  decisions.forEach((item) => {
    (item.linkedGoalIds || []).forEach((goalId) => pushEdge(edge(item.id, goalId, 'supports', { route: item.route })));
    (item.linkedTimelineEventIds || []).forEach((eventId) => pushEdge(edge(item.id, eventId, 'was-shaped-by', { route: item.route })));
    if (item.department) pushEdge(edge(item.id, `dept-${item.department.split(' / ')[0]}`, 'owned-by', { route: item.route }));
  });

  goals.forEach((item) => {
    (item.linkedDecisionIds || []).forEach((decisionId) => pushEdge(edge(item.id, decisionId, 'depends-on', { route: item.route })));
    if (item.department) pushEdge(edge(item.id, `dept-${item.department.split(' / ')[0]}`, 'belongs-to', { route: item.route }));
  });

  context.forEach((item) => {
    (item.linkedDecisionIds || []).forEach((decisionId) => pushEdge(edge(item.id, decisionId, 'explains', { route: item.route })));
    if (item.department) pushEdge(edge(item.id, `dept-${item.department.split(' / ')[0]}`, 'relates-to', { route: item.route }));
  });

  actions.forEach((item) => {
    (item.relatedDecisions || []).forEach((decisionTitle) => {
      const decision = decisions.find((entry) => entry.title === decisionTitle || entry.id === decisionTitle);
      if (decision) pushEdge(edge(item.id, decision.id, 'references', { route: item.detailRoute || '/executive-action-centre/action-detail' }));
    });
    if (item.department) pushEdge(edge(item.id, `dept-${item.department.split(' / ')[0]}`, 'owned-by', { route: item.detailRoute || '/executive-action-centre/action-detail' }));
  });

  recommendations.slice(0, 4).forEach((item) => {
    const goal = goals.find((entry) => (entry.linkedMetrics || []).some((metric) => item.recommendation.toLowerCase().includes(metric.toLowerCase().split(' ')[0])));
    if (goal) pushEdge(edge(item.id, goal.id, 'supports', { route: '/ceo' }));
  });

  return {
    nodes: normalizeCollection(nodes, normalizeKnowledgeNode),
    edges: normalizeCollection(edges, normalizeKnowledgeEdge),
    summary: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      types: [...new Set(nodes.map((item) => item.type))]
    }
  };
}
