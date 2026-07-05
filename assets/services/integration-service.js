export function createIntegrationService(registry, { executiveService, financeService, marketingService, communicationsService, approvalService, reportService, timelineService, intelligenceService, memoryService } = {}) {
  return Object.freeze({
    getConfiguration() {
      const modeSummary = registry.getModeSummary();
      return {
        ...modeSummary,
        domainBindings: registry.describeBindings()
      };
    },
    getIntegrationStatus() {
      return registry.listIntegrations();
    },
    getProviderArchitecture() {
      return {
        layers: [
          { title: 'Presentation Layer', body: 'Routes and views render stable executive UI components and never talk directly to raw data sources.', tone: 'info' },
          { title: 'Business Logic Layer', body: 'Services shape dashboard-ready data, enforce contracts, and hide provider-specific detail from the UI.', tone: 'good' },
          { title: 'Data Provider Layer', body: 'Providers expose interchangeable domain data. Sprint 13 now lets GmailProvider overlay executive communications data alongside the existing GA4 and YouTube snapshot paths while preserving demo fallback.', tone: 'warn' }
        ],
        flow: [
          'UI route → service method',
          'service method → domain provider',
          'provider → structured dataset or generated live snapshot',
          'service → contract normalization',
          'normalized result → intelligence/runtime composition',
          'runtime result → executive workspace UI'
        ],
        services: [
          { title: 'ExecutiveService', body: 'Composes CEO dashboard, AI assistant, shell-level brand data, and placeholder modules.' },
          { title: 'FinanceService', body: 'Owns CFO-facing finance workspace data and normalised finance-specific contracts.' },
          { title: 'MarketingService', body: 'Owns CMO-facing marketing workspace data and normalised marketing-specific contracts.' },
          { title: 'CommunicationsService', body: 'Owns Executive Inbox data, communications triage, Gmail-derived summary metrics, and inbox search coverage.' },
          { title: 'ApprovalService', body: 'Owns grouped approval data and approval contract normalization.' },
          { title: 'ReportService', body: 'Owns reporting-route datasets and report contract normalization.' },
          { title: 'TimelineService', body: 'Owns reusable executive timeline shaping for CEO and future modules.' },
          { title: 'MemoryService', body: 'Owns persistent executive memory, decision history, strategic goals, deterministic historical context, and knowledge graph relationships.' },
          { title: 'IntelligenceService', body: 'Owns deterministic insight generation, health scoring, recommendations, and narratives on top of provider-backed service data.' }
        ],
        providerBindings: registry.describeBindings(),
        providers: registry.listProviders(),
        conventions: [
          'Views import shell config and runtime data, not raw mock datasets.',
          'Services are responsible for shaping contract-safe workspace data.',
          'Providers may change in the future without requiring route rewrites.',
          'Gmail follows the same generated-snapshot pattern as GA4 and YouTube so credentials never reach the browser.',
          'Demo mode remains the only executable mode until future integrations are explicitly built.'
        ],
        health: {
          ceo: executiveService?.getCeoDashboard?.()?.businessHealthScore?.overall ?? 0,
          cfo: financeService?.getWorkspace?.()?.welcome?.score ?? 0,
          cmo: marketingService?.getWorkspace?.()?.dashboard?.healthScore ?? 0,
          communications: communicationsService?.getWorkspace?.()?.counts?.visible ?? 0,
          approvals: Object.keys(approvalService?.getWorkspace?.()?.groups || {}).length,
          reports: (reportService?.getWorkspace?.()?.overview || []).length,
          timeline: (timelineService?.getBusinessTimeline?.() || []).length,
          intelligence: intelligenceService?.getWorkspace?.()?.insights?.executive?.length || 0,
          memoryEvents: memoryService?.getTimeline?.()?.length || 0,
          memoryGoals: memoryService?.getGoals?.()?.length || 0,
          memoryDecisions: memoryService?.getDecisions?.()?.length || 0
        }
      };
    },
    getSettingsWorkspace(baseSettings = {}, memoryWorkspace = {}) {
      const configuration = this.getConfiguration();
      return {
        ...baseSettings,
        configuration,
        integrationStatus: this.getIntegrationStatus(),
        architecture: this.getProviderArchitecture(),
        memory: memoryWorkspace
      };
    }
  });
}
