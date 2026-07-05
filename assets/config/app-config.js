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
  architectureVersion: 'v0.3',
  providerStrategy: 'provider-service-intelligence-contract',
  notes: 'Sprint 8 keeps the wider product in Demo Mode while allowing Website Analytics to hydrate from a generated GA4 snapshot when credentials and a local sync are available.'
});

export function currentModeConfig() {
  return APP_MODES[APP_CONFIG.mode] || APP_MODES.demo;
}

export function isDemoMode() {
  return APP_CONFIG.mode === APP_MODES.demo.key;
}
