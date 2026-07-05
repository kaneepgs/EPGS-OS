import { normalizeCollection, normalizeReport } from '../contracts/data-contracts.js';

export function createReportService(registry) {
  return Object.freeze({
    getWorkspace() {
      const provider = registry.getDomainProvider('report');
      const raw = provider.getReportsWorkspace();
      return {
        ...raw,
        overview: normalizeCollection(raw.overview || [], normalizeReport)
      };
    }
  });
}
