import {
  normalizeAiRecommendation,
  normalizeApproval,
  normalizeCollection,
  normalizeDepartmentSummary,
  normalizeKpi,
  normalizeOpportunity,
  normalizeRisk
} from '../contracts/data-contracts.js';

export function createExecutiveService(registry, { timelineService } = {}) {
  return Object.freeze({
    getBrand() {
      return registry.getDomainProvider('executive').getBrand();
    },
    getCeoDashboard() {
      const provider = registry.getDomainProvider('executive');
      const raw = provider.getCeoDashboard();
      return {
        ...raw,
        businessTimeline: timelineService ? timelineService.getBusinessTimeline() : raw.businessTimeline,
        executiveKpis: normalizeCollection(raw.executiveKpis || [], normalizeKpi),
        executiveRisks: normalizeCollection(raw.executiveRisks || [], normalizeRisk),
        executiveOpportunities: normalizeCollection(raw.executiveOpportunities || [], normalizeOpportunity),
        approvalSummary: normalizeCollection(raw.approvalSummary || [], normalizeApproval),
        departmentHealth: normalizeCollection(raw.departmentHealth || [], normalizeDepartmentSummary),
        businessHealthScore: {
          ...raw.businessHealthScore,
          modules: normalizeCollection(raw.businessHealthScore?.modules || [], normalizeDepartmentSummary)
        },
        askExamples: normalizeCollection((raw.askExamples || []).map((entry) => ({ ...entry, confidence: 'Demo Mode' })), normalizeAiRecommendation)
      };
    },
    getAiWorkspace() {
      const provider = registry.getDomainProvider('ai');
      const raw = provider.getAiWorkspace();
      return {
        ...raw,
        askWorkspace: {
          ...raw.askWorkspace,
          prompts: normalizeCollection((raw.askWorkspace?.prompts || []).map((entry) => ({ ...entry, confidence: 'Demo Mode' })), normalizeAiRecommendation)
        }
      };
    },
    getPlaceholderModules() {
      return registry.getDomainProvider('executive').getPlaceholderModules();
    },
    getShortcuts() {
      return registry.getDomainProvider('executive').getShortcuts();
    }
  });
}
