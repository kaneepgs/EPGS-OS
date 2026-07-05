import { deepClone } from '../contracts/data-contracts.js';

export class MockProvider {
  constructor({ source, mode = 'demo' }) {
    this.source = deepClone(source);
    this.mode = mode;
    this.key = 'mock';
    this.label = 'MockProvider';
  }

  describe() {
    return {
      key: this.key,
      label: this.label,
      mode: this.mode,
      type: 'active',
      status: this.mode === 'demo' ? 'Demo Mode' : 'Available',
      notes: 'Supplies all workspace data from local structured demo datasets.'
    };
  }

  getBrand() {
    return deepClone(this.source.brand);
  }

  getCeoDashboard() {
    return deepClone(this.source.ceo);
  }

  getFinanceWorkspace() {
    return deepClone(this.source.cfo);
  }

  getMarketingWorkspace() {
    return deepClone(this.source.cmo);
  }

  getApprovalWorkspace() {
    return deepClone(this.source.approvals);
  }

  getReportsWorkspace() {
    return deepClone(this.source.reports);
  }

  getAiWorkspace() {
    return deepClone(this.source.aiAssistant);
  }

  getPlaceholderModules() {
    return deepClone(this.source.placeholders);
  }

  getSettingsWorkspace() {
    return deepClone(this.source.settings);
  }

  getShortcuts() {
    return deepClone(this.source.shortcuts);
  }
}
