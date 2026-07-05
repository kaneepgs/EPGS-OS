export const INTEGRATION_REGISTRY = Object.freeze([
  {
    id: 'youtube',
    label: 'YouTube',
    provider: 'YouTubeProvider',
    service: 'MarketingService',
    group: 'Marketing & Analytics',
    status: 'Live-capable',
    notes: 'Channel totals, tracked 28-day deltas, recent uploads, and top-video content can now hydrate from a generated local YouTube snapshot while safely falling back to demo data.'
  },
  {
    id: 'google-analytics',
    label: 'Google Analytics',
    provider: 'AnalyticsProvider',
    service: 'MarketingService',
    group: 'Marketing & Analytics',
    status: 'Live-capable',
    notes: 'Website Analytics can now hydrate from a generated GA4 snapshot while safely falling back to demo data when credentials or snapshot files are missing.'
  },
  {
    id: 'unified-social',
    label: 'Unified Social Provider',
    provider: 'UnifiedSocialProvider',
    service: 'MarketingService',
    group: 'Marketing & Analytics',
    status: 'Live-capable',
    notes: 'Instagram, Facebook, LinkedIn, and X can now hydrate together from a generated local social snapshot while safely falling back to deterministic demo data.'
  },
  {
    id: 'instagram',
    label: 'Instagram',
    provider: 'UnifiedSocialProvider',
    service: 'MarketingService',
    group: 'Marketing & Analytics',
    status: 'Live-capable',
    notes: 'Visual reach, reels/carousel performance, and audience growth can hydrate through the Unified Social Provider snapshot path.'
  },
  {
    id: 'facebook',
    label: 'Facebook',
    provider: 'UnifiedSocialProvider',
    service: 'MarketingService',
    group: 'Marketing & Analytics',
    status: 'Live-capable',
    notes: 'Community reach, engagement, and social proof touchpoints can hydrate through the Unified Social Provider snapshot path.'
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    provider: 'UnifiedSocialProvider',
    service: 'MarketingService',
    group: 'Marketing & Analytics',
    status: 'Live-capable',
    notes: 'Executive authority, professional reach, and thought-leadership performance can hydrate through the Unified Social Provider snapshot path.'
  },
  {
    id: 'x',
    label: 'X',
    provider: 'UnifiedSocialProvider',
    service: 'MarketingService',
    group: 'Marketing & Analytics',
    status: 'Live-capable',
    notes: 'Audience movement, conversation presence, and lighter-weight awareness signals can hydrate through the Unified Social Provider snapshot path.'
  },
  {
    id: 'gmail',
    label: 'Gmail',
    provider: 'GmailProvider',
    service: 'CommunicationsService',
    group: 'Communications',
    status: 'Live-capable',
    notes: 'Executive Inbox, approval-first communications triage, and deterministic Gmail intelligence can now hydrate from a generated local Gmail snapshot while safely falling back to demo data.'
  },
  {
    id: 'google-calendar',
    label: 'Google Calendar',
    provider: 'CalendarProvider',
    service: 'TimelineService',
    group: 'Calendar & Timeline',
    status: 'Live-capable',
    notes: 'Operations Calendar, executive scheduling intelligence, timeline enrichment, and approval-first calendar actions can now hydrate from a generated local Google Calendar snapshot while safely falling back to demo data.'
  },
  {
    id: 'mailchimp',
    label: 'Mailchimp',
    provider: 'MarketingProvider',
    service: 'MarketingService',
    group: 'Marketing & Analytics',
    status: 'Demo Mode',
    notes: 'Reserved for campaign performance, audience health, and email conversion data.'
  },
  {
    id: 'accounting',
    label: 'QuickBooks / Xero',
    provider: 'FinanceProvider',
    service: 'FinanceService',
    group: 'Finance',
    status: 'Demo Mode',
    notes: 'Reserved for revenue, margin, cash flow, VAT, and supplier intelligence.'
  },
  {
    id: 'stripe',
    label: 'Stripe',
    provider: 'FinanceProvider',
    service: 'FinanceService',
    group: 'Finance',
    status: 'Demo Mode',
    notes: 'Reserved for payment, checkout, and subscription-adjacent performance signals.'
  },
  {
    id: 'openclaw',
    label: 'OpenClaw',
    provider: 'AIProvider',
    service: 'ExecutiveService',
    group: 'AI & Workflow',
    status: 'Demo Mode',
    notes: 'Reserved for future executive-agent context, approvals, and orchestration metadata.'
  }
]);
