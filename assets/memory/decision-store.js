import { normalizeCollection, normalizeExecutiveDecision } from '../contracts/data-contracts.js';

export class DecisionStore {
  constructor(memoryStore) {
    this.memoryStore = memoryStore;
  }

  all() {
    return normalizeCollection(this.memoryStore.getCollection('decisions'), normalizeExecutiveDecision).sort((a, b) => `${b.date} ${b.title}`.localeCompare(`${a.date} ${a.title}`));
  }

  recent(limit = 6) {
    return this.all().slice(0, limit);
  }

  byStatus(status) {
    return this.all().filter((entry) => entry.status === status);
  }

  summary() {
    const all = this.all();
    return {
      total: all.length,
      active: all.filter((item) => /active|pending/i.test(item.status)).length,
      completed: all.filter((item) => /completed/i.test(item.status)).length,
      linkedGoals: new Set(all.flatMap((item) => item.linkedGoalIds || [])).size
    };
  }
}
