import { deepClone } from '../contracts/data-contracts.js';

function hasLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function mergeHistory(baseHistory = [], persistedHistory = []) {
  const all = [...baseHistory, ...persistedHistory].filter(Boolean);
  const seen = new Set();
  return all
    .filter((item) => {
      const key = `${item.timestamp || item.date || ''}-${item.type || ''}-${item.status || ''}-${item.summary || ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((left, right) => `${right.timestamp || right.date || ''}`.localeCompare(`${left.timestamp || left.date || ''}`));
}

function mergeAction(base = {}, persisted = {}) {
  return {
    ...deepClone(base),
    ...deepClone(persisted),
    history: mergeHistory(base.history || [], persisted.history || [])
  };
}

export class ActionStore {
  constructor({ key = 'ep-intelligence.executive-actions.v2.0' } = {}) {
    this.key = key;
    this.state = this.load();
  }

  load() {
    if (!hasLocalStorage()) return { actions: {} };
    try {
      return JSON.parse(window.localStorage.getItem(this.key) || '{"actions":{}}');
    } catch {
      return { actions: {} };
    }
  }

  persist() {
    if (!hasLocalStorage()) return;
    window.localStorage.setItem(this.key, JSON.stringify(this.state));
  }

  merge(actions = []) {
    return actions.map((action) => mergeAction(action, this.state.actions?.[action.id] || {}));
  }

  snapshot() {
    return deepClone(this.state);
  }
}
