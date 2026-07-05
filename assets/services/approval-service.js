import { normalizeApproval } from '../contracts/data-contracts.js';

export function createApprovalService(registry) {
  return Object.freeze({
    getWorkspace() {
      const provider = registry.getDomainProvider('approval');
      const raw = provider.getApprovalWorkspace();
      const groups = Object.fromEntries(
        Object.entries(raw.groups || {}).map(([name, entries]) => [name, entries.map((entry) => normalizeApproval(entry))])
      );
      return {
        ...raw,
        groups
      };
    }
  });
}
