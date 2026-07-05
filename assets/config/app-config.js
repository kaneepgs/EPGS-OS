export const APP_MODES = Object.freeze({
  demo: {
    key: 'demo',
    label: 'Demo Mode',
    description: 'All executive workspaces run from structured mock providers only.',
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
  architectureVersion: 'v0.2',
  providerStrategy: 'provider-service-intelligence-contract',
  notes: 'Sprint 7 adds a deterministic executive intelligence engine on top of the Demo Mode integration framework without any live external connections.'
});

export function currentModeConfig() {
  return APP_MODES[APP_CONFIG.mode] || APP_MODES.demo;
}

export function isDemoMode() {
  return APP_CONFIG.mode === APP_MODES.demo.key;
}
