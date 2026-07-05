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
  architectureVersion: 'v0.6',
  providerStrategy: 'provider-service-intelligence-contract',
  notes: 'Sprint 11 packages GA4 and YouTube into a clearer Marketing Intelligence layer with hybrid live/demo source status, a proper marketing health score, executive reporting, and provider-independent memory milestones while the wider product stays Demo Mode.'
});

export function currentModeConfig() {
  return APP_MODES[APP_CONFIG.mode] || APP_MODES.demo;
}

export function isDemoMode() {
  return APP_CONFIG.mode === APP_MODES.demo.key;
}
