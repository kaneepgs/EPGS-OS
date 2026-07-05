import { normalizeCollection, normalizeMemoryEvent } from '../contracts/data-contracts.js';

export class EventStore {
  constructor(memoryStore) {
    this.memoryStore = memoryStore;
  }

  all() {
    return normalizeCollection(this.memoryStore.getCollection('timelineEvents'), normalizeMemoryEvent).sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
  }

  recent(limit = 6) {
    return this.all().slice(0, limit);
  }

  milestones(limit = 4) {
    return this.all().filter((entry) => /milestone|record|launch/i.test(`${entry.category} ${entry.title}`)).slice(0, limit);
  }

  categories() {
    return [...new Set(this.all().map((item) => item.category).filter(Boolean))];
  }
}
