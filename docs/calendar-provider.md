# Google Calendar Provider v1.0

## Purpose

`CalendarProvider` turns Google Calendar events into executive operational intelligence for EP Intelligence.

The goal is not to recreate Google Calendar.

The goal is to help leadership understand:

- today’s fittings
- meeting load
- staff utilisation
- free booking capacity
- travel and all-day pressure
- upcoming deadlines
- schedule risks and opportunities

## Architecture Fit

The provider follows the existing EP Intelligence architecture:

1. **Presentation Layer** renders operations, CEO, approvals, reports, and AI views
2. **Service Layer** exposes operations through `TimelineService` and merges approval cards through `ApprovalService`
3. **Provider Layer** reads demo data or a generated Google Calendar snapshot through `CalendarProvider`
4. **Intelligence Engine** turns operational data into correlations, recommendations, narratives, and timeline events
5. **Executive Memory** stores meaningful operational milestones
6. **Knowledge Graph** keeps those milestones linkable to broader business context

## Configuration

Add local credentials in `.env` or `.env.local` only.

Never commit them.

Supported environment variables:

```bash
GOOGLE_CALENDAR_CLIENT_ID=
GOOGLE_CALENDAR_CLIENT_SECRET=
GOOGLE_CALENDAR_REFRESH_TOKEN=
GOOGLE_CALENDAR_ID=primary
GOOGLE_CALENDAR_SYNC_INTERVAL_MINUTES=15
```

## Permissions

The provider uses a Google Calendar read-only access model.

It should be scoped so EP Intelligence can:

- read the selected calendar
- read event timing
- read event titles, attendees, and locations when available

It should **not** directly mutate calendar events from the UI.

All actions remain approval-first.

## Sync Lifecycle

Run:

```bash
npm run calendar:sync
```

The sync flow is:

1. load local environment values
2. exchange the stored refresh token for an access token
3. fetch the selected Google Calendar
4. fetch upcoming events
5. classify events into fittings, meetings, travel, deadlines, and all-day holds using deterministic rules
6. generate executive operations outputs such as:
   - widgets
   - day summary
   - week capacity
   - scheduling risks
   - free booking slots
   - approval cards
   - timeline events
   - memory candidates
   - search index entries
7. write the generated snapshot to `assets/data/generated/calendar-live-snapshot.json`

If credentials are missing or invalid, the sync writes a safe **Demo fallback** payload instead.

## Runtime Behaviour

At runtime:

- `assets/data/live-data-loader.js` loads the generated snapshot when present
- `CalendarProvider` overlays operations data on top of the demo baseline
- `TimelineService` exposes the operations workspace and timeline coverage
- `ApprovalService` merges Google Calendar approval cards into the central approval centre
- the intelligence layer and CEO dashboard consume the shaped operations outputs without any direct Google Calendar dependency in the UI

## UI Surfaces Updated by CalendarProvider

When live data is available, the provider can affect:

- **Operations Calendar**
- **CEO Dashboard** operations widgets and schedule summary
- **AI Assistant → Executive Briefing**
- **Approvals**
- **Executive Timeline**
- **Search**
- **Integration Status**
- **Executive Memory**

## Approval-First Actions

Google Calendar never executes actions automatically from EP Intelligence.

The provider only stages approval items such as:

- Reschedule appointment
- Extend fitting
- Block calendar time
- Accept invitation
- Decline invitation

## Security Model

- credentials stay local in `.env` / `.env.local`
- refresh tokens never ship to the browser
- generated snapshots are git-ignored
- the browser reads only the generated snapshot output
- missing credentials never break the UI; the provider falls back to demo data

## Troubleshooting

### `Missing required Google Calendar configuration`

Add the required environment variables locally, then rerun:

```bash
npm run calendar:sync
```

### Sync says Demo fallback

This means EP Intelligence is still safe to use, but live Google Calendar data is not available yet.

Check:

- client id
- client secret
- refresh token
- calendar id
- OAuth grant still valid

### Operations route still looks like demo data

Check that:

- `assets/data/generated/calendar-live-snapshot.json` exists
- the snapshot reports `available: true`
- the `status` and `state` fields show a live calendar mode
- the local app was reloaded after the sync finished

### Approval cards are missing

Check that the snapshot contains `operations.approvalCards` and that `ApprovalService` is merging calendar groups into the main approval workspace.

### Timeline or search entries are missing

Check that the snapshot contains:

- `operations.timelineEvents`
- `operations.memoryCandidates`
- `operations.searchIndex`

## Related Files

- `assets/providers/calendar-provider.js`
- `assets/data/live-data-loader.js`
- `assets/data/runtime.js`
- `assets/services/timeline-service.js`
- `assets/services/approval-service.js`
- `scripts/sync-calendar-snapshot.mjs`
- `.env.example`
