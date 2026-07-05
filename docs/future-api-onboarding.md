# Future API Onboarding Process

This document is the implementation checklist for turning a placeholder integration into a live one.

## Ground Rules

Before any live integration work:

- confirm the business need
- confirm approval for the integration
- confirm credential ownership and storage plan
- confirm which executive workspace(s) should consume the data
- confirm whether a new provider is needed or an existing provider should expand

## Step 1 — Choose the Domain

Decide which service domain owns the new data.

Examples:

- YouTube → `marketing`
- Google Analytics → `marketing`
- QuickBooks / Xero → `finance`
- Google Calendar → `timeline`
- OpenClaw orchestration metadata → `ai` or `executive`

## Step 2 — Update the Provider

Implement or extend a provider in `assets/providers/`.

Rules:

- keep API-specific logic inside the provider
- do not mix UI logic into the provider
- return structured JavaScript objects only
- preserve current contract names where possible

## Step 3 — Update the Registry Binding

Change the provider binding in `assets/providers/provider-registry.js`.

This is the intended switch point.

Example idea:

- current: `marketing → MockProvider`
- future: `marketing → AnalyticsProvider` or `MarketingProvider`

## Step 4 — Update the Service Only If Needed

If the provider returns the same logical shape, the service may not need much change.

If the provider returns richer data:

- shape it in the service
- normalize it through the shared contracts
- keep route renderers stable

## Step 5 — Keep the UI Stable

Do not rewrite views just because the source changed.

Only change the UI when:

- new user-facing information is required
- a new interaction is needed
- the design intentionally changes

## Step 6 — Update Integration Status

When an integration changes state:

- update its provider implementation
- update the registry metadata
- ensure the Integration Status page reflects the real state

Suggested status progression:

- Demo Mode
- Not Configured
- Configured
- Connected
- Warning
- Error

## Step 7 — Validate

Minimum checks for each future integration sprint:

- syntax check all affected files
- confirm route rendering still works
- confirm no console errors
- confirm no console warnings caused by the integration layer
- confirm the UI still works when the provider is unavailable or returns fallback data

## Suggested Responsibility Map

- provider = source-specific data access
- service = business shaping and contract normalization
- app/view = rendering and interaction only

## Anti-Patterns to Avoid

Do not:

- call APIs directly from `assets/app.js`
- import credentials into the presentation layer
- return HTML from providers
- bypass services and read raw provider output in views
- couple one dashboard page to one vendor API response shape

## Naming Convention Reminder

- provider files: `*-provider.js`
- service files: `*-service.js`
- config files: `*-config.js`
- contracts: `data-contracts.js`
- runtime composition: `runtime.js`

## Success Condition

A future integration is successful when:

- a provider can be swapped in
- the service still returns contract-safe data
- the dashboard route does not need rewriting
