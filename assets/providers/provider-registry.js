import { APP_CONFIG, APP_MODES, currentModeConfig } from '../config/app-config.js';
import { INTEGRATION_REGISTRY } from '../config/integration-registry.js';
import { MockProvider } from './mock-provider.js';
import { AnalyticsProvider } from './analytics-provider.js';
import { YouTubeProvider } from './youtube-provider.js';
import { GmailProvider } from './gmail-provider.js';
import { createFutureProviders } from './future-providers.js';

export function createProviderRegistry({ source, mode = APP_CONFIG.mode, ga4Snapshot = null, youtubeSnapshot = null, gmailSnapshot = null } = {}) {
  const mockProvider = new MockProvider({ source, mode });
  const analyticsProvider = new AnalyticsProvider({ source, mode, ga4Snapshot });
  const youtubeProvider = new YouTubeProvider({ provider: analyticsProvider, source, mode, youtubeSnapshot });
  const gmailProvider = new GmailProvider({ provider: mockProvider, source, mode, gmailSnapshot });
  const futureProviders = createFutureProviders();
  const catalog = {
    mock: mockProvider,
    analytics: analyticsProvider,
    youtube: youtubeProvider,
    gmail: gmailProvider,
    finance: futureProviders.finance,
    marketing: futureProviders.marketing,
    crm: futureProviders.crm,
    calendar: futureProviders.calendar,
    ai: futureProviders.ai
  };

  const domainBindings = {
    executive: mockProvider,
    finance: mockProvider,
    marketing: youtubeProvider,
    communications: gmailProvider,
    approval: gmailProvider,
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
        notes: APP_CONFIG.notes,
        liveData: {
          ga4: analyticsProvider.describeGoogleAnalyticsIntegration(),
          youtube: youtubeProvider.describeYouTubeIntegration(),
          gmail: gmailProvider.describeGmailIntegration()
        }
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
        mode: provider.bindingMode || provider.mode || mode
      }));
    },
    listIntegrations() {
      return INTEGRATION_REGISTRY.map((entry) => {
        if (entry.id === 'youtube') {
          return youtubeProvider.describeYouTubeIntegration();
        }

        if (entry.id === 'google-analytics') {
          return analyticsProvider.describeGoogleAnalyticsIntegration();
        }

        if (entry.id === 'gmail') {
          return gmailProvider.describeGmailIntegration();
        }

        return {
          ...entry,
          mode,
          status: mode === APP_MODES.demo.key ? 'Demo Mode' : 'Not Configured'
        };
      });
    },
    getLiveDataSummary() {
      return {
        ga4: analyticsProvider.describeGoogleAnalyticsIntegration(),
        youtube: youtubeProvider.describeYouTubeIntegration(),
        gmail: gmailProvider.describeGmailIntegration()
      };
    }
  });
}
