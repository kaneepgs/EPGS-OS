# YouTube Provider v1.0

## Purpose

Sprint 10 introduces the second production-ready provider path for EP Intelligence.

`YouTubeProvider` replaces the previous demo YouTube data with a generated local snapshot built from the YouTube Data API, while keeping:

- the provider architecture intact
- the service layer unchanged
- the deterministic intelligence layer intact
- Executive Memory independent from provider state
- the rest of the social estate in Demo Mode

## What It Powers

When a valid snapshot exists, `YouTubeProvider` now updates:

- CMO Dashboard combined totals impacted by YouTube
- Social Overview combined figures and rankings
- the dedicated YouTube platform page
- Content Library YouTube items
- CEO Dashboard YouTube intelligence cards
- Integration Status metadata
- deterministic intelligence inputs for marketing and executive insight generation

## Configuration

Add local credentials to `.env.local` or `.env`:

```bash
YOUTUBE_API_KEY=
YOUTUBE_CHANNEL_ID=
```

These credentials must never be committed.

## Sync Workflow

Run:

```bash
npm run youtube:sync
```

This executes:

- `scripts/sync-youtube-snapshot.mjs`

The script:

1. loads local environment variables
2. calls the YouTube Data API
3. fetches channel totals
4. fetches recent uploads
5. derives content-library-ready video entries
6. stores a generated snapshot at:
   - `assets/data/generated/youtube-live-snapshot.json`
7. stores local tracking history at:
   - `assets/data/generated/youtube-channel-history.json`

Both files stay git-ignored.

## Snapshot Model

The generated snapshot contains:

- connection state
- synced timestamp
- channel id
- channel title
- subscribers
- total views
- videos published
- tracked recent views
- tracked subscriber movement
- audience growth
- average views per video
- recent uploads
- top tracked videos
- chart-ready data
- content-library-ready items

## Derived Metrics

The YouTube Data API provides channel totals and video-level statistics, but not full channel analytics for the last 28 days via this lightweight API-key path.

So Sprint 10 uses two strategies:

### 1. Tracked history mode

When enough local snapshot history exists, the provider derives:

- `Views (28 days)`
- `Subscribers Gained`
- `Audience Growth`

from cumulative channel totals across stored syncs.

### 2. First-sync proxy mode

When no local history exists yet, the provider falls back to a safe proxy:

- recent upload views help estimate current visibility
- subscriber movement remains in tracking-build mode until history exists

The UI stays live, but the tracked-window label makes the coverage explicit.

## Provider Lifecycle

`YouTubeProvider` composes on top of `AnalyticsProvider`.

Flow:

1. `AnalyticsProvider` builds the marketing workspace
2. `YouTubeProvider` overlays live YouTube data onto that workspace
3. `MarketingService` returns the same contract-safe shape as before
4. `IntelligenceService` reasons over the updated marketing data
5. `assets/data/runtime.js` exposes the final CEO and CMO workspace data
6. `assets/app.js` renders the existing views without direct provider knowledge

This makes YouTube the template for future platform-specific overlays.

## Demo Fallback Rules

The provider automatically falls back to demo data when:

- `YOUTUBE_API_KEY` is missing
- `YOUTUBE_CHANNEL_ID` is missing
- the API key is rejected
- the channel cannot be found
- quota is exceeded
- the request fails
- the generated snapshot is missing
- the generated snapshot is invalid JSON

Fallback never breaks the dashboard.

## Error Handling

The sync script writes a safe fallback snapshot with a human-readable reason.

Examples:

- `Missing required YouTube configuration: ...`
- `YouTube API quota exceeded. Demo fallback remains active.`
- `Configured YouTube channel was not found. Demo fallback remains active.`
- `YouTube request failed. Demo fallback remains active.`

## Validation Checklist

Recommended checks:

- `node --check assets/app.js`
- `node --check scripts/sync-youtube-snapshot.mjs`
- run `npm run youtube:sync`
- confirm `APP_RUNTIME.config.liveData.youtube.available === true` when credentials are valid
- confirm CMO YouTube page replaces demo content
- confirm Content Library shows live recent uploads
- confirm CEO YouTube intelligence cards render
- confirm deterministic intelligence references live YouTube signals
- remove or rename the generated snapshot temporarily and confirm Demo fallback returns cleanly

## Troubleshooting

### The dashboard still shows demo YouTube data

Check:

- `npm run youtube:sync` completed successfully
- `assets/data/generated/youtube-live-snapshot.json` exists
- refresh the static app after syncing

### The sync writes a fallback snapshot

Check:

- API key is valid
- channel ID is correct
- quota is not exhausted
- the local environment file is being read from the expected path

### Tracked 28-day metrics look empty or low

That usually means the provider is still building local history.

On the first sync, tracked growth metrics have little or no historical coverage.
After repeated syncs, the history-backed deltas become more meaningful.

## Files Added or Updated

Key Sprint 10 files:

- `assets/providers/youtube-provider.js`
- `assets/providers/provider-registry.js`
- `assets/data/live-data-loader.js`
- `assets/data/runtime.js`
- `assets/intelligence/correlation-engine.js`
- `assets/intelligence/recommendation-engine.js`
- `assets/intelligence/insight-engine.js`
- `assets/intelligence/index.js`
- `assets/app.js`
- `scripts/sync-youtube-snapshot.mjs`
- `README.md`
- `docs/integration-framework.md`

## Architectural Intent

`YouTubeProvider` is the blueprint for future platform integrations:

- local sync outside the browser
- generated snapshot inside the static app
- provider-only overlay
- service contracts unchanged
- deterministic intelligence remains reusable
- demo fallback always preserved
