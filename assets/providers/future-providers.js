export class FutureProvider {
  constructor({ key, label, domains, integrations, notes }) {
    this.key = key;
    this.label = label;
    this.domains = domains;
    this.integrations = integrations;
    this.notes = notes;
  }

  describe() {
    return {
      key: this.key,
      label: this.label,
      domains: this.domains,
      integrations: this.integrations,
      type: 'placeholder',
      status: 'Not Configured',
      notes: this.notes
    };
  }
}

export function createFutureProviders() {
  return {
    analytics: new FutureProvider({
      key: 'analytics',
      label: 'AnalyticsProvider',
      domains: ['marketing', 'executive'],
      integrations: ['YouTube', 'Google Analytics'],
      notes: 'Future provider contract for channel, traffic, and engagement telemetry.'
    }),
    finance: new FutureProvider({
      key: 'finance',
      label: 'FinanceProvider',
      domains: ['finance', 'executive'],
      integrations: ['QuickBooks / Xero', 'Stripe'],
      notes: 'Future provider contract for revenue, margin, cash flow, and supplier data.'
    }),
    marketing: new FutureProvider({
      key: 'marketing',
      label: 'MarketingProvider',
      domains: ['marketing', 'executive'],
      integrations: ['Mailchimp', 'LinkedIn', 'Facebook', 'Instagram', 'X'],
      notes: 'Future provider contract for campaigns, social, content, and platform performance.'
    }),
    crm: new FutureProvider({
      key: 'crm',
      label: 'CRMProvider',
      domains: ['reporting', 'approvals'],
      integrations: ['Gmail'],
      notes: 'Future provider contract for communications and customer-facing workflow signals.'
    }),
    calendar: new FutureProvider({
      key: 'calendar',
      label: 'CalendarProvider',
      domains: ['timeline', 'executive'],
      integrations: ['Google Calendar'],
      notes: 'Future provider contract for time-based executive planning and timeline enrichment.'
    }),
    ai: new FutureProvider({
      key: 'ai',
      label: 'AIProvider',
      domains: ['executive', 'ai-assistant'],
      integrations: ['OpenClaw'],
      notes: 'Future provider contract for executive-agent context, reasoning, and approvals metadata.'
    })
  };
}
