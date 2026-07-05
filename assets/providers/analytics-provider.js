import { deepClone } from '../contracts/data-contracts.js';

function normalizeSnapshot(snapshot = {}) {
  return {
    integrationId: 'google-analytics',
    available: Boolean(snapshot.available),
    status: snapshot.status || 'Demo Fallback',
    state: snapshot.state || 'demo-fallback',
    source: snapshot.source || 'MockProvider',
    reason: snapshot.reason || 'Live GA4 snapshot unavailable.',
    checkedAt: snapshot.checkedAt || snapshot.syncedAt || null,
    syncedAt: snapshot.syncedAt || null,
    propertyId: snapshot.propertyId || '',
    notes: snapshot.notes || '',
    websiteAnalytics: snapshot.websiteAnalytics || null,
    charts: snapshot.charts || null,
    meta: snapshot.meta || {}
  };
}

export class AnalyticsProvider {
  constructor({ source, mode = 'demo', ga4Snapshot = null }) {
    this.source = deepClone(source);
    this.mode = mode;
    this.key = 'analytics';
    this.label = 'AnalyticsProvider';
    this.ga4Snapshot = normalizeSnapshot(ga4Snapshot || {});
    this.bindingMode = this.ga4Snapshot.available ? 'live+demo' : 'demo';
  }

  describe() {
    return {
      key: this.key,
      label: this.label,
      mode: this.bindingMode,
      type: 'active',
      status: this.ga4Snapshot.available ? 'Live website analytics' : 'Demo fallback',
      domains: ['marketing'],
      notes: this.ga4Snapshot.available
        ? 'Website Analytics now hydrates from a generated GA4 snapshot while the rest of marketing remains in Demo Mode.'
        : 'Ready for generated GA4 snapshots. Falls back safely to demo data until credentials and a local sync are present.'
    };
  }

  describeGoogleAnalyticsIntegration() {
    return {
      id: 'google-analytics',
      label: 'Google Analytics',
      provider: this.label,
      providerKey: this.key,
      service: 'MarketingService',
      group: 'Marketing & Analytics',
      available: this.ga4Snapshot.available,
      mode: this.bindingMode,
      status: this.ga4Snapshot.available ? 'Live website analytics' : 'Demo fallback',
      notes: this.ga4Snapshot.available
        ? `Live GA4 snapshot active for Website Analytics. Last synced ${this.ga4Snapshot.syncedAt || 'recently'}.`
        : this.ga4Snapshot.reason || 'Live GA4 snapshot unavailable. Demo fallback remains active.',
      detail: this.ga4Snapshot.available
        ? `Property ${this.ga4Snapshot.propertyId || 'configured'} via generated local snapshot.`
        : 'Add credentials, run npm run ga4:sync, and refresh the app to replace Website Analytics demo data.'
    };
  }

  getMarketingWorkspace() {
    const workspace = deepClone(this.source.cmo);
    if (!this.ga4Snapshot.available || !this.ga4Snapshot.websiteAnalytics) {
      workspace.websiteAnalytics = {
        ...workspace.websiteAnalytics,
        snapshotMeta: this.ga4Snapshot.meta || {},
        dataSource: {
          label: 'Demo fallback active',
          body: this.ga4Snapshot.reason
            ? `${this.ga4Snapshot.reason} Website Analytics is still using demo data.`
            : 'Google Analytics is not yet synced locally, so Website Analytics is still using demo data.',
          tone: 'warn',
          state: 'demo-fallback',
          propertyId: this.ga4Snapshot.propertyId || '',
          syncedAt: this.ga4Snapshot.syncedAt || this.ga4Snapshot.checkedAt || null
        }
      };
      return workspace;
    }

    workspace.websiteAnalytics = {
      ...this.ga4Snapshot.websiteAnalytics,
      snapshotMeta: this.ga4Snapshot.meta || {},
      dataSource: {
        label: 'Live GA4 snapshot active',
        body: `Property ${this.ga4Snapshot.propertyId || 'configured'} synced ${this.ga4Snapshot.syncedAt || 'recently'}. The rest of the CMO workspace remains in Demo Mode.`,
        tone: 'good',
        state: 'live-ga4',
        propertyId: this.ga4Snapshot.propertyId || '',
        syncedAt: this.ga4Snapshot.syncedAt || null
      }
    };

    workspace.charts = {
      ...workspace.charts,
      websiteTraffic: this.ga4Snapshot.charts?.websiteTraffic || workspace.charts.websiteTraffic,
      websiteConversions: this.ga4Snapshot.charts?.websiteConversions || workspace.charts.websiteConversions,
      websiteVisitorMix: this.ga4Snapshot.charts?.websiteVisitorMix || {
        type: 'bar',
        labels: ['Users', 'New Users', 'Returning'],
        values: [18.9, 12.4, 6.5],
        label: 'Visitor mix',
        suffix: 'k'
      }
    };

    return workspace;
  }
}
