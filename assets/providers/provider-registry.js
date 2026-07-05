import { APP_CONFIG, APP_MODES, currentModeConfig } from '../config/app-config.js';
import { INTEGRATION_REGISTRY } from '../config/integration-registry.js';
import { MockProvider } from './mock-provider.js';
import { createFutureProviders } from './future-providers.js';

export function createProviderRegistry({ source, mode = APP_CONFIG.mode } = {}) {
  const mockProvider = new MockProvider({ source, mode });
  const futureProviders = createFutureProviders();
  const catalog = {
    mock: mockProvider,
    ...futureProviders
  };

  const domainBindings = {
    executive: mockProvider,
    finance: mockProvider,
    marketing: mockProvider,
    approval: mockProvider,
    report: mockProvider,
    timeline: mockProvider,
    ai: mockProvider,
    settings: mockProvider
  };

  return Object.freeze({
    mode,
    getModeSummary() {
      return {
        activeMode: currentModeConfig(),
        availableModes: Object.values(APP_MODES),
        defaultProviderKey: APP_CONFIG.defaultProviderKey,
        providerStrategy: APP_CONFIG.providerStrategy,
        notes: APP_CONFIG.notes
      };
    },
    getDomainProvider(domain) {
      return domainBindings[domain] || mockProvider;
    },
    getProvider(key) {
      return catalog[key] || mockProvider;
    },
    listProviders() {
      return Object.values(catalog).map((provider) => provider.describe());
    },
    describeBindings() {
      return Object.entries(domainBindings).map(([domain, provider]) => ({
        domain,
        provider: provider.label,
        providerKey: provider.key,
        mode: provider.mode || mode
      }));
    },
    listIntegrations() {
      return INTEGRATION_REGISTRY.map((entry) => ({
        ...entry,
        mode,
        status: mode === APP_MODES.demo.key ? 'Demo Mode' : 'Not Configured'
      }));
    }
  });
}
