import { APP_CONFIG, currentModeConfig } from '../config/app-config.js';
import { RAW_MOCK_DATA } from './mock-data.js';
import { createProviderRegistry } from '../providers/provider-registry.js';
import { createTimelineService } from '../services/timeline-service.js';
import { createApprovalService } from '../services/approval-service.js';
import { createFinanceService } from '../services/finance-service.js';
import { createMarketingService } from '../services/marketing-service.js';
import { createReportService } from '../services/report-service.js';
import { createExecutiveService } from '../services/executive-service.js';
import { createIntegrationService } from '../services/integration-service.js';

const providerRegistry = createProviderRegistry({ source: RAW_MOCK_DATA, mode: APP_CONFIG.mode });
const timelineService = createTimelineService(providerRegistry);
const approvalService = createApprovalService(providerRegistry);
const financeService = createFinanceService(providerRegistry);
const marketingService = createMarketingService(providerRegistry);
const reportService = createReportService(providerRegistry);
const executiveService = createExecutiveService(providerRegistry, { timelineService });
const integrationService = createIntegrationService(providerRegistry, {
  executiveService,
  financeService,
  marketingService,
  approvalService,
  reportService,
  timelineService
});

export const SERVICES = Object.freeze({
  executive: executiveService,
  finance: financeService,
  marketing: marketingService,
  approval: approvalService,
  report: reportService,
  timeline: timelineService,
  integration: integrationService
});

export const WORKSPACE_DATA = Object.freeze({
  brand: executiveService.getBrand(),
  ceo: executiveService.getCeoDashboard(),
  cfo: financeService.getWorkspace(),
  cmo: marketingService.getWorkspace(),
  approvals: approvalService.getWorkspace(),
  reports: reportService.getWorkspace(),
  aiAssistant: executiveService.getAiWorkspace(),
  placeholders: executiveService.getPlaceholderModules(),
  settings: integrationService.getSettingsWorkspace(providerRegistry.getDomainProvider('settings').getSettingsWorkspace()),
  shortcuts: executiveService.getShortcuts()
});

export const APP_RUNTIME = Object.freeze({
  config: {
    ...APP_CONFIG,
    activeMode: currentModeConfig()
  },
  providers: providerRegistry.listProviders(),
  bindings: providerRegistry.describeBindings(),
  integrations: integrationService.getIntegrationStatus(),
  architecture: integrationService.getProviderArchitecture()
});
