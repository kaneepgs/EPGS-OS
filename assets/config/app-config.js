import { RELEASE_CONFIG } from './release-config.js';

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
  shellName: RELEASE_CONFIG.productName,
  architectureVersion: 'v0.7',
  providerStrategy: 'provider-service-intelligence-contract',
  releaseVersion: RELEASE_CONFIG.version,
  releaseLabel: RELEASE_CONFIG.releaseLabel,
  releaseCodename: RELEASE_CONFIG.codename,
  notes: 'Sprint 13 adds a Gmail-backed Executive Inbox path through the existing provider/service/intelligence architecture, preserving demo-first behaviour while allowing selective GA4, YouTube, and Gmail snapshot overlays when local generated data is available.'
});

export function currentModeConfig() {
  return APP_MODES[APP_CONFIG.mode] || APP_MODES.demo;
}

export function isDemoMode() {
  return APP_CONFIG.mode === APP_MODES.demo.key;
}
