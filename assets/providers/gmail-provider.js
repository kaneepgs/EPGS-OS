import { deepClone } from '../contracts/data-contracts.js';

function normalizeSnapshot(snapshot = {}) {
  return {
    integrationId: 'gmail',
    available: Boolean(snapshot.available),
    status: snapshot.status || 'Demo Fallback',
    state: snapshot.state || 'demo-fallback',
    source: snapshot.source || 'MockProvider',
    reason: snapshot.reason || 'Live Gmail snapshot unavailable.',
    checkedAt: snapshot.checkedAt || snapshot.syncedAt || null,
    syncedAt: snapshot.syncedAt || null,
    account: snapshot.account || '',
    notes: snapshot.notes || '',
    meta: snapshot.meta || {},
    communications: snapshot.communications || null
  };
}

export class GmailProvider {
  constructor({ provider, source, mode = 'demo', gmailSnapshot = null }) {
    this.provider = provider;
    this.source = deepClone(source);
    this.mode = mode;
    this.key = 'gmail';
    this.label = 'GmailProvider';
    this.gmailSnapshot = normalizeSnapshot(gmailSnapshot || {});
    this.bindingMode = this.gmailSnapshot.available ? 'live+demo' : 'demo';
  }

  describe() {
    return {
      key: this.key,
      label: this.label,
      mode: this.bindingMode,
      type: 'active',
      status: this.gmailSnapshot.available ? 'Live Gmail inbox intelligence' : 'Demo fallback',
      domains: ['communications', 'approval'],
      notes: this.gmailSnapshot.available
        ? 'Executive Inbox can now hydrate from a generated Gmail snapshot while approvals remain approval-first and the wider workspace stays demo-first.'
        : 'Ready for generated Gmail snapshots. Falls back safely to demo inbox intelligence until local OAuth configuration and sync succeed.'
    };
  }

  describeGmailIntegration() {
    const healthy = this.gmailSnapshot.available;
    const syncText = this.gmailSnapshot.syncedAt || this.gmailSnapshot.checkedAt || 'not yet synced';
    return {
      id: 'gmail',
      label: 'Gmail',
      provider: this.label,
      providerKey: this.key,
      service: 'CommunicationsService',
      group: 'Communications',
      available: healthy,
      mode: this.bindingMode,
      status: healthy ? 'Live executive inbox' : 'Demo fallback',
      notes: healthy
        ? `Live Gmail snapshot active for ${this.gmailSnapshot.account || 'the configured account'}. Executive Inbox, approval cards, and communications intelligence are now hydrated from Gmail metadata and selected message content.`
        : this.gmailSnapshot.reason || 'Live Gmail snapshot unavailable. Demo fallback remains active.',
      detail: healthy
        ? `Account ${this.gmailSnapshot.account || 'configured'} synced ${syncText}. Provider health ${this.gmailSnapshot.meta?.providerHealth || 'Healthy'}.`
        : 'Add Gmail OAuth credentials and refresh token, run npm run gmail:sync, and refresh the app to replace demo inbox intelligence.',
      syncedAt: this.gmailSnapshot.syncedAt || null,
      account: this.gmailSnapshot.account || '',
      health: this.gmailSnapshot.meta?.providerHealth || (healthy ? 'Healthy' : 'Awaiting configuration')
    };
  }

  getCommunicationsWorkspace() {
    const demo = deepClone(this.source.communications || {});

    if (!this.gmailSnapshot.available || !this.gmailSnapshot.communications) {
      return {
        ...demo,
        providerSummary: {
          ...(demo.providerSummary || {}),
          label: 'Demo fallback active',
          body: this.gmailSnapshot.reason
            ? `${this.gmailSnapshot.reason} Executive Inbox is still using structured demo data.`
            : 'Executive Inbox is still using structured demo data because no local Gmail snapshot is currently available.',
          tone: 'warn',
          state: 'demo-fallback',
          account: this.gmailSnapshot.account || demo.providerSummary?.account || '',
          syncedAt: this.gmailSnapshot.syncedAt || this.gmailSnapshot.checkedAt || null,
          health: 'Awaiting configuration',
          mode: 'demo',
          syncInterval: demo.providerSummary?.syncInterval || ''
        }
      };
    }

    return {
      ...demo,
      ...deepClone(this.gmailSnapshot.communications),
      providerSummary: {
        ...(deepClone(this.gmailSnapshot.communications.providerSummary || {})),
        label: 'Live Gmail snapshot active',
        body: `Account ${this.gmailSnapshot.account || 'configured'} synced ${this.gmailSnapshot.syncedAt || 'recently'}. Executive Inbox is now using live Gmail metadata and selected message content while all actions remain approval-first.`,
        tone: 'good',
        state: 'live-gmail',
        account: this.gmailSnapshot.account || '',
        syncedAt: this.gmailSnapshot.syncedAt || null,
        health: this.gmailSnapshot.meta?.providerHealth || 'Healthy',
        mode: this.bindingMode,
        syncInterval: this.gmailSnapshot.meta?.syncIntervalMinutes ? `${this.gmailSnapshot.meta.syncIntervalMinutes} minutes` : ''
      },
      meta: deepClone(this.gmailSnapshot.meta || {})
    };
  }

  getApprovalWorkspace() {
    const base = this.provider?.getApprovalWorkspace ? this.provider.getApprovalWorkspace() : deepClone(this.source.approvals || {});
    const communications = this.getCommunicationsWorkspace();
    return {
      ...base,
      groups: {
        ...(base.groups || {}),
        'Executive Inbox approvals': deepClone(communications.approvalCards || [])
      }
    };
  }
}
