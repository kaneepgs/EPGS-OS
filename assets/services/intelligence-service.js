import { INTELLIGENCE_CONFIG } from '../config/intelligence-config.js';
import { createExecutiveIntelligenceEngine } from '../intelligence/index.js';

export function createIntelligenceService(services) {
  const engine = createExecutiveIntelligenceEngine(INTELLIGENCE_CONFIG);
  const workspace = engine.run(services);

  return Object.freeze({
    getWorkspace() {
      return workspace;
    }
  });
}
