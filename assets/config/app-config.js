export const APP_MODES = Object.freeze({
  demo: {
    key: 'demo',
    label: 'Demo Mode',
    description: 'The wider executive workspace stays demo-first, with optional provider-level overlays such as the Sprint 8 GA4 Website Analytics snapshot path.',
    allowLiveIntegrations: false,
    available: true
  },
  live: {
    key: 'live',
    label: 'Future Live Mode',
    description: 'Reserved for future API-backed providers once integrations are implemented and approved.',
    allowLiveIntegrations: true,
    available: false
  }
});

export const APP_CONFIG = Object.freeze({
  mode: APP_MODES.demo.key,
  defaultProviderKey: 'mock',
  shellName: 'EP Intelligence',
  architectureVersion: 'v0.4',
  providerStrategy: 'provider-service-intelligence-contract',
  notes: 'Sprint 9 adds a provider-independent Executive Memory and Knowledge Graph layer using structured files and local storage, while keeping the wider product in Demo Mode except for the selective GA4 Website Analytics snapshot path.'
});

export function currentModeConfig() {
  return APP_MODES[APP_CONFIG.mode] || APP_MODES.demo;
}

export function isDemoMode() {
  return APP_CONFIG.mode === APP_MODES.demo.key;
}
