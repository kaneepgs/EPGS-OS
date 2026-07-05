import { RELEASE_CONFIG } from './release-config.js';

export const APP_MODES = Object.freeze({
  demo: {
    key: 'demo',
    label: 'Demo Mode',
    description: 'The wider executive workspace stays demo-first, with optional provider-level overlays such as GA4, YouTube, Unified Social, Gmail, and Google Calendar snapshot paths.',
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
  notes: 'Sprint 18 adds the Unified Social Provider for Instagram, Facebook, LinkedIn, and X through the existing provider/service/intelligence architecture, preserving demo-first behaviour while allowing selective GA4, YouTube, Unified Social, Gmail, and Google Calendar snapshot overlays when local generated data is available.'
});

export function currentModeConfig() {
  return APP_MODES[APP_CONFIG.mode] || APP_MODES.demo;
}

export function isDemoMode() {
  return APP_CONFIG.mode === APP_MODES.demo.key;
}
