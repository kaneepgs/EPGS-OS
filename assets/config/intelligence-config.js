export const INTELLIGENCE_CONFIG = Object.freeze({
  version: 'v0.1',
  notes: 'Deterministic executive reasoning layer for Demo Mode. No external AI or live APIs are used.',
  weights: {
    health: {
      cfo: {
        revenueMomentum: 0.2,
        marginQuality: 0.25,
        cashResilience: 0.25,
        workingCapital: 0.15,
        governance: 0.15
      },
      cmo: {
        audienceMomentum: 0.2,
        engagementQuality: 0.2,
        conversionStrength: 0.25,
        channelFocus: 0.15,
        executionCadence: 0.2
      },
      ceo: {
        finance: 0.35,
        marketing: 0.25,
        customerTrust: 0.15,
        operationsDelivery: 0.15,
        governance: 0.1
      },
      overall: {
        ceo: 0.4,
        cfo: 0.3,
        cmo: 0.3
      }
    },
    priority: {
      financialImpact: 0.3,
      customerImpact: 0.2,
      strategicImportance: 0.2,
      timeSensitivity: 0.15,
      confidence: 0.15
    }
  },
  thresholds: {
    health: {
      strong: 85,
      stable: 75,
      watch: 65
    },
    priority: {
      high: 75,
      medium: 55
    },
    confidence: {
      high: 80,
      medium: 60
    }
  }
});
