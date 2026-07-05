import { deepClone } from '../contracts/data-contracts.js';
import { EXECUTIVE_MEMORY_SEED } from './memory-seed.js';

function hasLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function mergeCollections(seed = [], persisted = []) {
  if (!Array.isArray(persisted) || !persisted.length) return deepClone(seed);
  const index = new Map(seed.map((item) => [item.id, deepClone(item)]));
  persisted.forEach((item) => {
    const existing = index.get(item.id) || {};
    index.set(item.id, { ...existing, ...deepClone(item) });
  });
  return Array.from(index.values());
}

function mergeState(seed, persisted = {}) {
  return {
    version: persisted.version || seed.version,
    retention: { ...deepClone(seed.retention), ...(persisted.retention || {}) },
    timelineEvents: mergeCollections(seed.timelineEvents, persisted.timelineEvents),
    decisions: mergeCollections(seed.decisions, persisted.decisions),
    goals: mergeCollections(seed.goals, persisted.goals),
    context: {
      recurringIssues: mergeCollections(seed.context.recurringIssues, persisted.context?.recurringIssues),
      historicalTrends: mergeCollections(seed.context.historicalTrends, persisted.context?.historicalTrends),
      strategicThemes: persisted.context?.strategicThemes?.length ? deepClone(persisted.context.strategicThemes) : deepClone(seed.context.strategicThemes),
      memoryHighlights: mergeCollections(seed.context.memoryHighlights, persisted.context?.memoryHighlights)
    }
  };
}

export class MemoryStore {
  constructor({ key = 'ep-intelligence.executive-memory.v0.1', seed = EXECUTIVE_MEMORY_SEED } = {}) {
    this.key = key;
    this.seed = deepClone(seed);
    this.state = this.load();
    this.persist();
  }

  load() {
    if (!hasLocalStorage()) return mergeState(this.seed);
    try {
      const raw = window.localStorage.getItem(this.key);
      if (!raw) return mergeState(this.seed);
      return mergeState(this.seed, JSON.parse(raw));
    } catch {
      return mergeState(this.seed);
    }
  }

  persist() {
    if (!hasLocalStorage()) return;
    window.localStorage.setItem(this.key, JSON.stringify(this.state));
  }

  getState() {
    return deepClone(this.state);
  }

  getCollection(key) {
    return deepClone(this.state[key] || []);
  }

  getContext() {
    return deepClone(this.state.context || {});
  }

  getRetention() {
    return deepClone(this.state.retention || {});
  }

  isInitialized() {
    return Boolean(this.state?.timelineEvents?.length && this.state?.decisions?.length && this.state?.goals?.length);
  }
}
