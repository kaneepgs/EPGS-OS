import { normalizeApproval } from '../contracts/data-contracts.js';

export function createApprovalService(registry) {
  return Object.freeze({
    getWorkspace() {
      const provider = registry.getDomainProvider('approval');
      const raw = provider.getApprovalWorkspace();
      const calendarRaw = registry.getProvider('calendar')?.getApprovalWorkspace?.() || {};
      const mergedGroups = {
        ...(raw.groups || {}),
        ...(calendarRaw.groups || {})
      };
      const groups = Object.fromEntries(
        Object.entries(mergedGroups).map(([name, entries]) => [name, entries.map((entry) => normalizeApproval(entry))])
      );
      return {
        ...raw,
        groups
      };
    }
  });
}
