const GA4_SNAPSHOT_PATH = new URL('./generated/ga4-live-snapshot.json', import.meta.url);
const YOUTUBE_SNAPSHOT_PATH = new URL('./generated/youtube-live-snapshot.json', import.meta.url);
const SOCIAL_SNAPSHOT_PATH = new URL('./generated/social-live-snapshot.json', import.meta.url);
const GMAIL_SNAPSHOT_PATH = new URL('./generated/gmail-live-snapshot.json', import.meta.url);
const CALENDAR_SNAPSHOT_PATH = new URL('./generated/calendar-live-snapshot.json', import.meta.url);

async function readSnapshot(path, fallback) {
  try {
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      const response = await fetch(path, { cache: 'no-store' });
      if (!response.ok) return fallback(`Snapshot request returned ${response.status}.`);
      return response.json();
    }

    const { readFile } = await import('node:fs/promises');
    const raw = await readFile(path, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error?.code === 'ENOENT') return fallback('Generated snapshot not found. Demo fallback remains active.');
    if (error instanceof SyntaxError) return fallback('Generated snapshot could not be parsed. Demo fallback remains active.');
    return fallback('Snapshot loading failed. Demo fallback remains active.');
  }
}

function fallbackSnapshot({ integrationId, notes, reason }) {
  return {
    integrationId,
    available: false,
    status: 'Demo Fallback',
    state: 'demo-fallback',
    source: 'MockProvider',
    reason,
    checkedAt: new Date().toISOString(),
    notes
  };
}

export async function loadGeneratedGa4Snapshot() {
  return readSnapshot(
    GA4_SNAPSHOT_PATH,
    (reason) => fallbackSnapshot({
      integrationId: 'google-analytics',
      reason,
      notes: 'Run npm run ga4:sync after adding credentials to enable live website analytics data.'
    })
  );
}

export async function loadGeneratedYouTubeSnapshot() {
  return readSnapshot(
    YOUTUBE_SNAPSHOT_PATH,
    (reason) => fallbackSnapshot({
      integrationId: 'youtube',
      reason,
      notes: 'Run npm run youtube:sync after adding a YouTube API key and channel ID to enable live channel data.'
    })
  );
}

export async function loadGeneratedSocialSnapshot() {
  return readSnapshot(
    SOCIAL_SNAPSHOT_PATH,
    (reason) => fallbackSnapshot({
      integrationId: 'unified-social',
      reason,
      notes: 'Run npm run social:sync after adding SOCIAL_SNAPSHOT_SOURCE to stage a local unified social snapshot for Instagram, Facebook, LinkedIn, and X.'
    })
  );
}

export async function loadGeneratedGmailSnapshot() {
  return readSnapshot(
    GMAIL_SNAPSHOT_PATH,
    (reason) => fallbackSnapshot({
      integrationId: 'gmail',
      reason,
      notes: 'Run npm run gmail:sync after adding Gmail OAuth credentials to enable live executive inbox data.'
    })
  );
}

export async function loadGeneratedCalendarSnapshot() {
  return readSnapshot(
    CALENDAR_SNAPSHOT_PATH,
    (reason) => fallbackSnapshot({
      integrationId: 'google-calendar',
      reason,
      notes: 'Run npm run calendar:sync after adding Google Calendar OAuth credentials to enable live operations calendar data.'
    })
  );
}
