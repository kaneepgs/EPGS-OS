import { deepClone } from '../contracts/data-contracts.js';

function normalizeSnapshot(snapshot = {}) {
  return {
    integrationId: 'google-calendar',
    available: Boolean(snapshot.available),
    status: snapshot.status || 'Demo Fallback',
    state: snapshot.state || 'demo-fallback',
    source: snapshot.source || 'MockProvider',
    reason: snapshot.reason || 'Live calendar snapshot unavailable.',
    checkedAt: snapshot.checkedAt || snapshot.syncedAt || null,
    syncedAt: snapshot.syncedAt || null,
    calendarName: snapshot.calendarName || '',
    notes: snapshot.notes || '',
    meta: snapshot.meta || {},
    operations: snapshot.operations || null
  };
}

export class CalendarProvider {
  constructor({ provider, source, mode = 'demo', calendarSnapshot = null }) {
    this.provider = provider;
    this.source = deepClone(source);
    this.mode = mode;
    this.key = 'calendar';
    this.label = 'CalendarProvider';
    this.calendarSnapshot = normalizeSnapshot(calendarSnapshot || {});
    this.bindingMode = this.calendarSnapshot.available ? 'live+demo' : 'demo';
  }

  describe() {
    return {
      key: this.key,
      label: this.label,
      mode: this.bindingMode,
      type: 'active',
      status: this.calendarSnapshot.available ? 'Live operations calendar intelligence' : 'Demo fallback',
      domains: ['operations', 'timeline', 'approval'],
      notes: this.calendarSnapshot.available
        ? 'Operations Calendar hydrates from a generated Google Calendar snapshot while timeline, approvals, and executive scheduling intelligence remain approval-first.'
        : 'Ready for generated Google Calendar snapshots. Falls back safely to demo operations intelligence until local OAuth configuration and sync succeed.'
    };
  }

  describeCalendarIntegration() {
    const healthy = this.calendarSnapshot.available;
    const syncText = this.calendarSnapshot.syncedAt || this.calendarSnapshot.checkedAt || 'not yet synced';
    return {
      id: 'google-calendar',
      label: 'Google Calendar',
      provider: this.label,
      providerKey: this.key,
      service: 'TimelineService',
      group: 'Calendar & Timeline',
      available: healthy,
      mode: this.bindingMode,
      status: healthy ? 'Live operations calendar' : 'Demo fallback',
      notes: healthy
        ? `Live Google Calendar snapshot active for ${this.calendarSnapshot.calendarName || 'the configured calendar'}. Operations Calendar, timeline events, and approval-first scheduling intelligence are now hydrated from live event metadata.`
        : this.calendarSnapshot.reason || 'Live Google Calendar snapshot unavailable. Demo fallback remains active.',
      detail: healthy
        ? `Calendar ${this.calendarSnapshot.calendarName || 'configured'} synced ${syncText}. Provider health ${this.calendarSnapshot.meta?.providerHealth || 'Healthy'}.`
        : 'Add Google Calendar OAuth credentials and refresh token, run npm run calendar:sync, and refresh the app to replace demo scheduling intelligence.',
      syncedAt: this.calendarSnapshot.syncedAt || null,
      calendarName: this.calendarSnapshot.calendarName || '',
      health: this.calendarSnapshot.meta?.providerHealth || (healthy ? 'Healthy' : 'Awaiting configuration')
    };
  }

  getOperationsWorkspace() {
    const demo = deepClone(this.source.operations || {});

    if (!this.calendarSnapshot.available || !this.calendarSnapshot.operations) {
      return {
        ...demo,
        providerSummary: {
          ...(demo.providerSummary || {}),
          label: 'Demo fallback active',
          body: this.calendarSnapshot.reason
            ? `${this.calendarSnapshot.reason} Operations Calendar is still using structured demo scheduling data.`
            : 'Operations Calendar is still using structured demo scheduling data because no local Google Calendar snapshot is currently available.',
          tone: 'warn',
          state: 'demo-fallback',
          calendarName: this.calendarSnapshot.calendarName || demo.providerSummary?.calendarName || '',
          syncedAt: this.calendarSnapshot.syncedAt || this.calendarSnapshot.checkedAt || null,
          health: 'Awaiting configuration',
          mode: 'demo',
          syncInterval: demo.providerSummary?.syncInterval || ''
        }
      };
    }

    return {
      ...demo,
      ...deepClone(this.calendarSnapshot.operations),
      providerSummary: {
        ...(deepClone(this.calendarSnapshot.operations.providerSummary || {})),
        label: 'Live Google Calendar snapshot active',
        body: `Calendar ${this.calendarSnapshot.calendarName || 'configured'} synced ${this.calendarSnapshot.syncedAt || 'recently'}. Operations Calendar is now using live Google Calendar metadata while all scheduling actions remain approval-first.`,
        tone: 'good',
        state: 'live-calendar',
        calendarName: this.calendarSnapshot.calendarName || '',
        syncedAt: this.calendarSnapshot.syncedAt || null,
        health: this.calendarSnapshot.meta?.providerHealth || 'Healthy',
        mode: this.bindingMode,
        syncInterval: this.calendarSnapshot.meta?.syncIntervalMinutes ? `${this.calendarSnapshot.meta.syncIntervalMinutes} minutes` : ''
      },
      meta: deepClone(this.calendarSnapshot.meta || {})
    };
  }

  getBusinessTimeline() {
    const operations = this.getOperationsWorkspace();
    return deepClone(operations.timelineEvents || this.source.ceo?.businessTimeline || []);
  }

  getApprovalWorkspace() {
    const base = this.provider?.getApprovalWorkspace ? this.provider.getApprovalWorkspace() : deepClone(this.source.approvals || {});
    const operations = this.getOperationsWorkspace();
    return {
      ...base,
      groups: {
        ...(base.groups || {}),
        'Operations calendar approvals': deepClone(operations.approvalCards || [])
      }
    };
  }
}
