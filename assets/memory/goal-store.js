import { normalizeCollection, normalizeStrategicGoal } from '../contracts/data-contracts.js';

export class GoalStore {
  constructor(memoryStore) {
    this.memoryStore = memoryStore;
  }

  all() {
    return normalizeCollection(this.memoryStore.getCollection('goals'), normalizeStrategicGoal).sort((a, b) => b.progress - a.progress);
  }

  active() {
    return this.all().filter((goal) => !/completed|archived/i.test(goal.status));
  }

  summary() {
    const goals = this.all();
    return {
      total: goals.length,
      onTrack: goals.filter((goal) => /on track/i.test(goal.status)).length,
      needsReview: goals.filter((goal) => /risk|review/i.test(goal.status)).length,
      averageProgress: Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / (goals.length || 1))
    };
  }
}
